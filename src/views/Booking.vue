<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import zeeImg from '../assets/zee.png'
import freyaImg from '../assets/freya.png'
import graciaImg from '../assets/gracia.png'
import christyImg from '../assets/christy.png'
import bgHeroImg from '../assets/bg_hero.png'

const router = useRouter()

// Data lapangan & member JKT48
const courts = [
  { id: 'c61b2e56-11b3-4f9e-a89e-9d2208d51123', name: 'Court 1 (Indoor Arena)', basePrice: 250000 },
  { id: 'a88c2e56-22b3-5f9e-b99e-9d2208d52244', name: 'Court 2 (Semi-Outdoor Arena)', basePrice: 200000 }
]

const jkt48Members = [
  { id: 'e81c1c1c-99a2-4a8e-b88e-1d2208f51199', name: 'Zee JKT48', extraPrice: 500000, avatar: zeeImg },
  { id: 'f72c2c2c-88a2-4b8e-a88e-1d2208f52288', name: 'Freya JKT48', extraPrice: 450000, avatar: freyaImg },
  { id: 'g63c3c3c-77a2-4c8e-a88e-1d2208f53399', name: 'Gracia JKT48', extraPrice: 500000, avatar: graciaImg },
  { id: 'h54c4c4c-66a2-4d8e-a88e-1d2208f54400', name: 'Christy JKT48', extraPrice: 450000, avatar: christyImg }
]

// Slot Waktu bermain (Interval 30 menit)
const timeSlots = ref([
  { id: 1, time: '16:00', booked: false },
  { id: 2, time: '16:30', booked: false },
  { id: 3, time: '17:00', booked: true },  // Booked
  { id: 4, time: '17:30', booked: true },  // Booked
  { id: 5, time: '18:00', booked: false },
  { id: 6, time: '18:30', booked: false },
  { id: 7, time: '19:00', booked: false },
  { id: 8, time: '19:30', booked: false },
  { id: 9, time: '20:00', booked: true },  // Booked
  { id: 10, time: '20:30', booked: false },
  { id: 11, time: '21:00', booked: false },
  { id: 12, time: '21:30', booked: false }
])

// Pilihan User
const form = ref({
  courtId: courts[0].id,
  sessionType: 'REGULAR', // REGULAR atau MABAR
  memberId: null,
  date: '2026-05-28',
  name: '',
  email: '',
  phone: ''
})

// Range Seleksi Waktu
const startSlotIndex = ref(null)
const endSlotIndex = ref(null)
const loading = ref(false)

// State Modal & Simulasi
const showCancelModal = ref(false)
const showRescheduleCalendar = ref(false)
const notificationMessage = ref('')

// Computed: Mendapatkan nama member terpilih
const selectedMember = computed(() => {
  if (form.value.sessionType !== 'MABAR' || !form.value.memberId) return null
  return jkt48Members.find(m => m.id === form.value.memberId)
})

// Klik Slot Waktu
const handleSlotClick = (index) => {
  const slot = timeSlots.value[index]
  if (slot.booked) return

  // 1. Jika belum memilih start slot, atau rentang sudah lengkap, atur start slot baru
  if (startSlotIndex.value === null || (startSlotIndex.value !== null && endSlotIndex.value !== null)) {
    startSlotIndex.value = index
    endSlotIndex.value = null
  } 
  // 2. Jika start slot sudah dipilih tapi end slot belum
  else {
    // Jika memilih slot yang lebih awal dari start, ubah start slot
    if (index < startSlotIndex.value) {
      startSlotIndex.value = index
    } else {
      // Periksa apakah ada slot yang booked di antara start dan end pilihan
      let hasBookedBetween = false
      for (let i = startSlotIndex.value; i <= index; i++) {
        if (timeSlots.value[i].booked) {
          hasBookedBetween = true
          break
        }
      }

      if (hasBookedBetween) {
        // Jika ada slot booked di tengah, set index ini sebagai start slot baru
        startSlotIndex.value = index
      } else {
        endSlotIndex.value = index
      }
    }
  }
}

