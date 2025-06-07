import { GoogleGenerativeAI } from '@google/generative-ai';

export const useGeminiService = () => {
    const config = useRuntimeConfig();
    const genAI = new GoogleGenerativeAI(config.public.geminiApiKey || '');
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const getBotDecision = async (
        currentPhase: number,
        draftOrder: any[],
        pickedHeroes: { radiant: string[], dire: string[] },
        bannedHeroes: { radiant: string[], dire: string[] },
        allHeroes: { strength: string[], agility: string[], intelligence: string[], universal: string[] }
    ): Promise<string> => {
        try {
            const currentDraftPhase = draftOrder[currentPhase];
            const isBanPhase = currentDraftPhase.phase === 'ban';
            const botTeam = currentDraftPhase.team;
            const enemyTeam = botTeam === 'radiant' ? 'dire' : 'radiant';

            // Prepare the context for the AI
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

            // Create the prompt for the AI
            const prompt = createPrompt(context);

            // Get response from Gemini
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // Parse the response to get the hero name
            return parseHeroName(text);
        } catch (error) {
            console.error('Error getting bot decision:', error);
            // Return a random hero as fallback
            return getRandomHero(pickedHeroes, bannedHeroes, allHeroes);
        }
    };

    const createPrompt = (context: any): string => {
        return `
You are a Dota 2 draft AI assistant. Your task is to ${context.phase} a hero for the ${context.botTeam} team.

Current game state:
- Bot team (${context.botTeam}) picks: ${context.currentPicks.bot.join(', ') || 'none'}
- Enemy team (${context.enemyTeam}) picks: ${context.currentPicks.enemy.join(', ') || 'none'}
- Bot team bans: ${context.currentBans.bot.join(', ') || 'none'}
- Enemy team bans: ${context.currentBans.enemy.join(', ') || 'none'}
- Available heroes: ${context.availableHeroes.join(', ')}

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
        // Clean up the response to get just the hero name
        const cleanText = text.trim().replace(/["']/g, '');
        return cleanText;
    };

    const getRandomHero = (
        pickedHeroes: { radiant: string[], dire: string[] },
        bannedHeroes: { radiant: string[], dire: string[] },
        allHeroes: { strength: string[], agility: string[], intelligence: string[], universal: string[] }
    ): string => {
        const availableHeroes = getAvailableHeroes(pickedHeroes, bannedHeroes, allHeroes);
        const randomIndex = Math.floor(Math.random() * availableHeroes.length);
        return availableHeroes[randomIndex];
    };

    const analyzeDraft = async (
        pickedHeroes: { radiant: string[], dire: string[] },
        bannedHeroes: { radiant: string[], dire: string[] }
    ) => {
        try {
            const prompt = `Analyze this Dota 2 draft and provide a detailed analysis:

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

Format the response in a clear, structured way.`

            const result = await model.generateContent(prompt)
            const response = await result.response
            return response.text()
        } catch (error) {
            console.error('Error analyzing draft:', error)
            throw error
        }
    }

    return {
        getBotDecision,
        analyzeDraft
    };
}; 