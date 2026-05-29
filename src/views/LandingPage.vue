<script setup>
import { ref, onMounted, onUnmounted, watch, inject } from 'vue'
import { RouterLink } from 'vue-router'

// Sub-components
import OnboardingOverlay from '../components/OnboardingOverlay.vue'
import RunningText from '../components/RunningText.vue'
import ThreeCourtPreview from '../components/ThreeCourtPreview.vue'
import CourtFeatures from '../components/CourtFeatures.vue'
import EventPromo from '../components/EventPromo.vue'
import MemberSpotlight from '../components/MemberSpotlight.vue'
import DetailModal from '../components/DetailModal.vue'

// Assets
import bgHeroImg from '../assets/bg_hero.png'
import bgFeaturesImg from '../assets/bg_features.png'
import bgFacilitiesImg from '../assets/bg_facilities.png'
import bgSpotlightImg from '../assets/bg_spotlight.png'

const showHeader = inject('showHeader', null)

// App states
const showOnboarding = ref(false)
const userPreference = ref('regular') // 'regular' atau 'jkt48'
const isEntered = ref(false)
const activeFeatureIndex = ref(0)
const activeModal = ref(null)

const handleOnboardingStart = () => {
  showOnboarding.value = false
  isEntered.value = true
}

// Lock body scroll and hide header when onboarding is shown
watch(showOnboarding, (show) => {
  if (show) {
    document.body.classList.add('scroll-locked')
    if (showHeader) showHeader.value = false
  } else {
    document.body.classList.remove('scroll-locked')
    if (showHeader) showHeader.value = true
  }
}, { immediate: true })

const handleSelectFeature = (payload) => {
  activeModal.value = {
    title: payload.title,
    desc: payload.desc,
    img: payload.img
  }
  if (payload.index !== undefined) {
    activeFeatureIndex.value = payload.index
  }
}

onMounted(() => {
  const shown = sessionStorage.getItem('padel48_onboarding_shown')
  if (shown !== 'true') {
    showOnboarding.value = true
  } else {
    isEntered.value = true
  }
})

onUnmounted(() => {
  document.body.classList.remove('scroll-locked')
  if (showHeader) showHeader.value = true
})
</script>

