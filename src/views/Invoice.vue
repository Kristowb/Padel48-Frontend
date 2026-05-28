<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Detail booking dari query params
const bookingCode = computed(() => route.params.bookingCode || 'PADEL-DEFAULT-XXXX')
const courtName = computed(() => route.query.court || 'Padel Court 1')
const memberName = computed(() => route.query.member || 'Regular Sessi')
const bookingDate = computed(() => route.query.date || '2026-05-28')
const bookingTime = computed(() => route.query.time || '16:00 - 17:00')
const totalAmount = computed(() => Number(route.query.amount || 250000))

// Status Pembayaran: PENDING, PAID, EXPIRED
const paymentStatus = ref('PENDING')
const qrPayload = "00020101021226380010ID.CO.QRIS.WWW0215ID1020304050607110303UMI51440014ID.CO.QRIS.WWW52045999530336054067500005802ID5915PADEL48 JAKARTA6007JAKARTA61051211062070703A016304ABCD"

// Countdown Timer 15 Menit (900 detik)
const timeLeft = ref(900)
let timerInterval = null

const minutes = computed(() => Math.floor(timeLeft.value / 60).toString().padStart(2, '0'))
const seconds = computed(() => (timeLeft.value % 60).toString().padStart(2, '0'))

onMounted(() => {
  timerInterval = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      paymentStatus.value = 'EXPIRED'
      clearInterval(timerInterval)
    }
  }, 1000)
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})

// Simulasi Bayar Sukses (Webhook Simulator)
const simulatePaymentSuccess = () => {
  paymentStatus.value = 'PAID'
  if (timerInterval) clearInterval(timerInterval)
}
</script>

