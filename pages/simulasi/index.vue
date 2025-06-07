<template>
    <div class="w-full max-w-7xl mx-auto p-4">
        <!-- Search Overlay -->
        <div v-if="searchText" 
             class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
            <div class="text-4xl font-bold text-white bg-black bg-opacity-50 px-8 py-4 rounded-lg">
                {{ searchText.toUpperCase() }}
            </div>
        </div>

        <h1 class="text-4xl font-bold mb-8 text-center">Draft Simulasi</h1>
        
        <!-- Draft Timeline -->
        <div class="mb-8">
            <div class="flex items-center justify-center space-x-2">
                <div v-for="(phase, index) in draftOrder" :key="index"
                    class="relative flex items-center">
                    <!-- Phase Circle -->
                    <div class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold"
                        :class="[
                            phase.team === 'radiant' ? 'bg-[#FFD700] text-black' : 'bg-[#FF0000] text-white',
                            draftStore.currentPhase === index ? 'ring-4 ring-white' : 'opacity-50'
                        ]">
                        <span v-if="draftStore.currentPhase === null || index > draftStore.currentPhase">
                            {{ phase.phase === 'ban' ? 'Ban' : 'Pick' }}
                        </span>
                        <span v-else-if="index < draftStore.currentPhase">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                            </svg>
                        </span>
                        <span v-else>
                            {{ phase.phase === 'ban' ? 'Ban' : 'Pick' }}
                        </span>
                    </div>
                    <!-- Connector Line -->
                    <div v-if="index < draftOrder.length - 1" 
                        class="w-5 h-0.5"
                        :class="phase.team === 'radiant' ? 'bg-[#FFD700]' : 'bg-[#FF0000]'">
                    </div>
                </div>
            </div>
            <!-- Phase Info -->
            <div class="text-center mt-4">
                <span class="text-lg font-semibold">
                    {{ draftStore.currentPhase !== null ? 
                        `Fase ${draftStore.currentPhase + 1}: ${draftOrder[draftStore.currentPhase].team === 'radiant' ? 'Radiant' : 'Dire'} ${draftOrder[draftStore.currentPhase].phase === 'ban' ? 'Ban' : 'Pick'}` 
                        : 'Draft Akan Dimulai' }}
                </span>
                <span v-if="countdown > 0" class="ml-2 text-red-500 font-bold animate-pulse">
                    {{ countdown }}
                </span>
            </div>
        </div>

        <div class="grid grid-cols-2 gap-8 mb-8">
            <!-- Radiant Side -->
            <div class="space-y-4">
                <h2 class="text-2xl font-bold text-[#FFD700]">Radiant</h2>
                <!-- Picked Heroes -->
                <div>
                    <h3 class="text-lg font-semibold mb-2">Picked Heroes</h3>
                    <div class="grid grid-cols-5 gap-2">
                        <div v-for="(hero, index) in draftStore.pickedHeroes.radiant" :key="`radiant-pick-${index}`" 
                             class="aspect-square bg-[#3b2a26] rounded-lg overflow-hidden">
                            <img :src="heroImage(hero)" :alt="hero" class="w-full h-full object-cover">
                            <div class="bg-black bg-opacity-50 p-1 text-xs text-center -mt-6">
                                {{ hero }}
                            </div>
                        </div>
                        <div v-for="i in 5 - draftStore.pickedHeroes.radiant.length" :key="`radiant-pick-empty-${i}`" 
                             class="aspect-square bg-[#3b2a26] rounded-lg flex items-center justify-center">
                            <span class="text-gray-400">Hero {{ draftStore.pickedHeroes.radiant.length + i }}</span>
                        </div>
                    </div>
                </div>
                <!-- Banned Heroes -->
                <div>
                    <h3 class="text-lg font-semibold mb-2">Banned Heroes</h3>
                    <div class="grid grid-cols-7 gap-1">
                        <div v-for="(hero, index) in draftStore.bannedHeroes.radiant" :key="`radiant-ban-${index}`" 
                             class="aspect-square bg-[#3b2a26] rounded-lg overflow-hidden">
                            <img :src="heroImage(hero)" :alt="hero" class="w-full h-full object-cover">
                            <div class="bg-black bg-opacity-50 p-1 text-xs text-center -mt-6">
                                {{ hero }}
                            </div>
                        </div>
                        <div v-for="i in 7 - draftStore.bannedHeroes.radiant.length" :key="`radiant-ban-empty-${i}`" 
                             class="aspect-square bg-[#3b2a26] rounded-lg flex items-center justify-center">
                            <span class="text-gray-400 text-xs">Ban {{ draftStore.bannedHeroes.radiant.length + i }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Dire Side -->
            <div class="space-y-4">
                <h2 class="text-2xl font-bold text-[#FF0000]">Dire</h2>
                <!-- Picked Heroes -->
                <div>
                    <h3 class="text-lg font-semibold mb-2">Picked Heroes</h3>
                    <div class="grid grid-cols-5 gap-2">
                        <div v-for="(hero, index) in draftStore.pickedHeroes.dire" :key="`dire-pick-${index}`" 
                             class="aspect-square bg-[#3b2a26] rounded-lg overflow-hidden">
                            <img :src="heroImage(hero)" :alt="hero" class="w-full h-full object-cover">
                            <div class="bg-black bg-opacity-50 p-1 text-xs text-center -mt-6">
                                {{ hero }}
                            </div>
                        </div>
                        <div v-for="i in 5 - draftStore.pickedHeroes.dire.length" :key="`dire-pick-empty-${i}`" 
                             class="aspect-square bg-[#3b2a26] rounded-lg flex items-center justify-center">
                            <span class="text-gray-400">Hero {{ draftStore.pickedHeroes.dire.length + i }}</span>
                        </div>
                    </div>
                </div>
                <!-- Banned Heroes -->
                <div>
                    <h3 class="text-lg font-semibold mb-2">Banned Heroes</h3>
                    <div class="grid grid-cols-7 gap-1">
                        <div v-for="(hero, index) in draftStore.bannedHeroes.dire" :key="`dire-ban-${index}`" 
                             class="aspect-square bg-[#3b2a26] rounded-lg overflow-hidden">
                            <img :src="heroImage(hero)" :alt="hero" class="w-full h-full object-cover">
                            <div class="bg-black bg-opacity-50 p-1 text-xs text-center -mt-6">
                                {{ hero }}
                            </div>
                        </div>
                        <div v-for="i in 7 - draftStore.bannedHeroes.dire.length" :key="`dire-ban-empty-${i}`" 
                             class="aspect-square bg-[#3b2a26] rounded-lg flex items-center justify-center">
                            <span class="text-gray-400 text-xs">Ban {{ draftStore.bannedHeroes.dire.length + i }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Draft Controls -->
        <div class="flex justify-center space-x-4 mb-8">
            <button v-if="shouldShowBanButton" 
                    @click="handleBanHero"
                    :disabled="!draftStore.selectedHero"
                    class="bg-[#3b2a26] hover:bg-[#4a3a36] px-6 py-3 rounded-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
                Ban Hero
            </button>
            <button v-if="shouldShowPickButton"
                    @click="handlePickHero"
                    :disabled="!draftStore.selectedHero"
                    class="bg-[#3b2a26] hover:bg-[#4a3a36] px-6 py-3 rounded-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
                Pick Hero
            </button>
        </div>

        <!-- Hero Grid -->
        <div class="grid grid-cols-4 gap-8">
            <!-- Strength Heroes -->
            <div class="space-y-4">
                <h3 class="text-xl font-bold text-[#FF0000]">Strength</h3>
                <div class="grid grid-cols-3 gap-2">
                    <div v-for="hero in heroes.strength" :key="hero" 
                         :data-hero="hero"
                         class="aspect-square bg-[#3b2a26] rounded-lg overflow-hidden cursor-pointer hover:bg-[#4a3a36] transition-all hover:scale-110 relative"
                         :class="{ 
                             'opacity-50 cursor-not-allowed': draftStore.isHeroBanned(hero) || draftStore.isHeroPicked(hero),
                             'ring-4 ring-white': draftStore.selectedHero === hero
                         }"
                         @click="!draftStore.isHeroBanned(hero) && !draftStore.isHeroPicked(hero) && draftStore.selectHero(hero)">
                        <img :src="heroImage(hero)" :alt="hero" class="w-full h-full object-cover">
                        <div class="bg-black bg-opacity-50 p-1 text-xs text-center -mt-6">
                            {{ hero }}
                        </div>
                        <div v-if="draftStore.isHeroBanned(hero)" 
                             class="absolute inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
                            <span class="text-red-500 font-bold">BANNED</span>
                        </div>
                        <div v-if="draftStore.isHeroPicked(hero)" 
                             class="absolute inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
                            <span class="text-green-500 font-bold">PICKED</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Agility Heroes -->
            <div class="space-y-4">
                <h3 class="text-xl font-bold text-[#00FF00]">Agility</h3>
                <div class="grid grid-cols-3 gap-2">
                    <div v-for="hero in heroes.agility" :key="hero" 
                         :data-hero="hero"
                         class="aspect-square bg-[#3b2a26] rounded-lg overflow-hidden cursor-pointer hover:bg-[#4a3a36] transition-all hover:scale-110 relative"
                         :class="{ 
                             'opacity-50 cursor-not-allowed': draftStore.isHeroBanned(hero) || draftStore.isHeroPicked(hero),
                             'ring-4 ring-white': draftStore.selectedHero === hero
                         }"
                         @click="!draftStore.isHeroBanned(hero) && !draftStore.isHeroPicked(hero) && draftStore.selectHero(hero)">
                        <img :src="heroImage(hero)" :alt="hero" class="w-full h-full object-cover">
                        <div class="bg-black bg-opacity-50 p-1 text-xs text-center -mt-6">
                            {{ hero }}
                        </div>
                        <div v-if="draftStore.isHeroBanned(hero)" 
                             class="absolute inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
                            <span class="text-red-500 font-bold">BANNED</span>
                        </div>
                        <div v-if="draftStore.isHeroPicked(hero)" 
                             class="absolute inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
                            <span class="text-green-500 font-bold">PICKED</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Intelligence Heroes -->
            <div class="space-y-4">
                <h3 class="text-xl font-bold text-[#0000FF]">Intelligence</h3>
                <div class="grid grid-cols-3 gap-2">
                    <div v-for="hero in heroes.intelligence" :key="hero" 
                         :data-hero="hero"
                         class="aspect-square bg-[#3b2a26] rounded-lg overflow-hidden cursor-pointer hover:bg-[#4a3a36] transition-all hover:scale-110 relative"
                         :class="{ 
                             'opacity-50 cursor-not-allowed': draftStore.isHeroBanned(hero) || draftStore.isHeroPicked(hero),
                             'ring-4 ring-white': draftStore.selectedHero === hero
                         }"
                         @click="!draftStore.isHeroBanned(hero) && !draftStore.isHeroPicked(hero) && draftStore.selectHero(hero)">
                        <img :src="heroImage(hero)" :alt="hero" class="w-full h-full object-cover">
                        <div class="bg-black bg-opacity-50 p-1 text-xs text-center -mt-6">
                            {{ hero }}
                        </div>
                        <div v-if="draftStore.isHeroBanned(hero)" 
                             class="absolute inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
                            <span class="text-red-500 font-bold">BANNED</span>
                        </div>
                        <div v-if="draftStore.isHeroPicked(hero)" 
                             class="absolute inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
                            <span class="text-green-500 font-bold">PICKED</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Universal Heroes -->
            <div class="space-y-4">
                <h3 class="text-xl font-bold text-[#FFFF00]">Universal</h3>
                <div class="grid grid-cols-3 gap-2">
                    <div v-for="hero in heroes.universal" :key="hero" 
                         :data-hero="hero"
                         class="aspect-square bg-[#3b2a26] rounded-lg overflow-hidden cursor-pointer hover:bg-[#4a3a36] transition-all hover:scale-110 relative"
                         :class="{ 
                             'opacity-50 cursor-not-allowed': draftStore.isHeroBanned(hero) || draftStore.isHeroPicked(hero),
                             'ring-4 ring-white': draftStore.selectedHero === hero
                         }"
                         @click="!draftStore.isHeroBanned(hero) && !draftStore.isHeroPicked(hero) && draftStore.selectHero(hero)">
                        <img :src="heroImage(hero)" :alt="hero" class="w-full h-full object-cover">
                        <div class="bg-black bg-opacity-50 p-1 text-xs text-center -mt-6">
                            {{ hero }}
                        </div>
                        <div v-if="draftStore.isHeroBanned(hero)" 
                             class="absolute inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
                            <span class="text-red-500 font-bold">BANNED</span>
                        </div>
                        <div v-if="draftStore.isHeroPicked(hero)" 
                             class="absolute inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
                            <span class="text-green-500 font-bold">PICKED</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useDraftStore } from '~/stores/draft'

