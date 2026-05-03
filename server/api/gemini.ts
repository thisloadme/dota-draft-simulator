const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 500;

async function fetchWithRetry(
    url: string,
    options: RequestInit,
    retries = MAX_RETRIES
): Promise<any> {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
          const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            if (attempt === retries) throw error;
            await new Promise((r) => setTimeout(r, RETRY_DELAY_MS * attempt));
        }
    }
}

async function callMinimax(prompt: string, apiKey: string, baseUrl: string, model: string): Promise<string> {
    const result = await fetchWithRetry(baseUrl, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: model,
            messages: [{ role: 'user', content: prompt }]
        })
    });

    const textContent = result.content?.find((c: any) => c.type === 'text');
    if (!textContent?.text) {
        throw new Error('Invalid response format from MiniMax');
    }
    return textContent.text;
}

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const apiKey = config.minimaxApiKey;
    const baseUrl = config.minimaxBaseUrl;
    const model = config.minimaxModel;

    if (!apiKey || !baseUrl || !model) {
        throw createError({ statusCode: 500, message: 'MINIMAX config not complete' });
    }

    const body = await readBody(event);
    const { type, data } = body;

    try {
        if (type === 'botDecision') {
            const { currentPhase, draftOrder, pickedHeroes, bannedHeroes, allHeroes } = data;
            const currentDraftPhase = draftOrder[currentPhase];
            const isBanPhase = currentDraftPhase.phase === 'ban';
            const botTeam = currentDraftPhase.team;
            const enemyTeam = botTeam === 'radiant' ? 'dire' : 'radiant';

            const context = {
                phase: isBanPhase ? 'ban' : 'pick',
                botTeam,
                enemyTeam,
                currentPicks: {
                    bot: pickedHeroes[botTeam as 'radiant' | 'dire'],
                    enemy: pickedHeroes[enemyTeam as 'radiant' | 'dire']
                },
                currentBans: {
                    bot: bannedHeroes[botTeam as 'radiant' | 'dire'],
                    enemy: bannedHeroes[enemyTeam as 'radiant' | 'dire']
                },
                availableHeroes: getAvailableHeroes(pickedHeroes, bannedHeroes, allHeroes)
            };

            const prompt = createPrompt(context);
            const text = await callMinimax(prompt, apiKey, baseUrl, model);
            return parseHeroName(text);

        } else if (type === 'analyzeDraft') {
            const { pickedHeroes, bannedHeroes } = data;
            const prompt = `Analyze this Dota 2 draft and provide a detailed analysis using 7.40 patches:

Radiant Team Picks: ${pickedHeroes.radiant.join(', ')}
Radiant Team Bans: ${bannedHeroes.radiant.join(', ')}

Dire Team Picks: ${pickedHeroes.dire.join(', ')}
Dire Team Bans: ${bannedHeroes.dire.join(', ')}

Please provide:
1. Win probability percentage for each team
2. Key strengths of each team's draft
3. Key weaknesses of each team's draft
4. Important factors that could influence the game outcome
5. Suggested strategies for each team

Format the response in a clear, structured way.`;

            return await callMinimax(prompt, apiKey, baseUrl, model);
        }

        throw new Error('Invalid request type');
    } catch (error) {
        console.error('Error in MiniMax API:', error);
        console.error('Error details:', error.message, error.stack);
        throw createError({
            statusCode: 500,
            message: error.message || 'Error processing AI request'
        });
    }
});

const createPrompt = (context: any): string => {
    return `
You are a Dota 2 draft AI assistant. Your task is to ${context.phase} a hero for the ${context.botTeam} team.

Current game state:
- Bot team (${context.botTeam}) picks: ${context.currentPicks.bot.join(', ') || 'none'}
- Enemy team (${context.enemyTeam}) picks: ${context.currentPicks.enemy.join(', ') || 'none'}
- Bot team bans: ${context.currentBans.bot.join(', ') || 'none'}
- Enemy team bans: ${context.currentBans.enemy.join(', ') || 'none'}
- Available heroes: ${context.availableHeroes.join(', ')}
- Patches: 7.40

Consider the following when making your decision:
- Current meta and overpowered heroes that should be banned or picked
- Counter picks against enemy team's heroes
- Team composition synergy with your current picks
- Hero roles needed for your team (carry, support, initiator, etc.)
- Hero counters that enemy team might pick against your current lineup

Please respond with ONLY the name of the hero you want to ${context.phase}. Do not include any other text or explanation.
`;
};

const getAvailableHeroes = (
    pickedHeroes: { radiant: string[], dire: string[] },
    bannedHeroes: { radiant: string[], dire: string[] },
    allHeroes: { strength: string[], agility: string[], intelligence: string[], universal: string[] }
): string[] => {
    const allPickedHeroes = [...pickedHeroes.radiant, ...pickedHeroes.dire];
    const allBannedHeroes = [...bannedHeroes.radiant, ...bannedHeroes.dire];
    const allHeroesList = [
        ...allHeroes.strength,
        ...allHeroes.agility,
        ...allHeroes.intelligence,
        ...allHeroes.universal
    ];

    return allHeroesList.filter(hero =>
        !allPickedHeroes.includes(hero) && !allBannedHeroes.includes(hero)
    );
};

const parseHeroName = (text: string): string => {
    const cleanText = text.trim().replace(/["']/g, '');
    return cleanText;
};
