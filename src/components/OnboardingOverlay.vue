<script setup>
import { ref } from 'vue'
import onboardingCenterImg from '../assets/onboarding_center.png'

const emit = defineEmits(['start'])

const isLeaving = ref(false)

// Sound synthesis for padel bounce
const playBounceSound = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return
    const ctx = new AudioContext()
    
    // Suara pantulan pertama
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(160, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(70, ctx.currentTime + 0.12)
    
    gain.gain.setValueAtTime(0.25, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12)
    
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.13)
  } catch (e) {
    console.error('AudioContext tidak didukung atau terblokir:', e)
  }
}

const startOnboardingTransition = () => {
  isLeaving.value = true
  playBounceSound()
  sessionStorage.setItem('padel48_onboarding_shown', 'true')
  
  setTimeout(() => {
    emit('start')
  }, 1000)
}
</script>

<template>
  <transition name="onboarding-fade">
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl transition-all duration-1000"
      :class="isLeaving ? 'opacity-0' : ''"
    >
      <!-- Struktur 3-Kolom Layar Penuh -->
      <div
        class="absolute inset-0 grid grid-cols-1 lg:grid-cols-[240px_1fr_240px] h-full w-full overflow-hidden"
      >
        <!-- Bar Kiri (Slide ke Atas) -->
        <div
          class="hidden lg:flex flex-col justify-between p-8 bg-[#002e29] border-r border-white/5 transition-transform duration-1000 ease-in-out"
          :class="isLeaving ? '-translate-y-full opacity-0' : 'translate-y-0'"
        >
          <div class="flex flex-col space-y-6">
            <span
              class="text-xs font-black tracking-[0.2em] text-[#CCFF00] uppercase rotate-180 [writing-mode:vertical-lr] self-start mb-8 h-fit"
            >
              PADEL & IDOL COMMUNITY EVENT
            </span>
            <span
              class="text-[10px] text-white/40 font-bold uppercase rotate-180 [writing-mode:vertical-lr] self-start h-fit"
            >
              Landing Page Concept
            </span>
          </div>
          <div class="text-left font-sans">
            <h1
              class="text-4xl font-black tracking-tighter text-white uppercase select-none [writing-mode:vertical-lr] rotate-180 h-fit"
            >
              <span class="text-[#A61C22]">PADEL</span> 48
            </h1>
          </div>
        </div>

        <!-- Bagian Tengah -->
        <div
          class="flex flex-col items-center justify-center py-6 px-4 sm:px-8 bg-[#001f1c] relative overflow-hidden gap-y-4 sm:gap-y-6 lg:gap-y-8"
        >
          <!-- Header Brand di Mobile/Tablet -->
          <div class="lg:hidden text-center z-10">
            <h1 class="text-3xl font-black text-white">
              <span class="text-[#A61C22]">PADEL</span>48
            </h1>
          </div>

          <!-- Title: Padel48: JKT48 on Court -->
          <div
            class="text-center space-y-2 max-w-xl mx-auto z-10 transition-all duration-1000"
            :class="isLeaving ? 'translate-y-20 opacity-0 scale-95' : ''"
          >
            <h2 class="text-[10px] font-black tracking-[0.25em] text-[#CCFF00]/80 uppercase">
              ONBOARDING EXPERIENCE
            </h2>
            <h1 class="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-white leading-tight">
              Padel48:<br>
              <span class="italic font-serif font-normal text-[#CCFF00] text-2xl sm:text-4xl lg:text-5xl">
                JKT48 on Court
              </span>
            </h1>
          </div>

          <!-- Frame Smartphone & Gambar Tengah -->
          <div
            class="relative w-[280px] sm:w-[360px] md:w-[440px] lg:w-[480px] xl:w-[520px] h-[300px] sm:h-[380px] md:h-[460px] lg:h-[500px] xl:h-[540px] rounded-[36px] border-4 border-white/15 overflow-hidden shadow-2xl transition-all duration-1000 ease-in-out z-10"
            :class="isLeaving ? 'translate-y-full opacity-0 scale-90' : ''"
          >
            <img
              :src="onboardingCenterImg"
              alt="Onboarding Center"
              class="w-full h-full object-cover"
            />
            <div class="absolute inset-0 bg-black/20"></div>
            
            <!-- Tombol ORDER NOW -->
            <div class="absolute inset-0 flex items-center justify-center p-4">
              <button
                @click="startOnboardingTransition"
                class="px-10 py-4.5 rounded-full bg-white hover:bg-neutral-100 text-black font-black text-xs sm:text-sm tracking-widest uppercase shadow-2xl hover:scale-105 active:scale-95 transition-transform cursor-pointer flex items-center gap-2 border border-white/60"
              >
                ORDER NOW <span class="text-sm sm:text-base font-bold">&rarr;</span>
              </button>
            </div>

            <!-- Floating Tag 'BEST OF COURT' -->
            <div
              class="absolute bottom-20 right-6 bg-yellow-400 text-black text-[9px] sm:text-[10px] font-black uppercase tracking-widest py-2 px-4 rounded-full rotate-12 shadow-lg animate-pulse"
            >
              🏆 BEST OF COURT
            </div>

            <!-- Event Info Overlay -->
            <div
              class="absolute bottom-6 left-6 right-6 bg-black/80 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-center gap-3"
            >
              <div
                class="w-10 h-10 rounded-full bg-[#CCFF00]/20 flex items-center justify-center text-[#CCFF00] text-lg"
              >
                🎾
              </div>
              <div class="text-left">
                <p class="text-[10px] sm:text-xs font-black text-white">Padel48 Event: Fun Match & Meet-up</p>
                <p class="text-[8px] sm:text-[9px] text-gray-400">Smooth. Fast. Naturally Dynamic.</p>
              </div>
            </div>
          </div>

          <!-- Bottom Content -->
          <div
            class="w-full text-center space-y-3 z-10 transition-all duration-1000"
            :class="isLeaving ? 'translate-y-20 opacity-0' : ''"
          >
            <!-- Running Text Lengkung -->
            <div
              class="relative w-full overflow-hidden py-2 bg-[#CCFF00] text-black font-black uppercase text-[10px] sm:text-xs tracking-widest -rotate-2 scale-105 shadow-lg"
            >
              <div class="flex gap-8 whitespace-nowrap animate-marquee">
                <span>Community ● Energy ● Fun Match ● JKT48 Members ● Skill Sessions ● Dynamic Play</span>
                <span>Community ● Energy ● Fun Match ● JKT48 Members ● Skill Sessions ● Dynamic Play</span>
              </div>
            </div>

            <div class="pt-1 space-y-1">
              <h3 class="text-xl font-black text-white">
                Padel48 <span class="italic font-serif font-normal text-[#CCFF00]">Experience</span>
              </h3>
              <p class="text-[9px] sm:text-xs text-gray-300 max-w-md mx-auto uppercase tracking-wider leading-relaxed">
                Join the excitement! Experience padel with your favorite JKT48 members. All levels welcome. Secure your spot now.
              </p>
            </div>
          </div>
        </div>

        <!-- Bar Kanan (Slide ke Atas) -->
        <div
          class="hidden lg:flex flex-col justify-between items-end p-8 bg-[#002e29] border-l border-white/5 transition-transform duration-1000 ease-in-out"
          :class="isLeaving ? '-translate-y-full opacity-0' : 'translate-y-0'"
        >
          <div>
            <span class="text-white/40 font-mono text-xl">&lowast;</span>
          </div>
          <div class="text-right">
            <h1
              class="text-7xl font-black text-white/5 uppercase select-none tracking-widest [writing-mode:vertical-lr] h-fit"
            >
              Padel
            </h1>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
