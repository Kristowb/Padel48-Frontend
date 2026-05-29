<script setup>
import { shallowRef } from 'vue'
import { RouterLink } from 'vue-router'
import { TresCanvas } from '@tresjs/core'
import zeeImg from '../assets/zee.png'
import freyaImg from '../assets/freya.png'
import graciaImg from '../assets/gracia.png'
import christyImg from '../assets/christy.png'

// Data member JKT48 untuk spotlight
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

// Refs untuk animasi 3D rotasi lapangan
const courtRef = shallowRef(null)

const onBeforeRender = (e) => {
  if (courtRef.value) {
    courtRef.value.rotation.y += 0.005
  }
}
</script>

<template>
  <div class="relative min-h-screen flex flex-col bg-padel-dark overflow-hidden">
    <!-- Background Decor (Glow Orbs) -->
    <div class="absolute top-20 left-1/4 w-96 h-96 rounded-full bg-padel-teal/10 blur-[120px] pointer-events-none"></div>
    <div class="absolute bottom-20 right-1/4 w-96 h-96 rounded-full bg-padel-red/10 blur-[120px] pointer-events-none"></div>

    <!-- Hero Section (Split Layout) -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10">
      <!-- Info Kiri -->
      <div class="flex flex-col space-y-6">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-padel-red/30 bg-padel-red/5 text-padel-red text-xs font-semibold tracking-wider uppercase w-fit">
          <span class="w-1.5 h-1.5 rounded-full bg-padel-red animate-ping"></span>
          Eksklusif Sportainment
        </div>
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none text-white">
          Padel48: Play Padel with <span class="text-transparent bg-clip-text bg-gradient-to-r from-padel-red to-padel-teal">JKT48 Members</span>
        </h1>
        <p class="text-base sm:text-lg text-padel-gray max-w-lg">
          Rasakan sensasi bermain padel di arena premium kami sekaligus dapatkan kesempatan bermain tanding bersama member JKT48 pilihanmu. Sehat, seru, dan tidak terlupakan!
        </p>
        <div class="flex flex-col sm:flex-row gap-4 pt-2">
          <RouterLink to="/booking" class="px-8 py-3.5 rounded-full bg-padel-teal text-padel-dark font-bold text-center transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(102,252,241,0.5)] active:scale-95">
            Book Court Now
          </RouterLink>
          <RouterLink to="/courts" class="px-8 py-3.5 rounded-full border border-white/20 hover:border-padel-teal text-white hover:text-padel-teal text-center font-semibold transition-all duration-300 bg-white/5 hover:bg-padel-teal/5">
            Lihat Lapangan
          </RouterLink>
        </div>
      </div>

      <!-- 3D Viewport Kanan -->
      <div class="relative h-[350px] sm:h-[450px] w-full rounded-2xl overflow-hidden border border-white/10 bg-black/40 shadow-inner flex items-center justify-center">
        <!-- Interactive 3D Canvas -->
        <TresCanvas class="absolute inset-0 w-full h-full" clear-color="#0b0c10">
          <TresPerspectiveCamera :position="[0, 5, 8]" :look-at="[0, 0, 0]" />
          
          <ambientLight :intensity="1.5" />
          <directionalLight :position="[5, 8, 5]" :intensity="2" />
          <pointLight :position="[-5, 5, -5]" :intensity="1.5" color="#66FCF1" />
          <pointLight :position="[5, 5, 5]" :intensity="1.5" color="#ED1C24" />

          <!-- Group Lapangan Padel 3D -->
          <group ref="courtRef" @before-render="onBeforeRender">
            <!-- Lantai Lapangan -->
            <mesh :rotation="[-Math.PI / 2, 0, 0]" :position="[0, -0.1, 0]">
              <planeGeometry :args="[6, 4]" />
              <meshStandardMaterial color="#0b5e40" roughness="0.8" />
            </mesh>
            
            <!-- Garis Lapangan Putih -->
            <mesh :rotation="[-Math.PI / 2, 0, 0]" :position="[0, -0.09, 0]">
              <planeGeometry :args="[5.8, 3.8]" />
              <meshStandardMaterial color="#ffffff" roughness="0.5" wireframe />
            </mesh>

            <!-- Tiang & Jaring di Tengah -->
            <mesh :position="[0, 0.2, 0]">
              <boxGeometry :args="[0.05, 0.4, 4]" />
              <meshStandardMaterial color="#222222" opacity="0.6" transparent />
            </mesh>

            <!-- Tiang Sudut (Visualisasi Court Cage) -->
            <mesh :position="[-3, 1, -2]">
              <boxGeometry :args="[0.1, 2, 0.1]" />
              <meshStandardMaterial color="#111111" />
            </mesh>
            <mesh :position="[3, 1, -2]">
              <boxGeometry :args="[0.1, 2, 0.1]" />
              <meshStandardMaterial color="#111111" />
            </mesh>
            <mesh :position="[-3, 1, 2]">
              <boxGeometry :args="[0.1, 2, 0.1]" />
              <meshStandardMaterial color="#111111" />
            </mesh>
            <mesh :position="[3, 1, 2]">
              <boxGeometry :args="[0.1, 2, 0.1]" />
              <meshStandardMaterial color="#111111" />
            </mesh>
          </group>
        </TresCanvas>
        
        <!-- UI overlay mini info di 3D canvas -->
        <div class="absolute bottom-4 left-4 right-4 glass-panel p-3 rounded-xl flex items-center justify-between text-xs border border-white/5 pointer-events-none">
          <span class="text-padel-gray flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-padel-teal animate-ping"></span>
            3D Interactive Preview
          </span>
          <span class="text-white font-mono">Rotasi Lapangan Padel</span>
        </div>
      </div>
    </section>

    <!-- Fitur Unggulan (Glassmorphism Cards) -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full z-10">
      <h2 class="text-3xl font-extrabold text-center text-white mb-10 tracking-tight">Fasilitas & Layanan Unggul</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Fasilitas 1 -->
        <div class="glass-panel p-6 rounded-2xl flex flex-col space-y-3 border border-white/5 hover:border-padel-teal/30 transition-all duration-300 hover:translate-y-[-4px]">
          <div class="w-12 h-12 rounded-xl bg-padel-teal/10 flex items-center justify-center text-padel-teal text-xl">🏆</div>
          <h3 class="text-lg font-bold text-white">Premium Court Facility</h3>
          <p class="text-sm text-padel-gray">
            Lapangan padel standar internasional dengan karpet sintetis premium dan sistem pencahayaan LED anti-silau.
          </p>
        </div>

        <!-- Fasilitas 2 -->
        <div class="glass-panel p-6 rounded-2xl flex flex-col space-y-3 border border-white/5 hover:border-padel-red/30 transition-all duration-300 hover:translate-y-[-4px]">
          <div class="w-12 h-12 rounded-xl bg-padel-red/10 flex items-center justify-center text-padel-red text-xl">❤️</div>
          <h3 class="text-lg font-bold text-white">Exclusive Mabar JKT48</h3>
          <p class="text-sm text-padel-gray">
            Pesan sesi mabar bersama member favorit Anda. Didampingi pelatih berlisensi untuk pengalaman yang berkesan.
          </p>
        </div>

        <!-- Fasilitas 3 -->
        <div class="glass-panel p-6 rounded-2xl flex flex-col space-y-3 border border-white/5 hover:border-padel-teal/30 transition-all duration-300 hover:translate-y-[-4px]">
          <div class="w-12 h-12 rounded-xl bg-padel-teal/10 flex items-center justify-center text-padel-teal text-xl">📱</div>
          <h3 class="text-lg font-bold text-white">Instant QRIS Payment</h3>
          <p class="text-sm text-padel-gray">
            Proses checkout kilat dengan sistem generator pembayaran QRIS dinamis terverifikasi instan.
          </p>
        </div>
      </div>
    </section>

    <!-- Member Spotlight Section (Holographic Cards) -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full z-10">
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-10">
        <div>
          <h2 class="text-3xl font-extrabold text-white tracking-tight">Member Spotlight</h2>
          <p class="text-sm text-padel-gray mt-1">Daftar member JKT48 yang siap bermain bareng Anda minggu ini</p>
        </div>
        <RouterLink to="/booking" class="mt-4 md:mt-0 text-sm font-semibold text-padel-teal hover:text-white flex items-center gap-1.5 transition-colors duration-200">
          Lihat Jadwal Selengkapnya &rarr;
        </RouterLink>
      </div>

      <!-- Grid Member -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="member in members" :key="member.id" class="group relative rounded-2xl overflow-hidden glass-panel border border-white/10 hover:border-padel-red/40 transition-all duration-500 hover:shadow-[0_0_20px_rgba(237,28,36,0.2)]">
          <!-- Gambar Portrait -->
          <div class="relative h-[280px] w-full overflow-hidden">
            <img :src="member.image" :alt="member.name" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div class="absolute inset-0 bg-gradient-to-t from-padel-dark via-transparent to-transparent"></div>
            <!-- Badge Status -->
            <span class="absolute top-4 left-4 px-2.5 py-0.5 rounded-full bg-padel-red/20 text-padel-red border border-padel-red/40 text-[10px] font-bold uppercase tracking-wider animate-pulse flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-padel-red"></span>
              {{ member.status }}
            </span>
          </div>
          
          <!-- Detail Member -->
          <div class="p-5 flex flex-col space-y-3 relative z-10 bg-padel-dark/90">
            <div class="flex justify-between items-start">
              <h3 class="text-lg font-bold text-white tracking-tight">{{ member.name }}</h3>
              <span class="text-[10px] font-bold text-padel-gold border border-padel-gold/30 bg-padel-gold/5 px-2 py-0.5 rounded uppercase">VIP</span>
            </div>
            <div class="flex justify-between items-center text-xs text-padel-gray pt-1 border-t border-white/5">
              <span>Mabar Add-on:</span>
              <span class="font-bold text-white">{{ member.mabarPrice }}</span>
            </div>
            <RouterLink to="/booking" class="mt-2 w-full py-2 rounded-xl bg-padel-red/10 hover:bg-padel-red text-padel-red hover:text-white text-center text-sm font-bold transition-all duration-300 border border-padel-red/30">
              Book Sesi Mabar
            </RouterLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
