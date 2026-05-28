<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Data lapangan & member JKT48
const courts = [
  { id: 'c61b2e56-11b3-4f9e-a89e-9d2208d51123', name: 'Court 1 (Indoor Arena)', basePrice: 250000 },
  { id: 'a88c2e56-22b3-5f9e-b99e-9d2208d52244', name: 'Court 2 (Semi-Outdoor Arena)', basePrice: 200000 }
]

const jkt48Members = [
  { id: 'e81c1c1c-99a2-4a8e-b88e-1d2208f51199', name: 'Zee JKT48', extraPrice: 500000, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
  { id: 'f72c2c2c-88a2-4b8e-a88e-1d2208f52288', name: 'Freya JKT48', extraPrice: 450000, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80' },
  { id: 'g63c3c3c-77a2-4c8e-a88e-1d2208f53399', name: 'Gracia JKT48', extraPrice: 500000, avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80' },
  { id: 'h54c4c4c-66a2-4d8e-a88e-1d2208f54400', name: 'Christy JKT48', extraPrice: 450000, avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&auto=format&fit=crop&q=80' }
]

// Slot Waktu bermain
const timeSlots = [
  { id: 1, start: '16:00:00', end: '17:00:00', booked: false },
  { id: 2, start: '17:00:00', end: '18:00:00', booked: true },
  { id: 3, start: '18:00:00', end: '19:00:00', booked: false },
  { id: 4, start: '19:00:00', end: '20:00:00', booked: false },
  { id: 5, start: '20:00:00', end: '21:00:00', booked: true },
  { id: 6, start: '21:00:00', end: '22:00:00', booked: false }
]

// Pilihan User
const form = ref({
  courtId: courts[0].id,
  sessionType: 'REGULAR', // REGULAR atau MABAR
  memberId: null,
  date: '2026-05-28',
  timeSlot: null,
  name: '',
  email: '',
  phone: ''
})

const loading = ref(false)

// Menghitung Biaya Total
const totalAmount = computed(() => {
  const selectedCourt = courts.find(c => c.id === form.value.courtId)
  const courtPrice = selectedCourt ? selectedCourt.basePrice : 0
  
  let extraPrice = 0
  if (form.value.sessionType === 'MABAR' && form.value.memberId) {
    const member = jkt48Members.find(m => m.id === form.value.memberId)
    extraPrice = member ? member.extraPrice : 0
  }
  
  return courtPrice + extraPrice
})

// Pindah Sesi
const selectSessionType = (type) => {
  form.value.sessionType = type
  if (type === 'REGULAR') {
    form.value.memberId = null
  } else {
    form.value.memberId = jkt48Members[0].id
  }
}

// Tanggal Selector (Simple)
const days = [
  { label: 'Kam', date: '2026-05-28' },
  { label: 'Jum', date: '2026-05-29' },
  { label: 'Sab', date: '2026-05-30' },
  { label: 'Min', date: '2026-05-31' },
  { label: 'Sen', date: '2026-06-01' }
]

// Eksekusi Submit Booking (API / Simulasi)
const submitBooking = async () => {
  if (!form.value.timeSlot) {
    alert('Silakan pilih slot waktu terlebih dahulu!')
    return
  }
  if (!form.value.name || !form.value.email || !form.value.phone) {
    alert('Silakan lengkapi data diri Anda!')
    return
  }

  loading.value = true

  // Simulasi pemanggilan API
  setTimeout(() => {
    loading.value = false
    const randomBookingCode = `PADEL-20260528-${Math.floor(10000 + Math.random() * 90000)}`
    
    // Redirect ke halaman Invoice
    router.push({ 
      name: 'Invoice', 
      params: { bookingCode: randomBookingCode },
      query: {
        court: courts.find(c => c.id === form.value.courtId).name,
        member: form.value.sessionType === 'MABAR' ? jkt48Members.find(m => m.id === form.value.memberId).name : 'Regular',
        date: form.value.date,
        time: form.value.timeSlot,
        amount: totalAmount.value
      }
    })
  }, 1500)
}
</script>

<template>
  <div class="relative min-h-screen bg-padel-dark text-white p-4 sm:p-6 lg:p-8">
    <div class="max-w-4xl mx-auto flex flex-col space-y-8">
      <!-- Header -->
      <div class="text-center flex flex-col space-y-2">
        <h1 class="text-3xl font-extrabold text-white tracking-tight">Formulir Booking Lapangan</h1>
        <p class="text-sm text-padel-gray">Pilih sesi reguler atau sesi mabar seru bareng member JKT48 pilihanmu.</p>
      </div>

      <!-- Form Container -->
      <div class="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        <!-- Kolom Kiri: Pilihan Sesi -->
        <div class="flex flex-col space-y-6">
          <!-- Lapangan -->
          <div class="flex flex-col space-y-2">
            <label class="text-xs font-bold uppercase tracking-wider text-padel-gray">Pilih Lapangan:</label>
            <select v-model="form.courtId" class="w-full bg-padel-card border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-padel-teal focus:outline-none">
              <option v-for="court in courts" :key="court.id" :value="court.id">
                {{ court.name }} - Rp {{ court.basePrice.toLocaleString('id-ID') }}/jam
              </option>
            </select>
          </div>

          <!-- Tipe Sesi -->
          <div class="flex flex-col space-y-2">
            <label class="text-xs font-bold uppercase tracking-wider text-padel-gray">Tipe Sesi Bermain:</label>
            <div class="grid grid-cols-2 gap-3">
              <button type="button" @click="selectSessionType('REGULAR')"
                      :class="form.sessionType === 'REGULAR' ? 'border-padel-teal bg-padel-teal/10 text-padel-teal' : 'border-white/10 text-padel-gray hover:text-white'"
                      class="px-4 py-3 border rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300">
                Sesi Reguler
              </button>
              <button type="button" @click="selectSessionType('MABAR')"
                      :class="form.sessionType === 'MABAR' ? 'border-padel-gold bg-padel-gold/10 text-padel-gold' : 'border-white/10 text-padel-gray hover:text-white'"
                      class="px-4 py-3 border rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5">
                ⭐ Mabar JKT48
              </button>
            </div>
          </div>

          <!-- Pilihan Member JKT48 (Jika Mabar) -->
          <div v-if="form.sessionType === 'MABAR'" class="flex flex-col space-y-3">
            <label class="text-xs font-bold uppercase tracking-wider text-padel-gray">Pilih Teman Mabar JKT48:</label>
            <div class="grid grid-cols-2 gap-3">
              <div v-for="member in jkt48Members" :key="member.id"
                   @click="form.memberId = member.id"
                   :class="form.memberId === member.id ? 'border-padel-red bg-padel-red/5' : 'border-white/5 bg-black/20 hover:border-white/10'"
                   class="p-3 border rounded-xl flex items-center gap-3 cursor-pointer transition-all duration-300">
                <img :src="member.avatar" :alt="member.name" class="w-10 h-10 rounded-full object-cover border border-white/20" />
                <div class="flex flex-col">
                  <span class="text-xs font-bold text-white">{{ member.name.split(' ')[0] }}</span>
                  <span class="text-[9px] text-padel-gold">+{{ member.extraPrice / 1000 }}K</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Pemilihan Tanggal -->
          <div class="flex flex-col space-y-2">
            <label class="text-xs font-bold uppercase tracking-wider text-padel-gray">Pilih Tanggal Bermain:</label>
            <div class="flex gap-2 justify-between">
              <button v-for="day in days" :key="day.date" type="button"
                      @click="form.date = day.date"
                      :class="form.date === day.date ? 'border-padel-teal bg-padel-teal text-padel-dark' : 'border-white/10 text-padel-gray hover:text-white'"
                      class="flex-1 py-2 border rounded-xl flex flex-col items-center justify-center text-center transition-all duration-300">
                <span class="text-[9px] uppercase font-bold">{{ day.label }}</span>
                <span class="text-sm font-black">{{ day.date.split('-')[2] }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Kolom Kanan: Sesi Waktu & Data Kontak -->
        <div class="flex flex-col space-y-6">
          <!-- Pemilihan Slot Waktu -->
          <div class="flex flex-col space-y-2">
            <label class="text-xs font-bold uppercase tracking-wider text-padel-gray">Pilih Slot Waktu:</label>
            <div class="grid grid-cols-2 gap-2">
              <button v-for="slot in timeSlots" :key="slot.id" type="button"
                      :disabled="slot.booked"
                      @click="form.timeSlot = `${slot.start.slice(0,5)} - ${slot.end.slice(0,5)}`"
                      :class="[
                        slot.booked ? 'opacity-30 cursor-not-allowed bg-white/5 border-dashed border-white/10 text-padel-gray' : '',
                        form.timeSlot === `${slot.start.slice(0,5)} - ${slot.end.slice(0,5)}` 
                          ? 'border-padel-teal bg-padel-teal/15 text-padel-teal' 
                          : 'border-white/10 hover:border-white/20 text-white'
                      ]"
                      class="py-2.5 border rounded-xl text-xs font-semibold transition-all duration-300">
                {{ slot.start.slice(0,5) }} - {{ slot.end.slice(0,5) }}
              </button>
            </div>
          </div>

          <!-- Data Diri Kontak -->
          <div class="flex flex-col space-y-3 pt-4 border-t border-white/5">
            <label class="text-xs font-bold uppercase tracking-wider text-padel-gray">Data Kontak Pemesan:</label>
            
            <input v-model="form.name" type="text" placeholder="Nama Lengkap" 
                   class="w-full bg-padel-card border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:border-padel-teal focus:outline-none" />
            
            <input v-model="form.email" type="email" placeholder="Alamat Email" 
                   class="w-full bg-padel-card border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:border-padel-teal focus:outline-none" />
            
            <input v-model="form.phone" type="text" placeholder="Nomor WhatsApp (08xxx)" 
                   class="w-full bg-padel-card border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:border-padel-teal focus:outline-none" />
          </div>

          <!-- Biaya & Checkout CTA -->
          <div class="pt-6 border-t border-white/5 flex flex-col space-y-4">
            <div class="flex justify-between items-center text-sm">
              <span class="text-padel-gray font-semibold">Total Biaya Pemesanan:</span>
              <span class="text-2xl font-black text-padel-teal">Rp {{ totalAmount.toLocaleString('id-ID') }}</span>
            </div>
            
            <button type="button" @click="submitBooking" :disabled="loading"
                    class="w-full py-3.5 rounded-xl bg-padel-teal text-padel-dark font-extrabold text-sm flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50">
              <span v-if="loading" class="w-4 h-4 border-2 border-padel-dark border-t-transparent rounded-full animate-spin"></span>
              {{ loading ? 'Memproses Booking...' : 'Lanjut ke Pembayaran QRIS' }}
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
