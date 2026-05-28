<script setup>
import { ref, shallowRef, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { TresCanvas } from '@tresjs/core'

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
const court3DRef = shallowRef(null)

// Animasi rotasi manual berdasarkan input/watch atau auto
const onBeforeRender = (e) => {
  if (court3DRef.value) {
    court3DRef.value.rotation.y += 0.003
  }
}
</script>

<template>
  <div class="relative min-h-screen bg-padel-dark text-white p-4 sm:p-6 lg:p-8">
    <div class="max-w-7xl mx-auto flex flex-col space-y-8">
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
        <!-- Panel 3D Interaktif (Kiri) -->
        <div class="relative h-[400px] lg:h-auto min-h-[400px] rounded-2xl border border-white/10 bg-black/50 overflow-hidden flex items-center justify-center">
          <TresCanvas class="absolute inset-0 w-full h-full" clear-color="#0a0a0c">
            <TresPerspectiveCamera :position="[0, 4, 8]" :look-at="[0, 0, 0]" />
            
            <ambientLight :intensity="1.5" />
            <directionalLight :position="[5, 8, 5]" :intensity="1.8" />
            <pointLight :position="[-5, 5, -5]" :intensity="1.2" color="#66FCF1" />

            <group ref="court3DRef" @before-render="onBeforeRender">
              <!-- Lantai Lapangan Dynamic Color -->
              <mesh :rotation="[-Math.PI / 2, 0, 0]" :position="[0, -0.1, 0]">
                <planeGeometry :args="[6, 4]" />
                <meshStandardMaterial :color="selectedCourt.color" roughness="0.8" />
              </mesh>
              
              <!-- Garis Lapangan -->
              <mesh :rotation="[-Math.PI / 2, 0, 0]" :position="[0, -0.09, 0]">
                <planeGeometry :args="[5.8, 3.8]" />
                <meshStandardMaterial color="#ffffff" roughness="0.5" wireframe />
              </mesh>

              <!-- Jaring Jala -->
              <mesh :position="[0, 0.2, 0]">
                <boxGeometry :args="[0.05, 0.4, 4]" />
                <meshStandardMaterial color="#222222" opacity="0.7" transparent />
              </mesh>

              <!-- Glass Walls (Dinding Kaca Belakang Lapangan Padel) -->
              <mesh :position="[-3, 0.8, 0]">
                <boxGeometry :args="[0.02, 1.8, 4]" />
                <meshStandardMaterial color="#66FCF1" opacity="0.15" transparent roughness="0.1" metalness="0.9" />
              </mesh>
              <mesh :position="[3, 0.8, 0]">
                <boxGeometry :args="[0.02, 1.8, 4]" />
                <meshStandardMaterial color="#66FCF1" opacity="0.15" transparent roughness="0.1" metalness="0.9" />
              </mesh>
            </group>
          </TresCanvas>

          <!-- Label Float Info 3D -->
          <div class="absolute bottom-4 left-4 right-4 glass-panel p-3 rounded-xl border border-white/5 pointer-events-none flex items-center justify-between text-xs">
            <span class="text-padel-teal flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-padel-teal animate-ping"></span>
              {{ selectedCourt.type }} View
            </span>
            <span class="text-padel-gray">Rotate & Explore 3D Model</span>
          </div>
        </div>

        <!-- Panel Detail Lapangan (Kanan) -->
        <div class="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 flex flex-col justify-between space-y-6">
          <div class="flex flex-col space-y-4">
            <div class="flex items-center gap-3">
              <span class="px-3 py-1 rounded bg-padel-teal/10 border border-padel-teal/30 text-padel-teal text-xs font-bold uppercase tracking-wider">
                {{ selectedCourt.type }}
              </span>
              <span class="text-xs text-padel-gray font-mono">ID: {{ selectedCourt.id.slice(0,8) }}</span>
            </div>
            
            <h2 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{{ selectedCourt.name }}</h2>
            <p class="text-sm text-padel-gray leading-relaxed">{{ selectedCourt.description }}</p>
            
            <!-- Fasilitas Grid -->
            <div class="pt-4 border-t border-white/5">
              <h4 class="text-sm font-bold text-white mb-2">Fasilitas Penunjang:</h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div v-for="facility in selectedCourt.facilities" :key="facility" class="flex items-center gap-2 text-xs text-padel-gray">
                  <span class="text-padel-teal">✔</span>
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
            
            <RouterLink to="/booking" class="px-6 py-3 rounded-xl bg-padel-teal hover:bg-padel-teal/90 text-padel-dark font-bold text-sm text-center transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]">
              Pilih & Booking Sekarang
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
