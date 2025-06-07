import { defineStore } from 'pinia'

export const useDraftStore = defineStore('draft', {
  state: () => ({
    selectedTeam: 'radiant' as 'radiant' | 'dire',
    currentPhase: null as number | null,
    bannedHeroes: {
      radiant: [] as string[],
      dire: [] as string[]
    },
    pickedHeroes: {
      radiant: [] as string[],
      dire: [] as string[]
    },
    selectedHero: null as string | null
  }),
  
  actions: {
    setSelectedTeam(team: 'radiant' | 'dire') {
      this.selectedTeam = team
    },
    setCurrentPhase(phase: number) {
      this.currentPhase = phase
    },
    banHero(hero: string) {
      const currentTeam = this.selectedTeam
      this.bannedHeroes[currentTeam].push(hero)
      this.selectedHero = null
    },
    pickHero(hero: string) {
      const currentTeam = this.selectedTeam
      this.pickedHeroes[currentTeam].push(hero)
      this.selectedHero = null
    },
    selectHero(hero: string) {
      this.selectedHero = hero
    },
    isHeroBanned(hero: string) {
      return this.bannedHeroes.radiant.includes(hero) || this.bannedHeroes.dire.includes(hero)
    },
    isHeroPicked(hero: string) {
      return this.pickedHeroes.radiant.includes(hero) || this.pickedHeroes.dire.includes(hero)
    }
  }
}) 