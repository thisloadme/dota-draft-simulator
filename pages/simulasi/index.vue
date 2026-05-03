<template>
  <div class="min-h-screen bg-[#0a0a0f] text-white">
    <!-- Search Overlay -->
    <div v-if="searchText"
         class="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div class="text-6xl font-black tracking-[0.5em] text-white/20 uppercase">
        {{ searchText }}
      </div>
    </div>

    <!-- Header Bar -->
    <header class="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0f0f14]">
      <div class="flex items-center gap-4">
        <button @click="handleRestartDraft"
          class="px-4 py-2 rounded-lg bg-[#1a1a24] hover:bg-[#252530] border border-white/10 transition-all duration-200 text-sm">
          Kembali
        </button>
        <h1 class="text-lg font-bold tracking-tight">
          <span class="text-[#22C55E]">DRAFT</span><span class="text-gray-500">SIM</span>
        </h1>
      </div>
      <button @click="handleResetDraft"
        class="px-4 py-2 rounded-lg bg-[#1a1a24] hover:bg-[#252530] border border-white/10 transition-all duration-200 text-sm">
        Ulangi
      </button>
    </header>

    <!-- Main Content -->
    <main class="px-6 py-8 max-w-[1600px] mx-auto">
      <!-- Draft Phase Timeline -->
      <section class="mb-8">
        <div class="flex items-center justify-center gap-1">
          <template v-for="(phase, index) in draftOrder" :key="index">
            <div class="relative group">
              <div class="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold uppercase transition-all duration-200"
                :class="getPhaseClass(index)">
                <span v-if="index > (draftStore.currentPhase ?? -1)">
                  {{ index + 1 }}
                </span>
                <span v-else-if="index < (draftStore.currentPhase ?? 0)" class="text-black">
                  <svg class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                </span>
                <span v-else class="text-black">
                  <svg class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"/>
                  </svg>
                </span>
              </div>
            </div>
            <div v-if="index < draftOrder.length - 1"
              class="w-3 h-[2px] rounded-full transition-all duration-200"
              :class="index < (draftStore.currentPhase ?? -1) ? 'bg-[#22C55E]' : 'bg-white/10'">
            </div>
          </template>
        </div>

        <!-- Current Phase Info -->
        <div class="flex items-center justify-center mt-6 gap-4">
          <div class="px-5 py-2 rounded-lg bg-[#0f0f14] border border-white/10">
            <span class="text-base font-bold" :class="currentPhaseColor">
              {{ currentPhaseLabel }}
            </span>
          </div>
          <div v-if="isPlayerTurn && draftStore.useTimeLimit && draftStore.remainingTime > 0"
               class="px-5 py-2 rounded-lg bg-[#0f0f14] border border-[#22C55E]/30">
            <span class="text-xl font-bold tabular-nums" :class="{ 'text-red-500': draftStore.remainingTime <= 5 }">
              {{ draftStore.remainingTime }}
            </span>
            <span class="text-xs text-gray-500 ml-2 uppercase">detik</span>
          </div>
          <div v-if="draftStore.isBotThinking" class="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a1a24]">
            <div class="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse"></div>
            <span class="text-sm text-gray-400">Bot thinking...</span>
          </div>
        </div>
      </section>

      <!-- Teams Overview -->
      <section class="grid grid-cols-2 gap-6 mb-8">
        <!-- Radiant Team -->
        <div class="rounded-xl bg-[#0f0f14] border border-[#22C55E]/20 overflow-hidden">
          <div class="px-5 py-4 border-b border-[#22C55E]/10 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded bg-[#22C55E]"></div>
              <div>
                <h2 class="font-bold text-[#22C55E]">Radiant</h2>
                <p v-if="draftStore.selectedTeam === 'radiant'" class="text-[10px] text-gray-500 uppercase tracking-wider">Anda</p>
              </div>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-[#22C55E]">{{ draftStore.pickedHeroes.radiant.length }}</div>
              <div class="text-[10px] text-gray-500 uppercase tracking-wider">Picks</div>
            </div>
          </div>

          <!-- Picks -->
          <div class="p-4">
            <h3 class="text-[10px] uppercase tracking-widest text-gray-500 mb-3">Heroes</h3>
            <div class="grid grid-cols-5 gap-2">
              <div v-for="(hero, i) in draftStore.pickedHeroes.radiant" :key="`r-pick-${i}`"
                   class="aspect-square rounded-lg overflow-hidden relative">
                <img :src="heroImage(hero)" :alt="hero" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div class="absolute bottom-0 left-0 right-0 p-1">
                  <span class="text-[10px] font-medium truncate block">{{ hero }}</span>
                </div>
              </div>
              <div v-for="i in (5 - draftStore.pickedHeroes.radiant.length)" :key="`r-pick-empty-${i}`"
                   class="aspect-square rounded-lg bg-[#1a1a24]/50 border border-dashed border-white/5 flex items-center justify-center">
                <span class="text-[10px] text-gray-600">{{ i + draftStore.pickedHeroes.radiant.length }}</span>
              </div>
            </div>
          </div>

          <!-- Bans -->
          <div class="p-4 border-t border-white/5">
            <h3 class="text-[10px] uppercase tracking-widest text-gray-500 mb-3">Bans</h3>
            <div class="flex flex-wrap gap-2">
              <div v-for="(hero, i) in draftStore.bannedHeroes.radiant" :key="`r-ban-${i}`"
                   class="w-12 h-12 rounded-lg overflow-hidden relative opacity-60 grayscale">
                <img :src="heroImage(hero)" :alt="hero" class="w-full h-full object-cover">
              </div>
              <div v-for="i in (7 - draftStore.bannedHeroes.radiant.length)" :key="`r-ban-empty-${i}`"
                   class="w-12 h-12 rounded-lg bg-[#1a1a24]/50 border border-dashed border-white/5"></div>
            </div>
          </div>
        </div>

        <!-- Dire Team -->
        <div class="rounded-xl bg-[#0f0f14] border border-[#EF4444]/20 overflow-hidden">
          <div class="px-5 py-4 border-b border-[#EF4444]/10 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded bg-[#EF4444]"></div>
              <div>
                <h2 class="font-bold text-[#EF4444]">Dire</h2>
                <p v-if="draftStore.selectedTeam === 'dire'" class="text-[10px] text-gray-500 uppercase tracking-wider">Anda</p>
              </div>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-[#EF4444]">{{ draftStore.pickedHeroes.dire.length }}</div>
              <div class="text-[10px] text-gray-500 uppercase tracking-wider">Picks</div>
            </div>
          </div>

          <!-- Picks -->
          <div class="p-4">
            <h3 class="text-[10px] uppercase tracking-widest text-gray-500 mb-3">Heroes</h3>
            <div class="grid grid-cols-5 gap-2">
              <div v-for="(hero, i) in draftStore.pickedHeroes.dire" :key="`d-pick-${i}`"
                   class="aspect-square rounded-lg overflow-hidden relative">
                <img :src="heroImage(hero)" :alt="hero" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div class="absolute bottom-0 left-0 right-0 p-1">
                  <span class="text-[10px] font-medium truncate block">{{ hero }}</span>
                </div>
              </div>
              <div v-for="i in (5 - draftStore.pickedHeroes.dire.length)" :key="`d-pick-empty-${i}`"
                   class="aspect-square rounded-lg bg-[#1a1a24]/50 border border-dashed border-white/5 flex items-center justify-center">
                <span class="text-[10px] text-gray-600">{{ i + draftStore.pickedHeroes.dire.length }}</span>
              </div>
            </div>
          </div>

          <!-- Bans -->
          <div class="p-4 border-t border-white/5">
            <h3 class="text-[10px] uppercase tracking-widest text-gray-500 mb-3">Bans</h3>
            <div class="flex flex-wrap gap-2">
              <div v-for="(hero, i) in draftStore.bannedHeroes.dire" :key="`d-ban-${i}`"
                   class="w-12 h-12 rounded-lg overflow-hidden relative opacity-60 grayscale">
                <img :src="heroImage(hero)" :alt="hero" class="w-full h-full object-cover">
              </div>
              <div v-for="i in (7 - draftStore.bannedHeroes.dire.length)" :key="`d-ban-empty-${i}`"
                   class="w-12 h-12 rounded-lg bg-[#1a1a24]/50 border border-dashed border-white/5"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- Action Button -->
      <section v-if="!draftStore.analysis" class="flex justify-center mb-8">
        <button v-if="shouldShowBanButton || shouldShowPickButton"
          @click="handleAction"
          :disabled="!draftStore.selectedHero || !isPlayerTurn"
          class="px-12 py-5 rounded-lg font-bold text-xl uppercase tracking-wider transition-all duration-200"
          :class="canAct
            ? (shouldShowBanButton
              ? 'bg-[#EF4444] text-white hover:bg-[#dc2626]'
              : 'bg-[#22C55E] text-black hover:bg-[#16a34a]')
            : 'bg-[#1a1a24] text-gray-500 cursor-not-allowed border border-white/5'">
          {{ shouldShowBanButton ? 'Ban Hero' : 'Pick Hero' }}
        </button>

        <button v-if="shouldShowAnalysisButton && !draftStore.isAnalyzing"
          @click="handleAnalysis"
          class="px-10 py-5 rounded-lg bg-[#22C55E] text-black font-bold text-lg uppercase tracking-wider hover:bg-[#16a34a] transition-all duration-200">
          Analisis Draft
        </button>

        <div v-if="draftStore.isAnalyzing" class="px-10 py-5 rounded-lg bg-[#1a1a24] border border-white/10 flex items-center gap-3">
          <div class="w-5 h-5 border-2 border-[#22C55E] border-t-transparent rounded-full animate-spin"></div>
          <span class="text-gray-400">Menganalisis...</span>
        </div>
      </section>

      <!-- Analysis Result -->
      <section v-if="draftStore.analysis" class="mb-8">
        <div class="rounded-xl bg-[#0f0f14] border border-white/10 p-6">
          <h2 class="text-xl font-bold mb-4">Hasil Analisis</h2>
          <VueMarkdown :source="draftStore.analysis" class="text-gray-300 prose prose-invert max-w-none" />
        </div>
      </section>

      <!-- Hero Grid -->
      <section v-if="!draftStore.analysis" class="grid grid-cols-4 gap-4">
        <div v-for="(heroList, attr) in heroCategories" :key="attr"
             class="rounded-xl bg-[#0f0f14] border border-white/5 overflow-hidden">
          <div class="px-4 py-3 border-b border-white/5 flex items-center gap-2">
            <div class="w-2 h-2 rounded-full" :class="attrColor(attr)"></div>
            <h3 class="font-bold text-xs uppercase tracking-wider">{{ attr }}</h3>
            <span class="ml-auto text-xs text-gray-500">{{ heroList.length }}</span>
          </div>
          <div class="p-2 grid grid-cols-5 gap-1 max-h-[320px] overflow-y-auto">
            <div v-for="hero in heroList" :key="hero"
                 :data-hero="hero"
                 class="aspect-square rounded overflow-hidden cursor-pointer transition-all duration-150 relative"
                 :class="getHeroClass(hero)"
                 @click="handleHeroClick(hero)">
              <img :src="heroImage(hero)" :alt="hero" class="w-full h-full object-cover">
              <div class="absolute bottom-0 left-0 right-0 p-0.5">
                <span class="text-[9px] truncate block">{{ hero }}</span>
              </div>
              <div v-if="draftStore.isHeroBanned(hero)"
                   class="absolute inset-0 bg-black/80 flex items-center justify-center">
                <span class="text-[9px] font-bold text-red-500">BAN</span>
              </div>
              <div v-else-if="draftStore.isHeroPicked(hero)"
                   class="absolute inset-0 bg-black/80 flex items-center justify-center">
                <span class="text-[9px] font-bold text-green-500">PICKED</span>
              </div>
              <div v-if="draftStore.selectedHero === hero"
                   class="absolute inset-0 ring-1 ring-white"></div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { useDraftStore, draftOrder, heroes } from '~/stores/draft'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import VueMarkdown from 'vue-markdown-render'

const router = useRouter()
const draftStore = useDraftStore()
const countdown = ref(5)
const searchText = ref('')
const searchTimeout = ref(null)
const timeInterval = ref(null)

const heroCategories = {
  strength: heroes.strength,
  agility: heroes.agility,
  intelligence: heroes.intelligence,
  universal: heroes.universal
}

const attrColor = (attr) => ({
  strength: 'bg-red-500',
  agility: 'bg-green-500',
  intelligence: 'bg-blue-500',
  universal: 'bg-yellow-500'
})[attr]

const isPlayerTurn = computed(() => {
  if (draftStore.currentPhase === null) return false
  const phase = draftOrder[draftStore.currentPhase]
  return phase.team === draftStore.selectedTeam
})

const canAct = computed(() => {
  return isPlayerTurn.value && draftStore.selectedHero
})

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

const shouldShowAnalysisButton = computed(() => {
  if (draftStore.currentPhase === null) return false
  // Only show when draft is complete: all 5 picks each team
  const radiantPicks = draftStore.pickedHeroes.radiant.length
  const direPicks = draftStore.pickedHeroes.dire.length
  return radiantPicks >= 5 && direPicks >= 5 && !shouldShowBanButton.value && !shouldShowPickButton.value
})

const currentPhaseLabel = computed(() => {
  if (draftStore.currentPhase === null) return 'Menunggu...'
  const phase = draftOrder[draftStore.currentPhase]
  return `Fase ${draftStore.currentPhase + 1}: ${phase.team === 'radiant' ? 'Radiant' : 'Dire'} ${phase.phase === 'ban' ? 'Ban' : 'Pick'}`
})

const currentPhaseColor = computed(() => {
  if (draftStore.currentPhase === null) return 'text-gray-400'
  const phase = draftOrder[draftStore.currentPhase]
  return phase.team === 'radiant' ? 'text-[#22C55E]' : 'text-[#EF4444]'
})

const getPhaseClass = (index) => {
  const phase = draftOrder[index]
  const isRadiant = phase.team === 'radiant'
  const isCurrentPhase = draftStore.currentPhase === index
  const isPastPhase = draftStore.currentPhase !== null && index < draftStore.currentPhase

  if (isPastPhase) return isRadiant ? 'bg-[#22C55E] text-black' : 'bg-[#EF4444] text-white'
  if (isCurrentPhase) return isRadiant ? 'bg-[#22C55E] text-black ring-2 ring-[#22C55E]/50' : 'bg-[#EF4444] text-white ring-2 ring-[#EF4444]/50'
  return 'bg-[#1a1a24] text-gray-500 border border-white/10'
}

const getHeroClass = (hero) => {
  const isBanned = draftStore.isHeroBanned(hero)
  const isPicked = draftStore.isHeroPicked(hero)
  const isSelected = draftStore.selectedHero === hero
  const isDisabled = isBanned || isPicked

  if (isDisabled) return 'opacity-40 cursor-not-allowed grayscale'
  if (isSelected) return 'ring-2 ring-white ring-offset-1 ring-offset-[#0a0a0f] scale-105 z-10'
  return 'hover:scale-110'
}

const handleHeroClick = (hero) => {
  if (draftStore.isHeroBanned(hero) || draftStore.isHeroPicked(hero) || !isPlayerTurn.value) return
  draftStore.selectHero(hero)
}

const handleAction = () => {
  if (!draftStore.selectedHero) return
  if (shouldShowBanButton.value) {
    draftStore.banHero(draftStore.selectedHero)
  } else if (shouldShowPickButton.value) {
    draftStore.pickHero(draftStore.selectedHero)
  }
  if (draftStore.currentPhase !== null && draftStore.currentPhase < draftOrder.length - 1) {
    draftStore.setCurrentPhase(draftStore.currentPhase + 1)
  }
}

const handleAnalysis = async () => {
  await draftStore.analyzeDraft()
}

const handleResetDraft = () => {
  draftStore.resetDraft()
  countdown.value = 5
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
      draftStore.setCurrentPhase(0)
    }
  }, 1000)
}