const draftStore = useDraftStore()
const countdown = ref(5)
const searchText = ref('')
const searchTimeout = ref(null)

// Handle keyboard input for hero search
const handleKeyPress = (event) => {
    // Only handle if it's a letter, number, space, or backspace
    if (!/^[a-zA-Z0-9\s]$/.test(event.key) && event.key !== 'Backspace') return

    // Clear previous timeout
    if (searchTimeout.value) {
        clearTimeout(searchTimeout.value)
    }

    if (event.key === 'Backspace') {
        // Handle backspace
        searchText.value = searchText.value.slice(0, -1)
    } else {
        // Add character to search text
        searchText.value += event.key.toLowerCase()
    }

    // Find matching hero
    const allHeroes = [
        ...heroes.strength,
        ...heroes.agility,
        ...heroes.intelligence,
        ...heroes.universal
    ]

    const matchingHero = allHeroes.find(hero => 
        hero.toLowerCase().includes(searchText.value)
    )

    if (matchingHero && !draftStore.isHeroBanned(matchingHero) && !draftStore.isHeroPicked(matchingHero)) {
        draftStore.selectHero(matchingHero)
        // Scroll to the selected hero after a short delay to ensure DOM is updated
        setTimeout(() => {
            const selectedHeroElement = document.querySelector(`[data-hero="${matchingHero}"]`)
            if (selectedHeroElement) {
                selectedHeroElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                })
            }
        }, 100)
    }

    // Clear search text after 1 second
    searchTimeout.value = setTimeout(() => {
        searchText.value = ''
    }, 1000)
}

