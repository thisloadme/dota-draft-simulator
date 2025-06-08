import { defineStore } from 'pinia'
import { useGeminiService } from '~/services/gemini'

// Data untuk urutan draft
export const draftOrder = [
    { phase: 'ban', team: 'radiant' },
    { phase: 'ban', team: 'dire' },
    { phase: 'ban', team: 'dire' },
    { phase: 'ban', team: 'radiant' },
    { phase: 'ban', team: 'dire' },
    { phase: 'ban', team: 'dire' },
    { phase: 'ban', team: 'radiant' },
    { phase: 'pick', team: 'radiant' },
    { phase: 'pick', team: 'dire' },
    { phase: 'ban', team: 'radiant' },
    { phase: 'ban', team: 'radiant' },
    { phase: 'ban', team: 'dire' },
    { phase: 'pick', team: 'dire' },
    { phase: 'pick', team: 'radiant' },
    { phase: 'pick', team: 'radiant' },
    { phase: 'pick', team: 'dire' },
    { phase: 'pick', team: 'dire' },
    { phase: 'pick', team: 'radiant' },
    { phase: 'ban', team: 'radiant' },
    { phase: 'ban', team: 'dire' },
    { phase: 'ban', team: 'dire' },
    { phase: 'ban', team: 'radiant' },
    { phase: 'pick', team: 'radiant' },
    { phase: 'pick', team: 'dire' }
]

// Data hero Dota 2
export const heroes = {
    strength: [
        'Alchemist', 'Axe', 'Bristleback', 'Centaur Warrunner', 'Chaos Knight', 'Clockwerk',
        'Dawnbreaker', 'Doom', 'Dragon Knight', 'Earth Spirit', 'Earthshaker',
        'Elder Titan', 'Huskar', 'Kunkka', 'Legion Commander', 'Lifestealer',
        'Lycan', 'Mars', 'Night Stalker', 'Ogre Magi', 'Omniknight',
        'Phoenix', 'Primal Beast', 'Pudge', 'Slardar', 'Spirit Breaker',
        'Sven', 'Tidehunter', 'Timbersaw', 'Tiny', 'Treant Protector',
        'Tusk', 'Underlord', 'Undying', 'Wraith King'
    ],
    agility: [
        'Anti-Mage', 'Bloodseeker', 'Bounty Hunter', 'Broodmother',
        'Clinkz', 'Drow Ranger', 'Ember Spirit', 'Faceless Void', 'Gyrocopter',
        'Hoodwink', 'Juggernaut', 'Kez', 'Lone Druid', 'Luna',
        'Medusa', 'Meepo', 'Mirana', 'Monkey King', 'Morphling',
        'Naga Siren', 'Phantom Assassin', 'Phantom Lancer', 'Razor', 'Riki',
        'Shadow Fiend', 'Slark', 'Sniper', 'Templar Assassin', 'Terrorblade',
        'Troll Warlord', 'Ursa', 'Vengeful Spirit', 'Viper', 'Weaver'
    ],
    intelligence: [
        'Ancient Apparition', 'Chen', 'Crystal Maiden', 'Dark Seer', 'Dark Willow', 'Disruptor',
        'Enchantress', 'Grimstroke', 'Invoker', 'Jakiro', 'Keeper of the Light',
        'Leshrac', 'Lich', 'Lina', 'Lion', 'Muerta',
        'Necrophos', 'Oracle', 'Outworld Destroyer', 'Puck', 'Pugna',
        'Queen of Pain', 'Ringmaster', 'Rubick', 'Shadow Demon', 'Shadow Shaman',
        'Silencer', 'Skywrath Mage', 'Storm Spirit', 'Tinker', 'Warlock',
        'Winter Wyvern', 'Witch Doctor', 'Zeus'
    ],
    universal: [
        'Arc Warden', 'Bane', 'Batrider', 'Beastmaster', 'Brewmaster',
        'Dazzle', 'Death Prophet', 'Enigma', 'Io', 'Magnus',
        'Marci', 'Nature\'s Prophet', 'Nyx Assassin', 'Pangolier', 'Sand King',
        'Snapfire', 'Spectre', 'Techies', 'Venomancer', 'Visage',
        'Void Spirit', 'Windranger'
    ]
}

