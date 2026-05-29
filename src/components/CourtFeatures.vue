<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['update:modelValue'])

const courtFeatures = [
  {
    key: 'turf',
    title: 'Turf Lapangan Hijau Premium',
    desc: 'Rumput sintetis monofilamen premium berdensitas tinggi berwarna hijau lapangan botol. Dirancang khusus untuk penyerapan benturan sendi maksimal, meminimalkan cedera kaki, serta menjamin pantulan bola yang konsisten secara presisi.',
    img: '/indoor_court.png',
    icon: '🌱'
  },
  {
    key: 'glass',
    title: 'Kaca Tempered Panoramik 12mm',
    desc: 'Dinding kaca tempered tebal 12mm dengan ketahanan benturan tinggi tanpa sambungan tiang besi dalam (panoramik). Memberikan visibilitas 100% tanpa distorsi bagi penonton serta pantulan bola yang mantap untuk teknik bermain tingkat tinggi.',
    img: '/outdoor_court.png',
    icon: '💎'
  },
  {
    key: 'net',
    title: 'Net Padel Regulasi WPT',
    desc: 'Net dengan anyaman hitam anti-tarik tinggi dilengkapi dengan pita putih atas berukuran lebar 8 cm. Ketegangan kabel baja diatur presisi dengan tinggi tiang penahan 92 cm di kedua sisi samping sesuai standar turnamen internasional.',
    img: '/hero.png',
    icon: '🥅'
  },
  {
    key: 'mesh',
    title: 'Pagar Kawat Mesh Baja Hitam',
    desc: 'Pagar jaring kawat baja kokoh anti-korosi setinggi 2 meter di bagian tengah sisi samping lapangan. Sangat penting dalam padel karena memungkinkan bola memantul dengan sudut tak terduga yang memicu reli tak terduga.',
    img: '/indoor_court.png',
    icon: '🏁'
  },
  {
    key: 'lamp',
    title: 'Lampu LED Sorot 500 Lux',
    desc: 'Sistem pencahayaan 4 tiang LED sorot asimetris anti-silau. Memancarkan tingkat kecerahan cahaya minimal 500 lux merata di seluruh permukaan lapangan untuk kenyamanan bermain malam hari yang optimal tanpa bayangan mengganggu.',
    img: '/indoor_court.png',
    icon: '💡'
  }
]

const activeIndex = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const nextFeature = () => {
  activeIndex.value = (activeIndex.value + 1) % courtFeatures.length
}

const prevFeature = () => {
  activeIndex.value = (activeIndex.value - 1 + courtFeatures.length) % courtFeatures.length
}
</script>

<template>
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full z-10 flex flex-col space-y-8">
    <div
      class="flex flex-col md:flex-row md:items-end justify-between border-b border-white/5 pb-6"
    >
      <div>
        <span class="text-xs font-bold text-padel-teal uppercase tracking-widest">Detail Spesifikasi</span>
        <h2 class="text-3xl font-extrabold text-white tracking-tight mt-1">Eksplorasi Fitur Lapangan Padel</h2>
      </div>
      <p class="text-sm text-padel-gray mt-2 md:mt-0 max-w-md">
        Klik hotspot pada model 3D di atas atau gunakan slider di bawah ini untuk melihat detail teknologi arena premium kami.
      </p>
    </div>

    <!-- Main Slider Component -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      <!-- Navigation Buttons & Tabs -->
      <div
        class="lg:col-span-4 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0"
      >
        <button
          v-for="(feature, idx) in courtFeatures"
          :key="feature.key"
          @click="activeIndex = idx"
          :class="[
            'flex items-center gap-3 px-4 py-3.5 rounded-xl border text-xs font-bold tracking-wide transition-all duration-300 w-full shrink-0 lg:shrink text-left cursor-pointer',
            activeIndex === idx
              ? 'border-padel-teal text-padel-teal bg-padel-teal/10 shadow-lg shadow-padel-teal/5 translate-x-1'
              : 'border-white/5 hover:border-white/20 text-padel-gray hover:text-white bg-white/2'
          ]"
        >
          <span class="text-lg">{{ feature.icon }}</span>
          <span>{{ feature.title }}</span>
        </button>
      </div>

      <!-- Slider Content Display -->
      <div
        class="lg:col-span-8 solid-panel border border-white/5 p-6 sm:p-8 rounded-2xl flex flex-col justify-between space-y-6 relative overflow-hidden min-h-[350px]"
      >
        <!-- Background decorative glow -->
        <div
          class="absolute top-0 right-0 w-64 h-64 rounded-full bg-padel-teal/5 blur-[80px] pointer-events-none"
        ></div>
        
        <div class="space-y-4">
          <!-- Header Slide -->
          <div class="flex items-center justify-between">
            <span
              class="text-[10px] font-mono text-padel-teal border border-padel-teal/30 bg-padel-teal/5 px-2.5 py-1 rounded-full uppercase tracking-wider"
            >
              Spesifikasi Arena Premium
            </span>
            <span class="text-xs text-padel-gray font-mono">
              {{ activeIndex + 1 }} / {{ courtFeatures.length }}
            </span>
          </div>

          <!-- Content Display -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pt-2">
            <div class="md:col-span-7 space-y-4">
              <h3 class="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <span>{{ courtFeatures[activeIndex].icon }}</span>
                {{ courtFeatures[activeIndex].title }}
              </h3>
              <p class="text-xs sm:text-sm text-padel-gray leading-relaxed">
                {{ courtFeatures[activeIndex].desc }}
              </p>
            </div>
            
            <!-- Miniature Image -->
            <div
              class="md:col-span-5 w-full h-44 rounded-xl overflow-hidden border border-white/10 bg-black/45 backdrop-blur-md"
            >
              <img
                :src="courtFeatures[activeIndex].img"
                :alt="courtFeatures[activeIndex].title"
                class="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>
        </div>

        <!-- Bottom Control Bar -->
        <div class="flex items-center justify-between pt-4 border-t border-white/5">
          <!-- Bullet Indicators -->
          <div class="flex gap-2">
            <button
              v-for="(f, i) in courtFeatures"
              :key="i"
              @click="activeIndex = i"
              :class="[
                'w-2 h-2 rounded-full transition-all duration-300',
                activeIndex === i ? 'bg-padel-teal w-6' : 'bg-white/20 hover:bg-white/40'
              ]"
            ></button>
          </div>

          <!-- Navigation Chevrons -->
          <div class="flex gap-3">
            <button
              @click="prevFeature"
              class="w-8 h-8 rounded-lg border border-white/10 hover:border-padel-teal flex items-center justify-center text-white hover:text-padel-teal hover:bg-padel-teal/5 transition-all duration-200 cursor-pointer"
            >
              &larr;
            </button>
            <button
              @click="nextFeature"
              class="w-8 h-8 rounded-lg border border-white/10 hover:border-padel-teal flex items-center justify-center text-white hover:text-padel-teal hover:bg-padel-teal/5 transition-all duration-200 cursor-pointer"
            >
              &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
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