// Menentukan apakah slot dalam status terpilih (range)
const isSlotSelected = (index) => {
  if (startSlotIndex.value === null) return false
  if (endSlotIndex.value === null) return index === startSlotIndex.value
  return index >= startSlotIndex.value && index <= endSlotIndex.value
}

// Menghitung Durasi Total Bermain dalam Jam
const durationInHours = computed(() => {
  if (startSlotIndex.value === null) return 0
  if (endSlotIndex.value === null) return 0.5 // Default 1 slot = 30 mnt
  return (endSlotIndex.value - startSlotIndex.value + 1) * 0.5
})

// Deskripsi Waktu Terpilih
const selectedTimeFormatted = computed(() => {
  if (startSlotIndex.value === null) return 'Belum Dipilih'
  
  const startTime = timeSlots.value[startSlotIndex.value].time
  
  let endTime
  if (endSlotIndex.value === null) {
    // Tambahkan 30 menit untuk waktu selesai slot tunggal
    const [h, m] = startTime.split(':').map(Number)
    const endMin = m + 30
    const endHour = h + (endMin >= 60 ? 1 : 0)
    const formattedMin = (endMin % 60).toString().padStart(2, '0')
    const formattedHour = endHour.toString().padStart(2, '0')
    endTime = `${formattedHour}:${formattedMin}`
  } else {
    // Tambahkan 30 menit ke slot akhir range
    const lastSlotTime = timeSlots.value[endSlotIndex.value].time
    const [h, m] = lastSlotTime.split(':').map(Number)
    const endMin = m + 30
    const endHour = h + (endMin >= 60 ? 1 : 0)
    const formattedMin = (endMin % 60).toString().padStart(2, '0')
    const formattedHour = endHour.toString().padStart(2, '0')
    endTime = `${formattedHour}:${formattedMin}`
  }
  
  return `${startTime} - ${endTime}`
})

