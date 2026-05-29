<script setup>
import { RouterLink } from 'vue-router'
import zeeImg from '../assets/zee.png'
import freyaImg from '../assets/freya.png'
import graciaImg from '../assets/gracia.png'
import christyImg from '../assets/christy.png'

const members = [
  {
    id: 1,
    name: 'Zee JKT48',
    status: 'Active Mabar',
    image: zeeImg,
    mabarPrice: 'Rp 500,000'
  },
  {
    id: 2,
    name: 'Freya JKT48',
    status: 'Active Mabar',
    image: freyaImg,
    mabarPrice: 'Rp 450,000'
  },
  {
    id: 3,
    name: 'Gracia JKT48',
    status: 'Active Mabar',
    image: graciaImg,
    mabarPrice: 'Rp 500,000'
  },
  {
    id: 4,
    name: 'Christy JKT48',
    status: 'Active Mabar',
    image: christyImg,
    mabarPrice: 'Rp 450,000'
  }
]
</script>

<template>
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full z-10">
    <div class="flex flex-col md:flex-row md:items-end justify-between mb-10">
      <div>
        <h2 class="text-3xl font-extrabold text-white tracking-tight">Member Spotlight</h2>
        <p class="text-sm text-padel-gray mt-1">
          Daftar member JKT48 yang siap bermain bareng Anda minggu ini
        </p>
      </div>
      <RouterLink
        to="/booking"
        class="mt-4 md:mt-0 text-sm font-semibold text-padel-teal hover:text-white flex items-center gap-1.5 transition-colors duration-200"
      >
        Lihat Jadwal Selengkapnya &rarr;
      </RouterLink>
    </div>

    <!-- Grid Member -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="member in members"
        :key="member.id"
        class="group relative rounded-2xl overflow-hidden solid-panel border border-white/10 hover:border-padel-teal/30 transition-all duration-500 hover:shadow-lg hover:shadow-black/20"
      >
        <!-- Gambar Portrait -->
        <div class="relative h-[280px] w-full overflow-hidden bg-black/60">
          <img
            :src="member.image"
            :alt="member.name"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-padel-dark via-transparent to-transparent"></div>
          <!-- Badge Status -->
          <span
            class="absolute top-4 left-4 px-2.5 py-0.5 rounded-full bg-padel-red/20 text-padel-red border border-padel-red/40 text-[10px] font-bold uppercase tracking-wider animate-pulse flex items-center gap-1"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-padel-red"></span>
            {{ member.status }}
          </span>
        </div>
        
        <!-- Detail Member -->
        <div
          class="p-5 flex flex-col space-y-3 relative z-10 bg-black/65 backdrop-blur-xl border-t border-white/5"
        >
          <div class="flex justify-between items-start">
            <h3 class="text-lg font-bold text-white tracking-tight">{{ member.name }}</h3>
            <span
              class="text-[10px] font-bold text-padel-gold border border-padel-gold/30 bg-padel-gold/5 px-2 py-0.5 rounded uppercase"
            >
              VIP
            </span>
          </div>
          <div class="flex justify-between items-center text-xs text-padel-gray pt-1 border-t border-white/5">
            <span>Mabar Add-on:</span>
            <span class="font-bold text-white">{{ member.mabarPrice }}</span>
          </div>
          <RouterLink
            to="/booking"
            class="mt-2 w-full py-2 rounded-xl bg-padel-red/10 hover:bg-padel-red text-padel-red hover:text-white text-center text-sm font-bold transition-all duration-300 border border-padel-red/30"
          >
            Book Sesi Mabar
          </RouterLink>
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