// Add and remove keyboard event listener
onMounted(() => {
    window.addEventListener('keydown', handleKeyPress)
})

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyPress)
    if (searchTimeout.value) {
        clearTimeout(searchTimeout.value)
    }
})

// Start countdown when component is mounted
onMounted(() => {
    const timer = setInterval(() => {
        countdown.value--
        if (countdown.value <= 0) {
            clearInterval(timer)
            draftStore.setCurrentPhase(0)
        }
    }, 1000)
})

// Computed properties untuk kontrol button
const shouldShowBanButton = computed(() => {
  if (draftStore.currentPhase === null) return false
  const currentDraftPhase = draftOrder[draftStore.currentPhase]
  return currentDraftPhase.team === draftStore.selectedTeam && currentDraftPhase.phase === 'ban'
})

const shouldShowPickButton = computed(() => {
  if (draftStore.currentPhase === null) return false
  const currentDraftPhase = draftOrder[draftStore.currentPhase]
  return currentDraftPhase.team === draftStore.selectedTeam && currentDraftPhase.phase === 'pick'
})

const heroImage = (hero) => {
    return `/images/${hero.replace(/\s+/g, '_').replace(/[']/g, '')}_icon.webp`
}

// Data hero Dota 2
const heroes = {
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

// Data untuk urutan draft
const draftOrder = [
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

const handleBanHero = () => {
    if (draftStore.selectedHero) {
        draftStore.banHero(draftStore.selectedHero)
        // Move to next phase
        draftStore.setCurrentPhase(draftStore.currentPhase + 1)
    }
}

const handlePickHero = () => {
    if (draftStore.selectedHero) {
        draftStore.pickHero(draftStore.selectedHero)
        // Move to next phase
        draftStore.setCurrentPhase(draftStore.currentPhase + 1)
    }
}
</script>

