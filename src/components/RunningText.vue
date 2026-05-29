<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const scrollSpeed = ref(1)
const lastScrollTop = ref(0)
let scrollTimeout = null

const handleScrollForRunningText = () => {
  const st = window.pageYOffset || document.documentElement.scrollTop
  const diff = Math.abs(st - lastScrollTop.value)
  
  // Kecepatan proporsional dengan perbedaan scroll, min 1, max 10
  scrollSpeed.value = Math.min(10, 1 + diff * 0.15)
  lastScrollTop.value = st <= 0 ? 0 : st
  
  if (scrollTimeout) clearTimeout(scrollTimeout)
  scrollTimeout = setTimeout(() => {
    scrollSpeed.value = 1
  }, 150)
}

onMounted(() => {
  window.addEventListener('scroll', handleScrollForRunningText)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScrollForRunningText)
})
</script>

<template>
  <div
    class="w-full border-y border-white/10 bg-black/40 backdrop-blur-md py-4 my-8 overflow-hidden relative z-10"
  >
    <div
      class="running-text-content flex gap-8 whitespace-nowrap animate-marquee"
      :style="{ animationDuration: (22 / scrollSpeed) + 's' }"
    >
      <span
        v-for="i in 4"
        :key="i"
        class="text-sm sm:text-base font-extrabold tracking-widest uppercase flex items-center gap-8 text-white/80"
      >
        <span>⚡ PADEL48: PLAY PADEL WITH JKT48 MEMBERS</span>
        <span class="text-padel-teal">●</span>
        <span>BOOK YOUR SENSATIONAL COURT TODAY</span>
        <span class="text-padel-red">●</span>
        <span>DISCOUNT 20% ON WEEKDAYS SESSIONS</span>
        <span class="text-padel-gold">●</span>
        <span>CHALLENGE YOUR FAVORITE IDOL INDOORS</span>
        <span class="text-padel-teal">●</span>
      </span>
    </div>
  </div>
</template>
