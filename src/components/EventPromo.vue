<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { RouterLink } from 'vue-router'

const events = ref([
  {
    id: 1,
    title: 'Padel48 JKT48 Fun Match',
    date: '30 Juni 2026',
    desc: 'Saksikan pertandingan eksibisi ganda seru antara member JKT48 (Zee & Freya) melawan atlet padel nasional. Ada sesi meet & greet khusus setelah pertandingan bagi pemegang tiket Mabar!',
    badge: 'Exclusive Event',
    accent: 'red',
    visible: false
  },
  {
    id: 2,
    title: 'Coaching Clinic with Pro Coaches',
    date: '05 Juli 2026',
    desc: 'Tingkatkan teknik smash, spin, dan penempatan dinding kaca Anda langsung dari pelatih berlisensi WPT. Terbuka untuk semua tingkat keahlian dari pemula hingga mahir.',
    badge: 'Coaching Clinic',
    accent: 'teal',
    visible: false
  },
  {
    id: 3,
    title: 'Midnight Tournament Padel48',
    date: '12 Juli 2026',
    desc: 'Turnamen komunitas ganda malam hari di bawah lampu sorot LED 500 lux. Dapatkan trofi eksklusif, hadiah jutaan rupiah, dan official merchandise bertandatangan member.',
    badge: 'Tournament',
    accent: 'gold',
    visible: false
  }
])

const observeEvents = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = parseInt(entry.target.getAttribute('data-event-id'))
        const ev = events.value.find(e => e.id === id)
        if (ev) ev.visible = true
      }
    })
  }, { threshold: 0.15 })

  nextTick(() => {
    const elms = document.querySelectorAll('.event-card-trigger')
    elms.forEach(el => observer.observe(el))
  })
}

onMounted(() => {
  observeEvents()
})
</script>

<template>
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full z-10 flex flex-col space-y-10">
    <div class="text-center max-w-xl mx-auto space-y-3">
      <span class="text-xs font-bold text-padel-teal uppercase tracking-widest">Informasi Terbaru</span>
      <h2 class="text-3xl font-extrabold text-white tracking-tight">Event & Promo Mendatang</h2>
      <p class="text-sm text-padel-gray">
        Ikuti berbagai agenda seru dan raih penawaran terbatas untuk pengalaman padel terbaik Anda.
      </p>
    </div>

    <!-- Grid Event Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div
        v-for="event in events"
        :key="event.id"
        :data-event-id="event.id"
        :class="[
          'event-card-trigger solid-panel p-6 rounded-2xl flex flex-col justify-between space-y-6 border transition-all duration-700 transform',
          event.visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95 pointer-events-none',
          event.accent === 'red' ? 'hover:border-padel-red/40' : event.accent === 'gold' ? 'hover:border-padel-gold/40' : 'hover:border-padel-teal/40'
        ]"
      >
        <div class="space-y-4">
          <!-- Badge & Date -->
          <div class="flex justify-between items-center text-xs">
            <span
              :class="[
                'px-2.5 py-0.5 rounded-full font-bold uppercase text-[9px] tracking-wider border',
                event.accent === 'red'
                  ? 'bg-padel-red/10 border-padel-red/30 text-padel-red'
                  : event.accent === 'gold'
                    ? 'bg-padel-gold/10 border-padel-gold/30 text-padel-gold'
                    : 'bg-padel-teal/10 border-padel-teal/30 text-padel-teal'
              ]"
            >
              {{ event.badge }}
            </span>
            <span class="text-padel-gray font-mono font-semibold">{{ event.date }}</span>
          </div>

          <!-- Title & Desc -->
          <div class="space-y-2">
            <h3 class="text-lg font-bold text-white tracking-tight leading-snug">{{ event.title }}</h3>
            <p class="text-xs text-padel-gray leading-relaxed">{{ event.desc }}</p>
          </div>
        </div>

        <!-- Action Button Inside Card -->
        <div class="pt-4 border-t border-white/5">
          <RouterLink
            to="/booking"
            :class="[
              'w-full py-2 rounded-xl text-center text-xs font-bold transition-all duration-300 block border',
              event.accent === 'red'
                ? 'bg-padel-red/10 hover:bg-padel-red text-padel-red hover:text-white border-padel-red/30'
                : event.accent === 'gold'
                  ? 'bg-padel-gold/10 hover:bg-padel-gold text-padel-gold hover:text-padel-dark border-padel-gold/30'
                  : 'bg-padel-teal/10 hover:bg-padel-teal text-padel-teal hover:text-padel-dark border-padel-teal/30'
            ]"
          >
            Daftar / Booking Sekarang &rarr;
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
