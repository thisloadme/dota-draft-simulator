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
            <button @click="startSimulation" class="bg-red-600 hover:bg-red-700 px-4 py-2 rounded">Mulai Simulasi</button>
        </div>
    </div>
</template>

<script setup>
import { useDraftStore } from '~/stores/draft'

const draftStore = useDraftStore()
const selectedTeam = ref(draftStore.selectedTeam)

const startSimulation = () => {
  draftStore.setSelectedTeam(selectedTeam.value)
  navigateTo('/simulasi')
}
</script>