const handleRestartDraft = () => {
  draftStore.restartDraft()
  router.push('/')
}

const heroImage = (hero) => {
  return `/images/${hero.replace(/\s+/g, '_').replace(/[']/g, '')}_icon.webp`
}

const handleKeyPress = (event) => {
  if (!/^[a-zA-Z0-9\s]$/.test(event.key) && event.key !== 'Backspace') return
  if (searchTimeout.value) clearTimeout(searchTimeout.value)
  if (event.key === 'Backspace') {
    searchText.value = searchText.value.slice(0, -1)
  } else {
    searchText.value += event.key.toLowerCase()
  }

  const allHeroes = [...heroes.strength, ...heroes.agility, ...heroes.intelligence, ...heroes.universal]
  const matchingHero = allHeroes.find(hero => hero.toLowerCase().includes(searchText.value))
  if (matchingHero && !draftStore.isHeroBanned(matchingHero) && !draftStore.isHeroPicked(matchingHero)) {
    draftStore.selectHero(matchingHero)
    setTimeout(() => {
      const el = document.querySelector(`[data-hero="${matchingHero}"]`)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 100)
  }
  searchTimeout.value = setTimeout(() => { searchText.value = '' }, 1000)
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyPress)
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
      draftStore.setCurrentPhase(0)
    }
  }, 1000)
  if (draftStore.useTimeLimit) {
    timeInterval.value = setInterval(() => {
      if (draftStore.currentPhase !== null && draftOrder[draftStore.currentPhase].team === draftStore.selectedTeam) {
        draftStore.decrementTime()
      }
    }, 1000)
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyPress)
  if (searchTimeout.value) clearTimeout(searchTimeout.value)
  if (timeInterval.value) clearInterval(timeInterval.value)
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.1);
  border-radius: 2px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255,255,255,0.2);
}
</style>
