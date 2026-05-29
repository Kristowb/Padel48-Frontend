<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import bgFacilitiesImg from '../assets/bg_facilities.png'

const courts = [
  {
    id: 'c61b2e56-11b3-4f9e-a89e-9d2208d51123',
    name: 'Padel Court 1 (Main Indoor Arena)',
    type: 'INDOOR',
    price: 'Rp 250,000 / Jam',
    mabarPrice: 'Rp 750,000 / Jam',
    color: '#0b5e40', // Hijau tua rumput
    facilities: ['Hot Shower Room', 'Locker Room', 'Cafe Area', 'Pro-Shop', 'Full Air Conditioner (Viewing Deck)'],
    description: 'Lapangan padel indoor berstandar profesional yang terlindung penuh dari segala cuaca. Dilengkapi dengan karpet rumput sintetis premium impor yang memberikan pantulan bola sempurna serta minim cedera.'
  },
  {
    id: 'a88c2e56-22b3-5f9e-b99e-9d2208d52244',
    name: 'Padel Court 2 (Panoramic Semi-Outdoor)',
    type: 'SEMI_OUTDOOR',
    price: 'Rp 200,000 / Jam',
    mabarPrice: 'Rp 700,000 / Jam',
    color: '#1a5276', // Biru gelap
    facilities: ['Panoramic View', 'Hot Shower Room', 'Locker Room', 'Free Wifi', 'Outdoor Lounge'],
    description: 'Lapangan semi-outdoor dengan atap pelindung ultraviolet berkubah tinggi. Memberikan sensasi udara segar alam terbuka yang sejuk, namun tetap aman dan teduh dari terik matahari maupun hujan.'
  }
]

const selectedCourt = ref(courts[0])

</script>

<template>
  <div class="relative min-h-screen bg-padel-dark text-white p-4 sm:p-6 lg:p-8 pt-24 sm:pt-28 overflow-hidden">
    <!-- Background Image with Overlay -->
    <div class="absolute inset-0 z-0 pointer-events-none">
      <img :src="bgFacilitiesImg" alt="Facilities Background" class="w-full h-full object-cover opacity-55 brightness-[0.4] contrast-[1.1]" />
      <div class="absolute inset-0 bg-gradient-to-b from-black/85 via-black/35 to-black/90"></div>
    </div>

    <div class="max-w-7xl mx-auto flex flex-col space-y-8 relative z-10">
      <!-- Header -->
      <div class="flex flex-col space-y-2">
        <h1 class="text-3xl font-extrabold text-white tracking-tight">Eksplorasi Lapangan Premium</h1>
        <p class="text-sm text-padel-gray">Gunakan penampil 3D interaktif kami untuk meninjau fasilitas lapangan sebelum memesan.</p>
      </div>

      <!-- Selector Tombol Lapangan -->
      <div class="flex gap-4 border-b border-white/10 pb-4">
        <button v-for="court in courts" :key="court.id" 
                @click="selectedCourt = court"
                :class="selectedCourt.id === court.id 
                  ? 'border-padel-teal text-padel-teal bg-padel-teal/10' 
                  : 'border-white/10 hover:border-white/30 text-padel-gray hover:text-white'"
                class="px-5 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-300">
          {{ court.name.split(' (')[0] }}
        </button>
      </div>

      <!-- Main Split Layout (3D Left, Details Right) -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        <!-- Panel Showcase Gambar (Kiri) -->
        <div class="relative h-[400px] lg:h-auto min-h-[400px] rounded-2xl border border-white/10 bg-black/50 backdrop-blur-md overflow-hidden flex items-center justify-center group">
          <transition name="fade-scale" mode="out-in">
            <img :key="selectedCourt.id"
                 :src="selectedCourt.type === 'INDOOR' ? '/indoor_court.png' : '/outdoor_court.png'" 
                 :alt="selectedCourt.name" 
                 class="w-full h-full object-cover transition-transform duration-[1000ms] ease-out group-hover:scale-105" />
          </transition>
          <div class="absolute inset-0 bg-gradient-to-t from-padel-dark/80 via-transparent to-transparent pointer-events-none"></div>

          <!-- Label Float Info Showcase -->
          <div class="absolute bottom-4 left-4 right-4 solid-panel p-3 rounded-xl flex items-center justify-between text-xs pointer-events-none">
            <span class="text-padel-teal flex items-center gap-1.5 font-semibold">
              <span class="w-2 h-2 rounded-full bg-padel-teal"></span>
              {{ selectedCourt.type }} Showcase
            </span>
            <span class="text-padel-gray font-mono">Premium Arena View</span>
          </div>
        </div>

        <!-- Panel Detail Lapangan (Kanan - Menggunakan transition untuk transisi detail yang anggun) -->
        <transition name="fade-scale" mode="out-in">
          <div :key="selectedCourt.id" class="bg-black/65 backdrop-blur-xl border border-white/10 p-6 sm:p-8 rounded-3xl flex flex-col justify-between space-y-6 shadow-2xl relative z-10">
            <div class="flex flex-col space-y-4">
              <div class="flex items-center gap-3">
                <span class="px-3 py-1 rounded bg-padel-teal/10 border border-padel-teal/30 text-padel-teal text-xs font-bold uppercase tracking-wider">
                  {{ selectedCourt.type }}
                </span>
                <span class="text-xs text-padel-gray font-mono">ID: {{ selectedCourt.id.slice(0,8) }}</span>
              </div>
              
              <h2 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{{ selectedCourt.name }}</h2>
              <p class="text-sm text-padel-gray leading-relaxed">{{ selectedCourt.description }}</p>
              
              <!-- Fasilitas Grid (Staggered Animation) -->
              <div class="pt-4 border-t border-white/5">
                <h4 class="text-sm font-bold text-white mb-2">Fasilitas Penunjang:</h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div v-for="(facility, idx) in selectedCourt.facilities" 
                       :key="facility" 
                       :style="{ animationDelay: `${idx * 0.08}s` }"
                       class="flex items-center gap-2 text-xs text-padel-gray stagger-item">
                    <span class="text-padel-teal font-bold">✔</span>
                    {{ facility }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Tarif & CTA -->
            <div class="pt-6 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div class="flex flex-col">
                <span class="text-[10px] text-padel-gray font-bold uppercase tracking-wider">Harga Sesi Reguler:</span>
                <span class="text-xl font-black text-padel-teal">{{ selectedCourt.price }}</span>
                <span class="text-[9px] text-padel-gold mt-1 flex items-center gap-1">
                  ⭐ Add-on Mabar JKT48: {{ selectedCourt.mabarPrice }}
                </span>
              </div>
              
              <RouterLink to="/booking" class="px-6 py-3 rounded-xl bg-padel-teal hover:bg-padel-teal/90 text-padel-dark font-bold text-sm text-center transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer">
                Pilih & Booking Sekarang
              </RouterLink>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>