export const useDraftStore = defineStore('draft', {
    state: () => ({
        currentPhase: null as number | null,
        selectedTeam: null as 'radiant' | 'dire' | null,
        selectedHero: null as string | null,
        pickedHeroes: {
            radiant: [] as string[],
            dire: [] as string[]
        },
        bannedHeroes: {
            radiant: [] as string[],
            dire: [] as string[]
        },
        isBotThinking: false,
        analysis: null as string | null,
        isAnalyzing: false,
        useTimeLimit: false,
        timeLimit: 30,
        remainingTime: 0,
        isTimeUp: false
    }),

    actions: {
        setCurrentPhase(phase: number | null) {
            this.currentPhase = phase
            if (phase !== null) {
                this.checkBotTurn()
                // Reset time when phase changes
                if (this.useTimeLimit) {
                    this.remainingTime = this.timeLimit
                    this.isTimeUp = false
                }
            }
        },

        setSelectedTeam(team: 'radiant' | 'dire') {
            this.selectedTeam = team
        },

        setTimeLimit(useTimeLimit: boolean, timeLimit: number = 30) {
            this.useTimeLimit = useTimeLimit
            this.timeLimit = timeLimit
            this.remainingTime = timeLimit
            this.isTimeUp = false
        },

        decrementTime() {
            if (this.useTimeLimit && this.remainingTime > 0) {
                this.remainingTime--
                if (this.remainingTime === 0) {
                    this.isTimeUp = true
                }
            }
        },

        selectHero(hero: string) {
            this.selectedHero = hero
        },

        banHero(hero: string) {
            if (this.currentPhase === null || this.selectedTeam === null) return

            const currentDraftPhase = draftOrder[this.currentPhase]
            const team = currentDraftPhase.team as 'radiant' | 'dire'

            if (!this.isHeroBanned(hero) && !this.isHeroPicked(hero)) {
                this.bannedHeroes[team].push(hero)
            }
        },

        pickHero(hero: string) {
            if (this.currentPhase === null || this.selectedTeam === null) return

            const currentDraftPhase = draftOrder[this.currentPhase]
            const team = currentDraftPhase.team as 'radiant' | 'dire'

            if (!this.isHeroBanned(hero) && !this.isHeroPicked(hero)) {
                this.pickedHeroes[team].push(hero)
            }
        },

        isHeroBanned(hero: string): boolean {
            return this.bannedHeroes.radiant.includes(hero) || this.bannedHeroes.dire.includes(hero)
        },

        isHeroPicked(hero: string): boolean {
            return this.pickedHeroes.radiant.includes(hero) || this.pickedHeroes.dire.includes(hero)
        },

        async checkBotTurn() {
            if (this.currentPhase === null || this.selectedTeam === null) return

            const currentDraftPhase = draftOrder[this.currentPhase]
            const isBotTurn = currentDraftPhase.team !== this.selectedTeam

            if (isBotTurn) {
                this.isBotThinking = true
                try {
                    // Add random delay between 1-3 seconds
                    const delay = Math.floor(Math.random() * 2000) + 1000 // Random between 1000-3000ms
                    await new Promise(resolve => setTimeout(resolve, delay))

                    const geminiService = useGeminiService()
                    const botDecision = await geminiService.getBotDecision(
                        this.currentPhase,
                        draftOrder,
                        this.pickedHeroes,
                        this.bannedHeroes,
                        heroes
                    )

                    if (currentDraftPhase.phase === 'ban') {
                        this.banHero(botDecision)
                    } else {
                        this.pickHero(botDecision)
                    }

                    // Move to next phase only if not in the last phase
                    if (this.currentPhase < draftOrder.length - 1) {
                        this.setCurrentPhase(this.currentPhase + 1)
                    } else {
                        // If it's the last phase, just set isBotThinking to false
                        this.isBotThinking = false
                    }
                } catch (error) {
                    console.error('Error in bot decision:', error)
                    this.isBotThinking = false
                }
            }
        },

        async analyzeDraft() {
            if (this.currentPhase !== draftOrder.length - 1) return

            this.isAnalyzing = true
            try {
                const geminiService = useGeminiService()
                this.analysis = await geminiService.analyzeDraft(this.pickedHeroes, this.bannedHeroes)
            } catch (error) {
                console.error('Error analyzing draft:', error)
                this.analysis = 'Error analyzing draft. Please try again.'
            } finally {
                this.isAnalyzing = false
            }
        },

        resetDraft() {
            this.currentPhase = 0
            this.selectedHero = null
            this.pickedHeroes = {
                radiant: [],
                dire: []
            }
            this.bannedHeroes = {
                radiant: [],
                dire: []
            }
            this.isBotThinking = false
            this.analysis = null
            this.isAnalyzing = false
            this.remainingTime = this.timeLimit
            this.isTimeUp = false
        },

        restartDraft() {
            this.currentPhase = null
            this.selectedTeam = null
            this.selectedHero = null
            this.pickedHeroes = {
                radiant: [],
                dire: []
            }
            this.bannedHeroes = {
                radiant: [],
                dire: []
            }
            this.isBotThinking = false
            this.analysis = null
            this.isAnalyzing = false
            this.remainingTime = this.timeLimit
            this.isTimeUp = false
        }
    }
}) 