// Menghitung Biaya Total Secara Dinamis
const totalAmount = computed(() => {
  const selectedCourt = courts.find(c => c.id === form.value.courtId)
  const baseRate = selectedCourt ? selectedCourt.basePrice : 0
  
  let extraRate = 0
  if (form.value.sessionType === 'MABAR' && form.value.memberId) {
    const member = jkt48Members.find(m => m.id === form.value.memberId)
    extraRate = member ? member.extraPrice : 0
  }
  
  const hourlyRate = baseRate + extraRate
  const duration = durationInHours.value === 0 ? 0.5 : durationInHours.value
  return hourlyRate * duration
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

// Tanggal Selector (Weekly Calendar)
const days = [
  { label: 'Kam', date: '2026-05-28' },
  { label: 'Jum', date: '2026-05-29' },
  { label: 'Sab', date: '2026-05-30' },
  { label: 'Min', date: '2026-05-31' },
  { label: 'Sen', date: '2026-06-01' }
]

// Fallback Action Handlers (Keadaan Darurat Member Batal)
const handleRefund100 = () => {
  showCancelModal.value = false
  notificationMessage.value = 'Refund dana otomatis sebesar 100% sedang diproses ke E-wallet Anda. Mohon periksa saldo Anda.'
  setTimeout(() => {
    notificationMessage.value = ''
    router.push('/')
  }, 4000)
}

const handleReschedule = () => {
  showRescheduleCalendar.value = true
}

const selectNewRescheduleDate = (newDate) => {
  showRescheduleCalendar.value = false
  showCancelModal.value = false
  form.value.date = newDate
  notificationMessage.value = `Sesi Mabar Anda telah berhasil dijadwal ulang ke tanggal ${newDate}.`
  setTimeout(() => {
    notificationMessage.value = ''
  }, 4000)
}

const handleSwitchToRegular = () => {
  showCancelModal.value = false
  
  // Hitung selisih refund
  const oldPrice = totalAmount.value
  form.value.sessionType = 'REGULAR'
  form.value.memberId = null
  const newPrice = totalAmount.value
  const refundDiff = oldPrice - newPrice

  notificationMessage.value = `Sesi dialihkan ke Sesi Reguler. Selisih biaya sebesar Rp ${refundDiff.toLocaleString('id-ID')} telah dikembalikan ke saldo E-wallet Anda.`
  setTimeout(() => {
    notificationMessage.value = ''
  }, 5000)
}

// Eksekusi Submit Booking
const submitBooking = async () => {
  if (startSlotIndex.value === null) {
    alert('Silakan pilih slot waktu terlebih dahulu!')
    return
  }
  if (!form.value.name || !form.value.email || !form.value.phone) {
    alert('Silakan lengkapi data diri Anda!')
    return
  }

  loading.value = true

  // Simulasi pemanggilan API ke Invoice
  setTimeout(() => {
    loading.value = false
    const randomBookingCode = `PADEL-20260528-${Math.floor(10000 + Math.random() * 90000)}`
    
    // Redirect ke halaman Invoice dengan data booking
    router.push({ 
      name: 'Invoice', 
      params: { bookingCode: randomBookingCode },
      query: {
        court: courts.find(c => c.id === form.value.courtId).name,
        member: form.value.sessionType === 'MABAR' ? jkt48Members.find(m => m.id === form.value.memberId).name : 'Regular',
        date: form.value.date,
        time: selectedTimeFormatted.value,
        amount: totalAmount.value
      }
    })
  }, 1500)
}
</script>

<template>
  <div
    class="relative min-h-screen bg-padel-dark text-white p-4 sm:p-6 lg:p-8 pt-24 sm:pt-28 pb-36 overflow-hidden"
  >
    <!-- Background Image with Overlay -->
    <div class="absolute inset-0 z-0 pointer-events-none">
      <img
        :src="bgHeroImg"
        alt="Hero Background"
        class="w-full h-full object-cover opacity-55 brightness-[0.4] contrast-[1.1]"
      />
      <div
        class="absolute inset-0 bg-gradient-to-b from-black/85 via-black/35 to-black/90"
      ></div>
    </div>

    <div class="max-w-4xl mx-auto flex flex-col space-y-6 z-10 relative">
      
      <!-- Pemberitahuan Toast Info -->
      <transition name="fade">
        <div
          v-if="notificationMessage"
          class="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full bg-padel-teal text-padel-dark px-6 py-4 rounded-xl shadow-2xl font-bold flex items-center gap-3 border border-white/20"
        >
          <span>🔔</span>
          <span class="text-xs">{{ notificationMessage }}</span>
        </div>
      </transition>

      <!-- Step Progress Indicator -->
      <div
        class="flex items-center justify-center gap-4 text-xs font-semibold tracking-wider uppercase mb-2"
      >
        <span class="text-padel-teal flex items-center gap-1.5">
          <span
            class="w-5 h-5 rounded-full bg-padel-teal text-padel-dark flex items-center justify-center font-bold shadow-sm"
          >
            1
          </span>
          Select Slot
        </span>
        <span class="w-8 h-px bg-white/10"></span>
        <span class="text-padel-gray flex items-center gap-1.5">
          <span
            class="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px]"
          >
            2
          </span>
          Payment
        </span>
        <span class="w-8 h-px bg-white/10"></span>
        <span class="text-padel-gray flex items-center gap-1.5">
          <span
            class="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px]"
          >
            3
          </span>
          Ticket
        </span>
      </div>

      <!-- Header -->
      <div class="text-center flex flex-col space-y-1 mb-2">
        <h1 class="text-3xl font-extrabold text-white tracking-tight">Formulir Booking Lapangan</h1>
        <p class="text-xs text-padel-gray">
          Pilih sesi reguler atau sesi mabar seru bareng member JKT48 pilihanmu dengan waktu fleksibel.
        </p>
      </div>

      <!-- Bento Grid Container -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        
        <!-- Bento Box 1: Pilihan Lapangan & Tipe Sesi (col-span-12 md:col-span-5) -->
        <div
          class="solid-panel p-6 rounded-2xl flex flex-col justify-between space-y-6 border border-white/5 hover:border-padel-teal/30 transition-all duration-300 relative overflow-hidden md:col-span-5 min-h-[220px]"
        >
          <!-- Glow background decorative -->
          <div
            class="absolute top-0 right-0 w-32 h-32 rounded-full bg-padel-teal/5 blur-[50px] pointer-events-none"
          ></div>
          
          <div class="flex flex-col space-y-4">
            <!-- Lapangan -->
            <div class="flex flex-col space-y-2">
              <label class="text-[10px] font-bold uppercase tracking-widest text-padel-gray">
                Pilih Lapangan Arena:
              </label>
              <div class="relative">
                <select
                  v-model="form.courtId"
                  class="w-full bg-padel-dark/75 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 text-xs focus:border-padel-teal focus:outline-none appearance-none cursor-pointer text-white font-semibold"
                >
                  <option v-for="court in courts" :key="court.id" :value="court.id">
                    🎾 {{ court.name }} (Rp {{ court.basePrice.toLocaleString('id-ID') }}/jam)
                  </option>
                </select>
                <div
                  class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-padel-gray"
                >
                  ▼
                </div>
              </div>
            </div>

            <!-- Tipe Sesi -->
            <div class="flex flex-col space-y-2">
              <label class="text-[10px] font-bold uppercase tracking-widest text-padel-gray">
                Tipe Sesi Bermain:
              </label>
              <div class="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  @click="selectSessionType('REGULAR')"
                  :class="
                    form.sessionType === 'REGULAR'
                      ? 'border-padel-teal bg-padel-teal/10 text-padel-teal shadow-lg shadow-padel-teal/5'
                      : 'border-white/10 text-padel-gray hover:text-white bg-white/2'
                  "
                  class="px-3 py-2.5 border rounded-xl text-[10px] font-extrabold uppercase tracking-widest transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  Sesi Reguler
                </button>
                
                <button
                  type="button"
                  @click="selectSessionType('MABAR')"
                  :class="
                    form.sessionType === 'MABAR'
                      ? 'border-padel-red bg-padel-red/10 text-padel-red shadow-lg shadow-padel-red/5'
                      : 'border-white/10 text-padel-gray hover:text-white bg-white/2'
                  "
                  class="px-3 py-2.5 border rounded-xl text-[10px] font-extrabold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-1.5 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  ⭐ Mabar JKT48
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Bento Box 2: Kalender Pemilihan Tanggal (col-span-12 md:col-span-7) -->
        <div
          class="solid-panel p-6 rounded-2xl flex flex-col justify-between space-y-6 border border-white/5 hover:border-padel-teal/30 transition-all duration-300 relative overflow-hidden md:col-span-7 min-h-[220px]"
        >
          <!-- Glow background decorative -->
          <div
            class="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-padel-teal/5 blur-[50px] pointer-events-none"
          ></div>
          
          <div class="flex flex-col space-y-4 w-full">
            <label class="text-[10px] font-bold uppercase tracking-widest text-padel-gray">
              Pilih Tanggal Bermain:
            </label>
            <div class="flex gap-3 justify-between w-full overflow-x-auto pb-2">
              <button
                v-for="day in days"
                :key="day.date"
                type="button"
                @click="form.date = day.date"
                :class="
                  form.date === day.date
                    ? form.sessionType === 'MABAR'
                      ? 'border-padel-red bg-padel-red/15 text-padel-red shadow-lg shadow-padel-red/5'
                      : 'border-padel-teal bg-padel-teal/15 text-padel-teal shadow-lg shadow-padel-teal/5'
                    : 'border-white/10 text-padel-gray hover:text-white bg-white/2'
                "
                class="flex-1 min-w-[60px] py-3.5 border rounded-xl flex flex-col items-center justify-center text-center transition-all duration-300 hover:scale-[1.05] active:scale-[0.95] cursor-pointer"
              >
                <span class="text-[9px] uppercase font-bold tracking-wider opacity-60 mb-1">
                  {{ day.label }}
                </span>
                <span class="text-base font-black">{{ day.date.split('-')[2] }}</span>
              </button>
            </div>
          </div>
          
          <!-- Date Footer Helper -->
          <div class="text-[10px] text-padel-gray/80 flex items-center gap-1.5 font-semibold">
            <span>📅 Tanggal Aktif:</span>
            <span class="text-white font-bold font-mono">{{ form.date }}</span>
          </div>
        </div>

        <!-- Bento Box 3: Pilihan Member JKT48 (col-span-12) -->
        <transition name="fade-slide">
          <div
            v-if="form.sessionType === 'MABAR'"
            class="solid-panel p-6 rounded-2xl flex flex-col space-y-4 border border-padel-red/20 hover:border-padel-red/45 transition-all duration-500 relative overflow-hidden col-span-12"
          >
            <!-- Glow background decorative JKT48 -->
            <div
              class="absolute top-0 right-0 w-64 h-64 rounded-full bg-padel-red/5 blur-[80px] pointer-events-none"
            ></div>
            
            <div
              class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-white/5"
            >
              <div class="space-y-1">
                <span class="text-[10px] font-bold text-padel-red uppercase tracking-widest">
                  Eksklusif Sportainment
                </span>
                <h3 class="text-base font-black text-white">Pilih Teman Mabar JKT48 Member</h3>
              </div>
              
              <!-- Simulasi Kegagalan Member -->
              <button
                type="button"
                @click="showCancelModal = true"
                class="px-3.5 py-1.5 rounded-lg border border-padel-red/35 hover:border-padel-red bg-padel-red/5 hover:bg-padel-red/10 text-[9px] font-extrabold text-padel-red uppercase tracking-widest transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                ⚠️ Simulasi Member Batal
              </button>
            </div>

            <!-- Grid Kartu Member Bento Layout -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div
                v-for="member in jkt48Members"
                :key="member.id"
                @click="form.memberId = member.id"
                :class="
                  form.memberId === member.id
                    ? 'border-padel-red bg-padel-red/10 text-padel-red shadow-xl shadow-padel-red/15 -translate-y-1.5 ring-2 ring-padel-red/30'
                    : 'border-white/5 bg-black/40 hover:border-padel-red/30 hover:bg-white/5 hover:-translate-y-1 hover:shadow-lg hover:shadow-padel-red/5'
                "
                class="group p-4 border rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-500 relative overflow-hidden min-h-[140px]"
              >
                <!-- Glow orb inside active card -->
                <div
                  v-if="form.memberId === member.id"
                  class="absolute -inset-2 bg-padel-red/10 blur-lg pointer-events-none"
                ></div>
                
                <!-- Circular Avatar with Hover Glow -->
                <div
                  class="relative w-16 h-16 rounded-full overflow-hidden border-2 transition-all duration-500 group-hover:scale-105"
                  :class="
                    form.memberId === member.id
                      ? 'border-padel-red shadow-lg shadow-padel-red/30'
                      : 'border-white/10 group-hover:border-padel-red/50'
                  "
                >
                  <img :src="member.avatar" :alt="member.name" class="w-full h-full object-cover" />
                  <!-- Circular Pulse Glow for Active Avatar -->
                  <div
                    v-if="form.memberId === member.id"
                    class="absolute inset-0 rounded-full border border-padel-red animate-ping opacity-30 pointer-events-none"
                  ></div>
                </div>
                
                <span
                  class="text-xs font-black text-white mt-3 group-hover:text-padel-red transition-colors duration-300"
                >
                  {{ member.name }}
                </span>
                
                <div
                  class="flex items-center gap-1 mt-1.5 text-[9px] font-bold text-padel-gold border border-padel-gold/30 bg-padel-gold/5 px-2 py-0.5 rounded-full uppercase"
                >
                  <span>VIP</span>
                  <span>+Rp {{ member.extraPrice.toLocaleString('id-ID') }}</span>
                </div>
              </div>
            </div>
          </div>
        </transition>

        <!-- Bento Box 4: Grid Slot Waktu Bermain (col-span-12 md:col-span-6) -->
        <div
          class="solid-panel p-6 rounded-2xl flex flex-col space-y-4 border border-white/5 hover:border-padel-teal/30 transition-all duration-300 relative overflow-hidden md:col-span-6 min-h-[300px]"
        >
          <!-- Glow background decorative -->
          <div
            class="absolute bottom-0 right-0 w-32 h-32 rounded-full bg-padel-teal/5 blur-[50px] pointer-events-none"
          ></div>
          
          <div class="flex justify-between items-baseline border-b border-white/5 pb-3">
            <div class="space-y-0.5">
              <label class="text-[10px] font-bold uppercase tracking-widest text-padel-gray">
                Pilih Slot Waktu Bermain:
              </label>
              <p class="text-[9px] text-padel-gray/80">30 menit per slot. Pilih rentang waktu bermain.</p>
            </div>
            <span
              v-if="startSlotIndex !== null"
              class="text-[10px] text-padel-teal font-extrabold uppercase bg-padel-teal/5 border border-padel-teal/30 px-2 py-0.5 rounded-full"
            >
              {{ durationInHours }} Jam
            </span>
          </div>

          <div class="grid grid-cols-3 gap-2 pt-1">
            <button
              v-for="(slot, index) in timeSlots"
              :key="slot.id"
              type="button"
              :disabled="slot.booked"
              @click="handleSlotClick(index)"
              :class="[
                slot.booked
                  ? 'opacity-30 cursor-not-allowed border-dashed border-padel-red/35 text-padel-gray booked-slot'
                  : 'border-white/10 hover:border-padel-teal/40 hover:scale-[1.03] text-white bg-white/5 hover:bg-padel-teal/5',
                startSlotIndex === index || endSlotIndex === index
                  ? 'border-padel-teal bg-padel-teal/25 text-padel-teal shadow-md shadow-padel-teal/10 font-black scale-[1.02]'
                  : '',
                startSlotIndex !== null &&
                endSlotIndex !== null &&
                index > startSlotIndex &&
                index < endSlotIndex
                  ? 'border-padel-teal/50 bg-padel-teal/10 text-padel-teal font-semibold'
                  : ''
              ]"
              class="py-3 border rounded-xl text-[10px] font-extrabold transition-all duration-300 relative overflow-hidden cursor-pointer"
            >
              <span class="relative z-10">{{ slot.time }}</span>
              <!-- Indikator Start / End -->
              <span
                v-if="startSlotIndex === index"
                class="absolute bottom-0 right-1.5 text-[6px] text-padel-teal font-black uppercase tracking-wider"
              >
                In
              </span>
              <span
                v-if="endSlotIndex === index"
                class="absolute bottom-0 right-1.5 text-[6px] text-padel-teal font-black uppercase tracking-wider"
              >
                Out
              </span>
            </button>
          </div>
        </div>

        <!-- Bento Box 5: Formulir Data Diri Kontak (col-span-12 md:col-span-6) -->
        <div
          class="solid-panel p-6 rounded-2xl flex flex-col justify-between space-y-4 border border-white/5 hover:border-padel-teal/30 transition-all duration-300 relative overflow-hidden md:col-span-6 min-h-[300px]"
        >
          <!-- Glow background decorative -->
          <div
            class="absolute top-0 left-0 w-32 h-32 rounded-full bg-padel-teal/5 blur-[50px] pointer-events-none"
          ></div>
          
          <div class="space-y-3 w-full">
            <div class="border-b border-white/5 pb-3">
              <label class="text-[10px] font-bold uppercase tracking-widest text-padel-gray">
                Data Kontak Pemesan:
              </label>
              <p class="text-[9px] text-padel-gray/80">Lengkapi data untuk mengirimkan e-ticket.</p>
            </div>
            
            <div class="flex flex-col space-y-3 pt-1">
              <div class="relative flex items-center">
                <span class="absolute left-4 text-xs opacity-40">👤</span>
                <input
                  v-model="form.name"
                  type="text"
                  placeholder="Nama Lengkap Pemesan"
                  class="w-full bg-padel-dark/75 backdrop-blur-md border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs focus:border-padel-teal focus:outline-none transition-all duration-300 font-medium placeholder-white/20"
                />
              </div>
              
              <div class="relative flex items-center">
                <span class="absolute left-4 text-xs opacity-40">✉️</span>
                <input
                  v-model="form.email"
                  type="email"
                  placeholder="Alamat Email Aktif"
                  class="w-full bg-padel-dark/75 backdrop-blur-md border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs focus:border-padel-teal focus:outline-none transition-all duration-300 font-medium placeholder-white/20"
                />
              </div>
              
              <div class="relative flex items-center">
                <span class="absolute left-4 text-xs opacity-40">📞</span>
                <input
                  v-model="form.phone"
                  type="text"
                  placeholder="Nomor WhatsApp (08xxx)"
                  class="w-full bg-padel-dark/75 backdrop-blur-md border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs focus:border-padel-teal focus:outline-none transition-all duration-300 font-medium placeholder-white/20"
                />
              </div>
            </div>
          </div>
          
          <!-- Terms Note -->
          <p class="text-[9px] text-padel-gray/60 leading-relaxed font-semibold">
            * Dengan mengklik checkout, Anda menyetujui syarat & ketentuan arena Padel48, termasuk kebijakan fallback jika member berhalangan hadir.
          </p>
        </div>

      </div>
    </div>

    <div
      v-if="showCancelModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xl"
    >
      <div
        class="max-w-md w-full solid-panel border border-padel-red/40 p-6 rounded-2xl flex flex-col space-y-5 shadow-xl animate-fade-in text-center"
      >
        <div
          class="w-16 h-16 rounded-full bg-padel-red/10 border border-padel-red/30 flex items-center justify-center text-2xl mx-auto text-padel-red animate-pulse"
        >
          ⚠️
        </div>
        
        <div>
          <h3 class="text-lg font-black text-white">Member Berhalangan Hadir!</h3>
          <p class="text-xs text-padel-gray mt-2 leading-relaxed">
            Kami sangat menyesal mengabarkan bahwa 
            <span class="text-padel-red font-bold font-mono">
              {{ selectedMember ? selectedMember.name : 'Member JKT48' }}
            </span> 
            mendadak berhalangan hadir pada sesi ini karena kendala medis/manajemen.
          </p>
        </div>

        <div class="flex flex-col gap-2.5">
          <!-- Opsi 1: Refund 100% -->
          <button
            @click="handleRefund100"
            class="w-full py-3 rounded-xl border border-padel-red/35 hover:border-padel-red bg-padel-red/5 hover:bg-padel-red text-padel-red hover:text-white text-xs font-bold transition-all duration-300 hover:scale-[1.01]"
          >
            💸 Refund Dana Sesi 100% Instan
          </button>
          
          <!-- Opsi 2: Reschedule Sesi -->
          <button
            @click="handleReschedule"
            class="w-full py-3 rounded-xl border border-white/10 hover:border-padel-teal bg-white/5 hover:bg-padel-teal/10 text-white hover:text-padel-teal text-xs font-bold transition-all duration-300 hover:scale-[1.01]"
          >
            📅 Reschedule Sesi Mabar JKT48
          </button>
          
          <!-- Opsi 3: Alih ke Regular + Refund Selisih -->
          <button
            @click="handleSwitchToRegular"
            class="w-full py-3 rounded-xl border border-padel-gold/30 hover:border-padel-gold bg-padel-gold/5 hover:bg-padel-gold/10 text-padel-gold text-xs font-bold transition-all duration-300 hover:scale-[1.01]"
          >
            🏸 Beralih ke Sesi Reguler (Refund Selisih Harga)
          </button>
        </div>

        <!-- Batal Simulasi -->
        <button
          @click="showCancelModal = false"
          class="text-[10px] text-padel-gray hover:text-white underline"
        >
          Batalkan Simulasi
        </button>
      </div>
    </div>

    <!-- Inner Modal: Picker Reschedule -->
    <div
      v-if="showRescheduleCalendar"
      class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/75 backdrop-blur-xl"
    >
      <div
        class="max-w-xs w-full solid-panel border border-padel-teal/40 p-5 rounded-2xl flex flex-col space-y-4 shadow-2xl"
      >
        <h4 class="text-sm font-black text-padel-teal border-b border-white/5 pb-2 text-center">
          Pilih Tanggal Reschedule Baru
        </h4>
        <div class="flex flex-col gap-2">
          <!-- Pilih Tanggal Alternatif -->
          <button
            v-for="altDay in ['2026-06-05', '2026-06-06', '2026-06-07']"
            :key="altDay"
            @click="selectNewRescheduleDate(altDay)"
            class="w-full py-2.5 rounded-xl border border-white/10 bg-white/5 hover:border-padel-teal hover:text-padel-teal text-xs font-semibold transition-all"
          >
            {{ altDay.split('-')[2] }} Juni 2026 (Tersedia)
          </button>
        </div>
        <button
          @click="showRescheduleCalendar = false"
          class="text-[10px] text-padel-gray hover:text-white underline text-center"
        >
          Kembali
        </button>
      </div>
    </div>

    <!-- Floating Bottom Checkout Summary Bar -->
    <transition name="slide-up">
      <div
        v-if="startSlotIndex !== null"
        class="fixed bottom-0 left-0 right-0 z-30 bg-black/75 backdrop-blur-xl border-t border-white/10 py-4 px-6 md:px-12 shadow-[0_-10px_30px_rgba(0,0,0,0.6)]"
      >
        <div class="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <!-- Rincian Ringkasan -->
          <div class="flex flex-col text-center sm:text-left">
            <span class="text-[10px] text-padel-gray font-bold uppercase tracking-widest">
              Ringkasan Checkout
            </span>
            <div class="flex items-center gap-2 mt-1 justify-center sm:justify-start">
              <span class="text-xs font-semibold text-white">
                {{ form.sessionType === 'MABAR' ? `Mabar ${selectedMember?.name || 'Member'}` : 'Sesi Reguler' }}
              </span>
              <span class="text-xs text-padel-gray">|</span>
              <span class="text-xs text-padel-teal font-mono">
                {{ selectedTimeFormatted }}
              </span>
              <span v-if="durationInHours > 0" class="text-[10px] bg-white/10 text-padel-gray px-1.5 py-0.5 rounded">
                {{ durationInHours }} Jam
              </span>
            </div>
          </div>

          <!-- Biaya & Tombol CTA -->
          <div class="flex items-center gap-6">
            <div class="flex flex-col text-right">
              <span class="text-[9px] text-padel-gray font-bold uppercase tracking-wider">
                Total Pembayaran
              </span>
              <span class="text-2xl font-black text-padel-teal tracking-tight">
                Rp {{ totalAmount.toLocaleString('id-ID') }}
              </span>
            </div>
            
            <button
              type="button"
              @click="submitBooking"
              :disabled="loading"
              class="px-8 py-3.5 rounded-xl bg-padel-teal text-padel-dark font-black text-sm flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] hover:shadow-lg hover:shadow-padel-teal/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span
                v-if="loading"
                class="w-4 h-4 border-2 border-padel-dark border-t-transparent rounded-full animate-spin"
              ></span>
              {{ loading ? 'Memproses...' : 'Proceed to Payment' }}
            </button>
          </div>
        </div>
      </div>
    </transition>
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

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px);
}

/* Animasi Arsiran Bergerak untuk Booked Slot */
@keyframes bookedSlide {
  0% { background-position: 0 0; }
  100% { background-position: 20px 20px; }
}
.booked-slot {
  background: repeating-linear-gradient(45deg, rgba(239, 28, 36, 0.1), rgba(239, 28, 36, 0.1) 5px, rgba(0, 0, 0, 0.2) 5px, rgba(0, 0, 0, 0.2) 10px) !important;
  background-size: 20px 20px !important;
  animation: bookedSlide 1.5s linear infinite !important;
}
</style>
