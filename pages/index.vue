<template>
  <div class="min-h-screen bg-[#0a0a0f] text-white overflow-hidden relative">
    <div class="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
      <!-- Logo / Title -->
      <div class="text-center mb-16">
        <div class="flex items-center justify-center gap-4 mb-4">
          <div class="w-2 h-16 bg-[#22C55E]"></div>
          <h1 class="text-5xl md:text-6xl font-black tracking-tight">
            <span class="text-[#22C55E]">DRAFT</span>
            <span class="text-white">SIM</span>
          </h1>
          <div class="w-2 h-16 bg-[#EF4444]"></div>
        </div>
        <p class="text-gray-500 text-sm tracking-[0.3em] uppercase">Captain Mode Simulator</p>
      </div>

      <!-- Team Selection Card -->
      <div class="w-full max-w-lg bg-[#0f0f14] border border-white/10 rounded-xl p-8">
        <div class="space-y-8">
          <!-- Team Selection -->
          <div>
            <label class="block text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Pilih Tim Anda</label>
            <div class="grid grid-cols-2 gap-4">
              <button @click="selectedTeam = 'radiant'"
                class="p-6 rounded-xl border-2 transition-all duration-200"
                :class="selectedTeam === 'radiant'
                  ? 'bg-[#22C55E]/10 border-[#22C55E]'
                  : 'bg-[#0f0f14] border-white/10 hover:border-white/30'">
                <div class="flex flex-col items-center gap-3">
                  <div class="w-16 h-16 rounded-full bg-[#22C55E] flex items-center justify-center">
                    <div class="w-6 h-6 bg-black rounded-sm"></div>
                  </div>
                  <span class="text-xl font-bold text-[#22C55E]">Radiant</span>
                </div>
              </button>

              <button @click="selectedTeam = 'dire'"
                class="p-6 rounded-xl border-2 transition-all duration-200"
                :class="selectedTeam === 'dire'
                  ? 'bg-[#EF4444]/10 border-[#EF4444]'
                  : 'bg-[#0f0f14] border-white/10 hover:border-white/30'">
                <div class="flex flex-col items-center gap-3">
                  <div class="w-16 h-16 rounded-full bg-[#EF4444] flex items-center justify-center">
                    <div class="w-6 h-6 bg-black rounded-sm"></div>
                  </div>
                  <span class="text-xl font-bold text-[#EF4444]">Dire</span>
                </div>
              </button>
            </div>
          </div>

          <!-- Time Limit Toggle -->
          <div>
            <label class="flex items-center gap-3 cursor-pointer group">
              <div class="relative">
                <input type="checkbox" v-model="useTimeLimit" class="sr-only">
                <div class="w-12 h-7 bg-[#1a1a24] rounded-full border border-white/10 transition-all duration-300"
                     :class="useTimeLimit ? 'bg-[#22C55E]/20 border-[#22C55E]' : 'group-hover:border-white/30'">
                </div>
                <div class="absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-all duration-300"
                     :class="useTimeLimit ? 'translate-x-5 bg-[#22C55E]' : ''"></div>
              </div>
              <span class="text-sm font-medium text-gray-300">Aktifkan Batas Waktu</span>
            </label>

            <div v-if="useTimeLimit" class="mt-4 flex items-center gap-4">
              <div class="flex-1 h-12 bg-[#1a1a24] rounded-lg flex items-center px-4 border border-white/10">
                <input type="number" v-model="timeLimit" min="5" max="300"
                       class="w-full bg-transparent text-white text-2xl font-bold text-center outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                       :class="useTimeLimit ? 'text-[#22C55E]' : ''">
              </div>
              <span class="text-sm text-gray-500 uppercase tracking-wider">detik / giliran</span>
            </div>
          </div>

          <!-- Start Button -->
          <button @click="startSimulation" :disabled="!selectedTeam"
            class="w-full py-5 rounded-lg font-bold text-lg uppercase tracking-wider transition-all duration-200"
            :class="selectedTeam
              ? 'bg-[#22C55E] text-black hover:bg-[#16a34a] disabled:opacity-50 disabled:cursor-not-allowed'
              : 'bg-[#1a1a24] text-gray-500 cursor-not-allowed border border-white/5'">
            Mulai Simulasi
          </button>
        </div>
      </div>

      <!-- Footer -->
      <div class="mt-12 text-center text-gray-600 text-xs">
        <p>Dota 2 Captain Mode Draft</p>
        <p>Patch 7.40</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useDraftStore } from '~/stores/draft'

const draftStore = useDraftStore()
const selectedTeam = ref('radiant')
const useTimeLimit = ref(false)
const timeLimit = ref(30)

const startSimulation = () => {
    draftStore.setSelectedTeam(selectedTeam.value)
    draftStore.setTimeLimit(useTimeLimit.value, timeLimit.value)
    navigateTo('/simulasi')
}
</script>
