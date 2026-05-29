<script setup>
import { ref, onMounted, onUnmounted, watch, provide } from 'vue'
import { RouterView, RouterLink, useRoute } from 'vue-router'

const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)
const showHeader = ref(true)
const route = useRoute()

provide('showHeader', showHeader)

const handleScroll = () => {
  if (window.scrollY > 20) {
    isScrolled.value = true
  } else {
    isScrolled.value = false
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  // Periksa posisi scroll awal
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.body.classList.remove('scroll-locked')
})

// Tutup menu drawer otomatis saat rute berubah
watch(() => route.path, () => {
  isMobileMenuOpen.value = false
})

// Kunci scroll body saat mobile menu drawer terbuka
watch(isMobileMenuOpen, (isOpen) => {
  if (isOpen) {
    document.body.classList.add('scroll-locked')
  } else {
    document.body.classList.remove('scroll-locked')
  }
})

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}
</script>

<template>
  <div class="min-h-screen bg-[#000E0D] text-white font-sans flex flex-col relative overflow-x-hidden">
    
    <!-- Background Global Layer (Mencegah kedipan background solid saat berpindah halaman) -->
    <div class="fixed inset-0 z-0 pointer-events-none">
      <div class="absolute inset-0 bg-gradient-to-b from-[#003B36] via-[#001E1B] to-[#000E0D]"></div>
      <!-- Grid pattern halus khas sportainment -->
      <div class="absolute inset-0 opacity-[0.06] bg-[linear-gradient(rgba(255,255,255,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[size:80px_80px]"></div>
    </div>

    <!-- Navigation Bar Premium -->
    <header
      v-if="showHeader"
      :class="[
        'fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500',
        isScrolled
          ? 'py-2'
          : 'py-4'
      ]"
    >
      <!-- Glass container dengan border bawah halus -->
      <div
        :class="[
          'mx-4 sm:mx-6 lg:mx-8 rounded-2xl transition-all duration-500',
          isScrolled
            ? 'bg-black/70 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] shadow-black/40'
            : 'bg-white/[0.02] backdrop-blur-md border border-white/5'
        ]"
      >
        <!-- Accent line atas (lime glow) -->
        <div
          :class="[
            'h-px w-full rounded-t-2xl transition-all duration-500 bg-gradient-to-r from-transparent via-padel-teal/60 to-transparent',
            isScrolled ? 'opacity-100' : 'opacity-0'
          ]"
        ></div>

        <div class="max-w-7xl mx-auto px-4 sm:px-5">
          <div class="flex items-center justify-between h-14">

            <!-- ── LOGO ── -->
            <RouterLink
              to="/"
              class="flex items-center gap-2.5 select-none group flex-shrink-0"
            >
              <!-- Icon pill -->
              <div class="relative w-8 h-8 rounded-lg bg-padel-teal/10 border border-padel-teal/20 flex items-center justify-center group-hover:border-padel-teal/50 group-hover:bg-padel-teal/15 transition-all duration-300">
                <img src="/favicon.png" alt="Padel48" class="w-5 h-5 object-contain" />
                <!-- Glow dot aktif -->
                <span class="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-padel-teal border border-black animate-pulse shadow-[0_0_6px_rgba(204,255,0,0.8)]"></span>
              </div>
              <!-- Wordmark -->
              <span class="text-xl font-black tracking-tight text-white leading-none group-hover:opacity-90 transition-opacity">
                <span class="text-padel-red">PADEL</span><span class="text-padel-teal">48</span>
              </span>
            </RouterLink>

            <!-- ── DESKTOP NAV ── -->
            <nav class="hidden md:flex items-center gap-1">
              <RouterLink
                to="/"
                active-class="active-link"
                exact-active-class="exact-active-link"
                class="relative px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-padel-gray hover:text-white transition-colors duration-200 rounded-lg hover:bg-white/5 nav-link-underline"
              >
                Home
              </RouterLink>
              <RouterLink
                to="/courts"
                active-class="active-link"
                exact-active-class="exact-active-link"
                class="relative px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-padel-gray hover:text-white transition-colors duration-200 rounded-lg hover:bg-white/5 nav-link-underline"
              >
                Arena
              </RouterLink>
              <RouterLink
                to="/booking"
                active-class="active-link"
                exact-active-class="exact-active-link"
                class="relative px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-padel-gray hover:text-white transition-colors duration-200 rounded-lg hover:bg-white/5 nav-link-underline"
              >
                Booking
              </RouterLink>
            </nav>

            <!-- ── ACTIONS ── -->
            <div class="flex items-center gap-2">
              <!-- Live Sessions indicator (desktop only) -->
              <div class="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-padel-red/10 border border-padel-red/20 text-[10px] font-bold text-padel-red uppercase tracking-wider">
                <span class="w-1.5 h-1.5 rounded-full bg-padel-red animate-pulse"></span>
                Slot Tersedia
              </div>

              <!-- CTA Button Utama -->
              <RouterLink
                to="/booking"
                class="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-padel-teal text-padel-dark text-[11px] font-black uppercase tracking-wider transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-padel-teal/25 active:scale-95"
              >
                <span>Book Now</span>
                <span class="text-xs font-bold opacity-70">&rarr;</span>
              </RouterLink>

              <!-- Hamburger (Mobile) -->
              <button
                @click="toggleMobileMenu"
                class="md:hidden relative w-9 h-9 rounded-xl border border-white/10 hover:border-padel-teal/40 bg-white/5 hover:bg-padel-teal/5 transition-all duration-300 flex flex-col justify-center items-center gap-1 focus:outline-none"
                aria-label="Toggle Menu"
              >
                <span
                  :class="[
                    'block w-4 h-0.5 bg-white rounded-full transition-all duration-300',
                    isMobileMenuOpen ? 'rotate-45 translate-y-[6px]' : ''
                  ]"
                ></span>
                <span
                  :class="[
                    'block w-4 h-0.5 bg-white rounded-full transition-all duration-300',
                    isMobileMenuOpen ? 'opacity-0 scale-x-0' : ''
                  ]"
                ></span>
                <span
                  :class="[
                    'block w-4 h-0.5 bg-white rounded-full transition-all duration-300',
                    isMobileMenuOpen ? '-rotate-45 -translate-y-[6px]' : ''
                  ]"
                ></span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </header>

    <!-- Mobile Drawer -->
    <Teleport to="body">
      <!-- Backdrop -->
      <Transition name="fade-backdrop">
        <div
          v-if="isMobileMenuOpen"
          @click="isMobileMenuOpen = false"
          class="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
        ></div>
      </Transition>

      <!-- Drawer Panel -->
      <Transition name="slide-drawer">
        <div
          v-if="isMobileMenuOpen"
          class="fixed top-0 right-0 h-full w-72 max-w-full z-50 flex flex-col bg-[#010f0d] border-l border-white/8 shadow-[−20px_0_60px_rgba(0,0,0,0.6)]"
        >
          <!-- Glow accent kiri -->
          <div class="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-padel-teal/40 to-transparent pointer-events-none"></div>

          <!-- Drawer Header -->
          <div class="flex items-center justify-between px-6 py-5 border-b border-white/8">
            <div class="flex items-center gap-2 select-none">
              <div class="w-7 h-7 rounded-lg bg-padel-teal/10 border border-padel-teal/20 flex items-center justify-center">
                <img src="/favicon.png" alt="Padel48" class="w-4 h-4 object-contain" />
              </div>
              <span class="text-base font-black tracking-tight text-white">
                <span class="text-padel-red">PADEL</span><span class="text-padel-teal">48</span>
              </span>
            </div>
            <button
              @click="isMobileMenuOpen = false"
              class="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-padel-gray hover:text-white hover:bg-white/10 transition-all text-lg leading-none"
            >
              &times;
            </button>
          </div>

          <!-- Nav Links -->
          <nav class="flex flex-col px-4 pt-6 gap-1 flex-grow">
            <RouterLink
              to="/"
              active-class="!text-padel-teal !bg-padel-teal/10 !border-padel-teal/20"
              exact-active-class="!text-padel-teal"
              class="flex items-center gap-3 px-4 py-3 rounded-xl border border-transparent text-sm font-bold uppercase tracking-widest text-padel-gray hover:text-white hover:bg-white/5 hover:border-white/8 transition-all duration-200"
            >
              <span class="text-base">🏠</span> Home
            </RouterLink>
            <RouterLink
              to="/courts"
              active-class="!text-padel-teal !bg-padel-teal/10 !border-padel-teal/20"
              exact-active-class="!text-padel-teal"
              class="flex items-center gap-3 px-4 py-3 rounded-xl border border-transparent text-sm font-bold uppercase tracking-widest text-padel-gray hover:text-white hover:bg-white/5 hover:border-white/8 transition-all duration-200"
            >
              <span class="text-base">🏟️</span> Arena
            </RouterLink>
            <RouterLink
              to="/booking"
              active-class="!text-padel-teal !bg-padel-teal/10 !border-padel-teal/20"
              exact-active-class="!text-padel-teal"
              class="flex items-center gap-3 px-4 py-3 rounded-xl border border-transparent text-sm font-bold uppercase tracking-widest text-padel-gray hover:text-white hover:bg-white/5 hover:border-white/8 transition-all duration-200"
            >
              <span class="text-base">🎾</span> Booking
            </RouterLink>
          </nav>

          <!-- CTA Footer -->
          <div class="px-4 pb-6 pt-4 border-t border-white/8 flex flex-col gap-3">
            <!-- Live pill -->
            <div class="flex items-center justify-center gap-2 py-2 rounded-xl bg-padel-red/10 border border-padel-red/20 text-[11px] font-bold text-padel-red uppercase tracking-wider">
              <span class="w-1.5 h-1.5 rounded-full bg-padel-red animate-pulse"></span>
              Slot Bermain Tersedia Hari Ini
            </div>
            <RouterLink
              to="/booking"
              class="w-full py-3 rounded-xl bg-padel-teal text-padel-dark text-xs font-black uppercase tracking-wider text-center transition-all duration-300 hover:shadow-lg hover:shadow-padel-teal/25 active:scale-95"
            >
              Book Court Sekarang &rarr;
            </RouterLink>
            <p class="text-[10px] text-center text-padel-gray/40 font-mono">
              Padel48 Sportainment &copy; 2026
            </p>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Main Content Area -->
    <main class="grow relative z-10">
      <RouterView />
    </main>

    <!-- Footer Premium 4-Kolom (Best Practice UI/UX) -->
    <footer class="border-t border-white/5 bg-black/45 relative z-10 pt-16 pb-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-white/5">
          <!-- Kolom 1: Branding & Media Sosial -->
          <div class="flex flex-col gap-4">
            <div class="text-xl font-black tracking-wider text-padel-teal flex items-center gap-2 select-none">
              <img src="/favicon.png" alt="Padel48 Logo" class="w-8 h-8 object-contain rounded-md" />
              <span><span class="text-padel-red">PADEL</span>48</span>
            </div>
            <p class="text-xs text-padel-gray leading-relaxed max-w-sm">
              Rasakan pengalaman sportainment padel tenis terbaik di Jakarta. Padukan kebugaran, gaya hidup, dan interaksi seru bersama komunitas favorit Anda.
            </p>
            <!-- Media Sosial -->
            <div class="flex items-center gap-3 mt-2">
              <a href="#" class="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-padel-gray hover:text-padel-teal hover:border-padel-teal hover:shadow-[0_0_8px_rgba(204,255,0,0.3)] transition-all duration-300" aria-label="Instagram">
                <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
              </a>
              <a href="#" class="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-padel-gray hover:text-padel-teal hover:border-padel-teal hover:shadow-[0_0_8px_rgba(204,255,0,0.3)] transition-all duration-300" aria-label="TikTok">
                <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.74-3.99-1.72-.08-.07-.17-.14-.24-.22v6.52c.03 2.18-.8 4.38-2.42 5.84-1.61 1.51-3.95 2.21-6.11 1.83-2.26-.36-4.37-1.92-5.18-4.13-.9-2.34-.33-5.15 1.43-6.93 1.53-1.61 3.87-2.33 6.05-1.84v4.16c-1.24-.31-2.61-.04-3.59.78-.96.79-1.34 2.15-1 3.36.32 1.25 1.43 2.22 2.71 2.38 1.41.2 2.91-.49 3.52-1.8.19-.38.25-.81.25-1.23V.02z"/></svg>
              </a>
              <a href="#" class="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-padel-gray hover:text-padel-teal hover:border-padel-teal hover:shadow-[0_0_8px_rgba(204,255,0,0.3)] transition-all duration-300" aria-label="YouTube">
                <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.107C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.388.511a3.002 3.002 0 0 0-2.11 2.107C0 8.053 0 12 0 12s0 3.947.502 5.837a3.003 3.003 0 0 0 2.11 2.107C4.495 20.455 12 20.455 12 20.455s7.505 0 9.388-.511a3.002 3.002 0 0 0 2.11-2.107C24 15.947 24 12 24 12s0-3.947-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a href="#" class="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-padel-gray hover:text-padel-teal hover:border-padel-teal hover:shadow-[0_0_8px_rgba(204,255,0,0.3)] transition-all duration-300" aria-label="X">
                <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            </div>
          </div>

          <!-- Kolom 2: Navigasi Cepat -->
          <div class="flex flex-col gap-4">
            <h4 class="text-xs font-bold uppercase tracking-wider text-white">Navigasi Cepat</h4>
            <ul class="flex flex-col gap-2">
              <li>
                <RouterLink to="/" class="text-xs text-padel-gray hover:text-padel-teal transition-colors duration-200">Home</RouterLink>
              </li>
              <li>
                <RouterLink to="/courts" class="text-xs text-padel-gray hover:text-padel-teal transition-colors duration-200">Cari Lapangan</RouterLink>
              </li>
              <li>
                <RouterLink to="/booking" class="text-xs text-padel-gray hover:text-padel-teal transition-colors duration-200">Booking Sesi</RouterLink>
              </li>
              <li>
                <a href="#" class="text-xs text-padel-gray hover:text-padel-teal transition-colors duration-200">Virtual Tour Lapangan</a>
              </li>
            </ul>
          </div>

          <!-- Kolom 3: Hubungi Kami -->
          <div class="flex flex-col gap-4">
            <h4 class="text-xs font-bold uppercase tracking-wider text-white">Hubungi Kami</h4>
            <ul class="flex flex-col gap-2">
              <li class="text-xs text-padel-gray flex items-center gap-2">
                <svg class="w-3.5 h-3.5 text-padel-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                <span>info@padel48.com</span>
              </li>
              <li class="text-xs text-padel-gray flex items-center gap-2">
                <svg class="w-3.5 h-3.5 text-padel-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                <span>+62 812-3456-7890</span>
              </li>
              <li class="text-xs text-padel-gray flex items-start gap-2 leading-relaxed">
                <svg class="w-3.5 h-3.5 text-padel-teal mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                <span>Jl. Senopati No. 48, Kebayoran Baru, Jakarta Selatan</span>
              </li>
            </ul>
          </div>

          <!-- Kolom 4: Jam Operasional & Partners -->
          <div class="flex flex-col gap-4">
            <h4 class="text-xs font-bold uppercase tracking-wider text-white">Jam Operasional</h4>
            <div class="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-2">
              <span class="text-xs text-padel-teal font-black">Setiap Hari</span>
              <span class="text-xs text-white">06:00 - 24:00 WIB</span>
            </div>
            <div class="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity mt-2">
              <span class="text-[10px] text-padel-gray uppercase tracking-widest">Partner Resmi:</span>
              <span class="text-xs font-black tracking-wider text-white">JKT48</span>
            </div>
          </div>
        </div>

        <!-- Sub-Footer / Copyright & Legal -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-[11px] text-padel-gray">
          <div>
            &copy; 2026 Padel48 Hub. All rights reserved.
          </div>
          <div class="flex items-center gap-6">
            <a href="#" class="hover:text-white transition-colors">Syarat & Ketentuan</a>
            <a href="#" class="hover:text-white transition-colors">Kebijakan Privasi</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* Transisi warna menu aktif navigasi */
.active-link {
  color: var(--color-padel-teal) !important;
}
</style>