<template>
  <div class="relative min-h-screen bg-padel-dark text-white p-4 sm:p-6 lg:p-8 flex items-center justify-center">
    <!-- Background Decor -->
    <div class="absolute top-20 left-1/3 w-96 h-96 rounded-full bg-padel-teal/5 blur-[120px] pointer-events-none"></div>
    <div class="absolute bottom-20 right-1/3 w-96 h-96 rounded-full bg-padel-red/5 blur-[120px] pointer-events-none"></div>

    <div class="max-w-md w-full glass-panel rounded-2xl border border-white/10 p-6 sm:p-8 flex flex-col space-y-6 relative z-10">
      <!-- Header Invoice -->
      <div class="text-center flex flex-col space-y-2">
        <span class="text-xs text-padel-gray uppercase tracking-wider font-bold">Billing Invoice</span>
        <h2 class="text-lg font-mono font-extrabold text-white">{{ bookingCode }}</h2>
        
        <!-- Badge Status -->
        <div class="mx-auto mt-2">
          <span v-if="paymentStatus === 'PENDING'" class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 animate-pulse">
            Waiting for Payment
          </span>
          <span v-else-if="paymentStatus === 'PAID'" class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-green-500/20 text-green-400 border border-green-500/40 flex items-center gap-1.5 w-fit mx-auto">
            ✔ PAID & RESERVED
          </span>
          <span v-else class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/40">
            EXPIRED
          </span>
        </div>
      </div>

      <!-- Detail Sesi Transaksi -->
      <div class="border-t border-b border-white/5 py-4 flex flex-col space-y-2 text-xs">
        <div class="flex justify-between">
          <span class="text-padel-gray">Lapangan:</span>
          <span class="font-bold text-white">{{ courtName }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-padel-gray">Tipe Sesi:</span>
          <span class="font-bold text-padel-gold">{{ memberName }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-padel-gray">Tanggal & Waktu:</span>
          <span class="font-bold text-white">{{ bookingDate }} | {{ bookingTime }}</span>
        </div>
        <div class="flex justify-between pt-2 border-t border-white/5 text-sm">
          <span class="text-padel-gray font-semibold">Total Tagihan:</span>
          <span class="font-black text-padel-teal">Rp {{ totalAmount.toLocaleString('id-ID') }}</span>
        </div>
      </div>

      <!-- Kode QRIS & Timer (Hanya jika PENDING) -->
      <div v-if="paymentStatus === 'PENDING'" class="flex flex-col items-center space-y-5">
        <!-- Countdown Timer -->
        <div class="flex flex-col items-center">
          <span class="text-[10px] text-padel-gray uppercase tracking-widest font-bold">Batas Waktu Pembayaran</span>
          <span class="text-3xl font-black text-padel-red font-mono tracking-wider mt-1">{{ minutes }}:{{ seconds }}</span>
        </div>

        <!-- Render Box QRIS Mockup -->
        <div class="p-3 bg-white rounded-2xl shadow-lg border-2 border-padel-teal/30 relative group transition-transform duration-300 hover:scale-[1.01]">
          <!-- Visual Code QR QRIS mock -->
          <div class="w-48 h-48 bg-gray-100 flex items-center justify-center rounded-lg overflow-hidden border border-gray-200">
            <!-- Representasi visual QR Code Padel48 QRIS -->
            <div class="relative w-44 h-44 bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=00020101021226380010ID.CO.QRIS.WWW')] bg-cover bg-center"></div>
          </div>
          <!-- Logo Brand QRIS Badge -->
          <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2 py-0.5 rounded border border-gray-300 text-[10px] font-black text-padel-red tracking-wider shadow">
            QRIS
          </div>
        </div>

        <p class="text-[10px] text-padel-gray text-center max-w-xs leading-relaxed">
          Pindai QRIS di atas menggunakan E-Wallet (GoPay, OVO, Dana) atau Mobile Banking Anda. Status pembayaran akan terverifikasi secara otomatis.
        </p>

        <!-- Simulasi Webhook Bayar Sukses -->
        <button @click="simulatePaymentSuccess" class="w-full py-2.5 rounded-xl border border-padel-teal/40 hover:border-padel-teal bg-padel-teal/5 text-padel-teal text-xs font-bold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
          ⚡ Simulasi Bayar Sukses (Simulate Webhook)
        </button>
      </div>

      <!-- Tiket Sukses (Hanya jika PAID) -->
      <div v-else-if="paymentStatus === 'PAID'" class="flex flex-col items-center space-y-4 py-4 text-center">
        <div class="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center text-3xl">
          🎉
        </div>
        <h3 class="text-lg font-bold text-white">Booking Berhasil Dikonfirmasi!</h3>
        <p class="text-xs text-padel-gray leading-relaxed max-w-xs">
          Tiket masuk digital dan struk pembayaran telah dikirim ke alamat email serta nomor WhatsApp Anda. Silakan tunjukkan tiket ini kepada petugas lapangan saat kehadiran.
        </p>
        <RouterLink to="/" class="mt-4 px-6 py-2.5 rounded-xl bg-padel-teal text-padel-dark text-xs font-bold transition-all duration-300 hover:scale-[1.03]">
          Kembali ke Beranda
        </RouterLink>
      </div>

      <!-- Expired Screen (Jika EXPIRED) -->
      <div v-else class="flex flex-col items-center space-y-4 py-4 text-center">
        <div class="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-3xl">
          ⌛
        </div>
        <h3 class="text-lg font-bold text-white">Invoice Telah Kedaluwarsa</h3>
        <p class="text-xs text-padel-gray leading-relaxed max-w-xs">
          Batas waktu pembayaran 15 menit telah habis. Slot jadwal lapangan ini otomatis dibebaskan kembali untuk dipesan pengguna lain.
        </p>
        <RouterLink to="/booking" class="mt-4 px-6 py-2.5 rounded-xl bg-padel-red text-white text-xs font-bold transition-all duration-300 hover:scale-[1.03]">
          Coba Booking Ulang
        </RouterLink>
      </div>
    </div>
  </div>
</template>