<template>
  <div
    :class="[
      'relative min-h-screen flex flex-col bg-padel-dark overflow-hidden transition-colors duration-500',
      showOnboarding ? 'h-screen overflow-hidden' : 'snap-container',
      userPreference === 'jkt48' ? 'theme-jkt48' : 'theme-regular'
    ]"
  >
    <!-- Layar Onboarding Overlay -->
    <OnboardingOverlay
      v-if="showOnboarding"
      @start="handleOnboardingStart"
    />

    <!-- Slide 1: Hero & Arena Viewport -->
    <div class="snap-slide">
      <!-- Background Image with Overlay -->
      <div class="absolute inset-0 z-0 pointer-events-none">
        <img
          :src="bgHeroImg"
          alt="Hero Background"
          class="w-full h-full object-cover opacity-55 brightness-[0.4] contrast-[1.1] transition-transform duration-[12s] hover:scale-105"
        />
        <div class="absolute inset-0 bg-gradient-to-b from-black/85 via-black/35 to-black/90"></div>
      </div>
      
      <!-- Hero Section (Split Layout) -->
      <section
        :class="[
          'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10 transition-all duration-1000 ease-out transform',
          isEntered ? 'opacity-100 scale-100 translate-y-0 blur-none' : 'opacity-0 scale-95 translate-y-8 blur-sm'
        ]"
      >
        <!-- Info Kiri -->
        <div
          class="flex flex-col space-y-6 bg-black/65 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative z-10"
        >
          <div
            class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-padel-red/30 bg-padel-red/5 text-padel-red text-xs font-semibold tracking-wider uppercase w-fit"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-padel-red animate-pulse"></span>
            Eksklusif Sportainment
          </div>
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none text-white">
            Padel48: Play Padel with <span class="text-padel-teal">JKT48 Members</span>
          </h1>
          <p class="text-base sm:text-lg text-padel-gray max-w-lg leading-relaxed">
            Rasakan sensasi bermain padel di arena premium kami sekaligus dapatkan kesempatan bermain tanding bersama member JKT48 pilihanmu. Sehat, seru, dan tidak terlupakan!
          </p>
          <div class="flex flex-col sm:flex-row gap-4 pt-2">
            <RouterLink
              to="/booking"
              class="px-8 py-3.5 rounded-full bg-padel-teal text-padel-dark font-bold text-center transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-padel-teal/10 active:scale-95"
            >
              Book Court Now
            </RouterLink>
            <RouterLink
              to="/courts"
              class="px-8 py-3.5 rounded-full border border-white/20 hover:border-padel-teal text-white hover:text-padel-teal text-center font-semibold transition-all duration-300 bg-white/5 hover:bg-padel-teal/5"
            >
              Lihat Lapangan
            </RouterLink>
          </div>
        </div>

        <!-- Hero Viewport Kanan (3D Canvas / 2D Fallback) -->
        <ThreeCourtPreview @select-feature="handleSelectFeature" />
      </section>
    </div>

    <!-- Slide 2: Feature Slider & Running Text -->
    <div class="snap-slide">
      <!-- Background Image with Overlay -->
      <div class="absolute inset-0 z-0 pointer-events-none">
        <img
          :src="bgFeaturesImg"
          alt="Features Background"
          class="w-full h-full object-cover opacity-55 brightness-[0.4] contrast-[1.1] transition-transform duration-[12s] hover:scale-105"
        />
        <div class="absolute inset-0 bg-gradient-to-b from-black/85 via-black/35 to-black/90"></div>
      </div>

      <!-- Running Text Dinamis Responsif Scroll -->
      <RunningText />

      <!-- Slide Penjelasan Lapangan Padel (Interactive Slider) -->
      <CourtFeatures v-model="activeFeatureIndex" />
    </div>

    <!-- Slide 3: Fasilitas Unggulan & Events -->
    <div class="snap-slide">
      <!-- Background Image with Overlay -->
      <div class="absolute inset-0 z-0 pointer-events-none">
        <img
          :src="bgFacilitiesImg"
          alt="Facilities Background"
          class="w-full h-full object-cover opacity-55 brightness-[0.4] contrast-[1.1] transition-transform duration-[12s] hover:scale-105"
        />
        <div class="absolute inset-0 bg-gradient-to-b from-black/85 via-black/35 to-black/90"></div>
      </div>
      
      <!-- Fitur Unggulan (Glassmorphism Cards) -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full z-10">
        <h2 class="text-3xl font-extrabold text-center text-white mb-10 tracking-tight">
          Fasilitas & Layanan Unggul
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Fasilitas 1 -->
          <div
            class="solid-panel p-6 rounded-2xl flex flex-col space-y-3 border border-white/5 hover:border-padel-teal/30 transition-all duration-300 hover:translate-y-[-4px]"
          >
            <div class="w-12 h-12 rounded-xl bg-padel-teal/10 flex items-center justify-center text-padel-teal text-xl">
              🏆
            </div>
            <h3 class="text-lg font-bold text-white">Premium Court Facility</h3>
            <p class="text-sm text-padel-gray">
              Lapangan padel standar internasional dengan karpet sintetis premium dan sistem pencahayaan LED anti-silau.
            </p>
          </div>

          <!-- Fasilitas 2 -->
          <div
            class="solid-panel p-6 rounded-2xl flex flex-col space-y-3 border border-white/5 hover:border-padel-red/30 transition-all duration-300 hover:translate-y-[-4px]"
          >
            <div class="w-12 h-12 rounded-xl bg-padel-red/10 flex items-center justify-center text-padel-red text-xl">
              ❤️
            </div>
            <h3 class="text-lg font-bold text-white">Exclusive Mabar JKT48</h3>
            <p class="text-sm text-padel-gray">
              Pesan sesi mabar bersama member favorit Anda. Didampingi pelatih berlisensi untuk pengalaman yang berkesan.
            </p>
          </div>

          <!-- Fasilitas 3 -->
          <div
            class="solid-panel p-6 rounded-2xl flex flex-col space-y-3 border border-white/5 hover:border-padel-teal/30 transition-all duration-300 hover:translate-y-[-4px]"
          >
            <div class="w-12 h-12 rounded-xl bg-padel-teal/10 flex items-center justify-center text-padel-teal text-xl">
              📱
            </div>
            <h3 class="text-lg font-bold text-white">Instant QRIS Payment</h3>
            <p class="text-sm text-padel-gray">
              Proses checkout kilat dengan sistem generator pembayaran QRIS dinamis terverifikasi instan.
            </p>
          </div>
        </div>
      </section>

      <!-- Scrolling Event Informasi -->
      <EventPromo />
    </div>

    <!-- Slide 4: Member Spotlight -->
    <div class="snap-slide">
      <!-- Background Image with Overlay -->
      <div class="absolute inset-0 z-0 pointer-events-none">
        <img
          :src="bgSpotlightImg"
          alt="Spotlight Background"
          class="w-full h-full object-cover opacity-55 brightness-[0.4] contrast-[1.1] transition-transform duration-[12s] hover:scale-105"
        />
        <div class="absolute inset-0 bg-gradient-to-b from-black/85 via-black/35 to-black/90"></div>
      </div>
      
      <!-- Member Spotlight Section -->
      <MemberSpotlight />
    </div>

    <!-- Modal Detail Detail Objek -->
    <DetailModal
      :model="activeModal"
      @close="activeModal = null"
    />
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
