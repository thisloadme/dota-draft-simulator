<template>
    <div>
        <h1 class="text-4xl font-bold mb-8">Dota 2 Captain Mode Simulator</h1>
        <div class="text-center space-y-4">
            <h1 class="text-3xl font-bold">Pilih Tim</h1>
            <select v-model="selectedTeam" class="p-2 rounded bg-[#3b2a26] text-white">
                <option value="radiant">Radiant</option>
                <option value="dire">Dire</option>
            </select>
            <br />
            <div class="flex items-center justify-center gap-4">
                <label class="flex items-center gap-2">
                    <input type="checkbox" v-model="useTimeLimit" class="w-4 h-4">
                    Gunakan Batas Waktu
                </label>
                <input v-if="useTimeLimit" 
                       type="number" 
                       v-model="timeLimit" 
                       min="1" 
                       max="300"
                       class="w-20 p-2 rounded bg-[#3b2a26] text-white">
                <span v-if="useTimeLimit">detik</span>
            </div>
            <button @click="startSimulation" class="bg-red-600 hover:bg-red-700 px-4 py-2 rounded">Mulai Simulasi</button>
        </div>
    </div>
</template>

<script setup>
import { useDraftStore } from '~/stores/draft'

const draftStore = useDraftStore()
const selectedTeam = ref(draftStore.selectedTeam)
const useTimeLimit = ref(false)
const timeLimit = ref(30)

const startSimulation = () => {
    draftStore.setSelectedTeam(selectedTeam.value)
    draftStore.setTimeLimit(useTimeLimit.value, timeLimit.value)
    navigateTo('/simulasi')
}
</script>
