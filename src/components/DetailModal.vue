<script setup>
defineProps({
  model: {
    type: Object,
    default: null
  }
})

defineEmits(['close'])
</script>

<template>
  <div
    v-if="model"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
  >
    <div
      class="max-w-md w-full solid-panel border border-padel-teal/20 p-6 rounded-2xl flex flex-col space-y-4 shadow-xl relative animate-fade-in"
    >
      <!-- Close Button -->
      <button
        @click="$emit('close')"
        class="absolute top-4 right-4 text-padel-gray hover:text-white text-lg font-bold transition-colors cursor-pointer"
      >
        &times;
      </button>
      
      <h3 class="text-lg font-black text-padel-teal border-b border-white/10 pb-2 flex items-center gap-2">
        <span>🎾</span> {{ model.title }}
      </h3>
      
      <div class="w-full h-48 rounded-xl overflow-hidden border border-white/10 bg-black">
        <img :src="model.img" alt="Detail visual" class="w-full h-full object-cover" />
      </div>
      
      <p class="text-xs text-padel-gray leading-relaxed">{{ model.desc }}</p>
      
      <button
        @click="$emit('close')"
        class="w-full py-2.5 rounded-xl bg-padel-teal text-padel-dark font-extrabold text-xs transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
      >
        Tutup Rincian
      </button>
    </div>
  </div>
</template>

<style scoped>
.solid-panel {
  background-color: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}
</style>
