export const useGeminiService = () => {
    const getBotDecision = async (
        currentPhase: number,
        draftOrder: any[],
        pickedHeroes: { radiant: string[], dire: string[] },
        bannedHeroes: { radiant: string[], dire: string[] },
        allHeroes: { strength: string[], agility: string[], intelligence: string[], universal: string[] }
    ): Promise<string> => {
        try {
            const response = await $fetch('/api/gemini', {
                method: 'POST',
                body: {
                    type: 'botDecision',
                    data: {
                        currentPhase,
                        draftOrder,
                        pickedHeroes,
                        bannedHeroes,
                        allHeroes
                    }
                }
            });
            return response as string;
        } catch (error) {
            console.error('Error getting bot decision:', error);
            // Return a random hero as fallback
            return getRandomHero(pickedHeroes, bannedHeroes, allHeroes);
        }
    };

    const analyzeDraft = async (
        pickedHeroes: { radiant: string[], dire: string[] },
        bannedHeroes: { radiant: string[], dire: string[] }
    ) => {
        try {
            const response = await $fetch('/api/gemini', {
                method: 'POST',
                body: {
                    type: 'analyzeDraft',
                    data: {
                        pickedHeroes,
                        bannedHeroes
                    }
                }
            });
            return response as string;
        } catch (error) {
            console.error('Error analyzing draft:', error);
            throw error;
        }
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

    const getRandomHero = (
        pickedHeroes: { radiant: string[], dire: string[] },
        bannedHeroes: { radiant: string[], dire: string[] },
        allHeroes: { strength: string[], agility: string[], intelligence: string[], universal: string[] }
    ): string => {
        const availableHeroes = getAvailableHeroes(pickedHeroes, bannedHeroes, allHeroes);
        const randomIndex = Math.floor(Math.random() * availableHeroes.length);
        return availableHeroes[randomIndex];
    };

    return {
        getBotDecision,
        analyzeDraft
    };
}; 