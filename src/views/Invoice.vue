<script setup>
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import zeeImg from '../assets/zee.png'
import freyaImg from '../assets/freya.png'
import graciaImg from '../assets/gracia.png'
import christyImg from '../assets/christy.png'
import bgSpotlightImg from '../assets/bg_spotlight.png'

const route = useRoute()

// Map member images
const memberImageMap = {
  'Zee JKT48': zeeImg,
  'Freya JKT48': freyaImg,
  'Gracia JKT48': graciaImg,
  'Christy JKT48': christyImg
}

// Map member signature quotes
const memberQuotes = {
  'Zee JKT48': 'Sampai jumpa di lapangan padel! Aku tunggu smash terbaikmu! 🎾🔥',
  'Freya JKT48': 'Persiapkan staminamu ya! Kita seru-seruan bareng di lapangan! 💖🌟',
  'Gracia JKT48': 'Udah siap mabar padel denganku? Sampai ketemu di arena! 🥰🎾',
  'Christy JKT48': 'Semangat! Ayo mabar padel dan cetak poin bareng aku! 🏆✨'
}

// Detail booking dari query params / router state
const bookingCode = computed(() => route.params.bookingCode || 'PADEL-20260528-77192')
const courtName = computed(() => route.query.court || 'Court 1 (Indoor Arena)')
const memberName = computed(() => route.query.member || 'Regular')
const bookingDate = computed(() => route.query.date || '2026-05-28')
const bookingTime = computed(() => route.query.time || '16:00 - 17:30')
const totalAmount = computed(() => Number(route.query.amount || 375000))

// Status Pembayaran: PENDING, PAID, EXPIRED
const paymentStatus = ref('PENDING')
const qrPayload = "00020101021226380010ID.CO.QRIS.WWW0215ID1020304050607110303UMI51440014ID.CO.QRIS.WWW52045999530336054067500005802ID5915PADEL48 JAKARTA6007JAKARTA61051211062070703A016304ABCD"

// Countdown Timer 15 Menit (900 detik) untuk pending payment
const timeLeft = ref(900)
let timerInterval = null

const minutes = computed(() => Math.floor(timeLeft.value / 60).toString().padStart(2, '0'))
const seconds = computed(() => (timeLeft.value % 60).toString().padStart(2, '0'))

// Live countdown untuk hari-H (tiket digital)
const ticketTimeLeft = ref('02 Hari : 14 Jam : 30 Menit : 45 Detik')
let ticketCountdownInterval = null

// State UI
const toastMessage = ref('')
const isRedirecting = ref(false)
const redirectingTo = ref('')
const activeTab = ref('ticket') // 'ticket' atau 'poster'
const posterGenerating = ref(false)
const posterUrl = ref('')

// Interactive ticket holograph variables
const ticketTiltX = ref(0)
const ticketTiltY = ref(0)
const ticketShineX = ref(50)
const ticketShineY = ref(50)

// Polling status message (Pending Transition)
const pollingMessage = ref('Menghubungkan ke server e-wallet...')
const pollingStep = ref(0)

const updatePollingMessage = () => {
  const messages = [
    'Menghubungkan ke server e-wallet...',
    'Menunggu sinyal pembayaran dari e-wallet Anda...',
    'Hampir selesai! Memverifikasi tanda tangan transaksi...',
    'Sinyal pembayaran terdeteksi, menyelesaikan proses...'
  ]
  pollingStep.value = (pollingStep.value + 1) % messages.length
  pollingMessage.value = messages[pollingStep.value]
}

let pollingInterval = null

onMounted(() => {
  // 15 Minutes invoice countdown
  timerInterval = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      paymentStatus.value = 'EXPIRED'
      clearInterval(timerInterval)
      if (pollingInterval) clearInterval(pollingInterval)
    }
  }, 1000)

  // Polling message transition
  pollingInterval = setInterval(updatePollingMessage, 4000)

  // Ticket live countdown timer
  let countdownSecs = 225045 // Simulated seconds left
  ticketCountdownInterval = setInterval(() => {
    countdownSecs--
    if (countdownSecs <= 0) {
      ticketTimeLeft.value = 'Sesi Bermain Dimulai!'
      clearInterval(ticketCountdownInterval)
      return
    }
    const days = Math.floor(countdownSecs / 86400)
    const hours = Math.floor((countdownSecs % 86400) / 3600)
    const mins = Math.floor((countdownSecs % 3600) / 60)
    const secs = countdownSecs % 60
    ticketTimeLeft.value = `${days.toString().padStart(2, '0')} Hari : ${hours.toString().padStart(2, '0')} Jam : ${mins.toString().padStart(2, '0')} Menit : ${secs.toString().padStart(2, '0')} Detik`
  }, 1000)
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
  if (pollingInterval) clearInterval(pollingInterval)
  if (ticketCountdownInterval) clearInterval(ticketCountdownInterval)
})

// Toast notification helper
const showToast = (msg) => {
  toastMessage.value = msg
  setTimeout(() => {
    toastMessage.value = ''
  }, 3000)
}

// 1. Copy QRIS Payload
const copyPayload = () => {
  navigator.clipboard.writeText(qrPayload)
  showToast('📋 Payload QRIS berhasil disalin!')
}

// 2. Download QR Code Image
const downloadQRCode = () => {
  // Draw mock QRIS layout on HTML5 Canvas to trigger download
  const canvas = document.createElement('canvas')
  canvas.width = 400
  canvas.height = 480
  const ctx = canvas.getContext('2d')

  // Red QRIS Header
  ctx.fillStyle = '#A61C22'
  ctx.fillRect(0, 0, 400, 80)
  
  // Header text
  ctx.fillStyle = '#FFFFFF'
  ctx.font = 'bold 24px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('QRIS Padel48', 200, 48)

  // White Body
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(0, 80, 400, 400)

  // Draw simulated QR borders & text
  ctx.fillStyle = '#333333'
  ctx.font = '14px monospace'
  ctx.fillText(`NMID: ID1020304050607`, 200, 115)
  ctx.fillText(`Booking Code: ${bookingCode.value}`, 200, 135)
  ctx.fillText(`Total: Rp ${totalAmount.value.toLocaleString('id-ID')}`, 200, 155)

  // Draw a basic mock QR grid pattern in center
  ctx.fillStyle = '#000000'
  ctx.fillRect(100, 180, 200, 200)
  // Inside QR styling
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(115, 195, 170, 170)
  // QR details
  ctx.fillStyle = '#000000'
  ctx.fillRect(125, 205, 50, 50)
  ctx.fillRect(225, 205, 50, 50)
  ctx.fillRect(125, 305, 50, 50)
  // Fill random pattern
  for (let i = 0; i < 15; i++) {
    for (let j = 0; j < 15; j++) {
      if ((i+j) % 3 === 0 || (i*j) % 5 === 2) {
        ctx.fillRect(130 + i*10, 210 + j*10, 8, 8)
      }
    }
  }

  // QRIS Logo in center
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(180, 260, 40, 40)
  ctx.fillStyle = '#A61C22'
  ctx.font = 'bold 10px sans-serif'
  ctx.fillText('QRIS', 200, 285)

  // Download Trigger
  const link = document.createElement('a')
  link.download = `PADEL48-QRIS-${bookingCode.value}.png`
  link.href = canvas.toDataURL()
  link.click()
  showToast('📥 Gambar QRIS berhasil diunduh ke Galeri!')
}

// 3. Deep-Linking Redirect Simulation
const handleDeepLink = (walletName) => {
  isRedirecting.value = true
  redirectingTo.value = walletName
  setTimeout(() => {
    isRedirecting.value = false
    showToast(`📲 Pengalihan berhasil! Menyelesaikan via ${walletName}.`)
  }, 2000)
}

// 4. Webhook simulator (Simulate payment success)
const simulatePaymentSuccess = () => {
  paymentStatus.value = 'PAID'
  if (timerInterval) clearInterval(timerInterval)
  if (pollingInterval) clearInterval(pollingInterval)
  showToast('🎉 Pembayaran Berhasil Dikonfirmasi!')
  
  // Render Poster Canvas on success
  nextTick(() => {
    generatePoster()
  })
}

// 5. Generate 9:16 digital poster using client-side Canvas
const generatePoster = () => {
  posterGenerating.value = true
  
  const canvas = document.createElement('canvas')
  canvas.width = 1080
  canvas.height = 1920
  const ctx = canvas.getContext('2d')

  // Green-to-Dark Sporty Gradient
  const grad = ctx.createLinearGradient(0, 0, 0, 1920)
  grad.addColorStop(0, '#003B36') // Hijau botol gelap
  grad.addColorStop(0.5, '#002E2A')
  grad.addColorStop(1, '#001E1B')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 1080, 1920)

  // Draw overlay decorative grids
  ctx.strokeStyle = 'rgba(204, 255, 0, 0.08)' // Lime wire
  ctx.lineWidth = 2
  for (let i = 0; i < 1080; i += 120) {
    ctx.beginPath()
    ctx.moveTo(i, 0)
    ctx.lineTo(i, 1920)
    ctx.stroke()
  }
  for (let j = 0; j < 1920; j += 120) {
    ctx.beginPath()
    ctx.moveTo(0, j)
    ctx.lineTo(1080, j)
    ctx.stroke()
  }

  // Draw glowing title
  ctx.fillStyle = '#FFFFFF'
  ctx.font = 'black 64px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('PADEL48 MATCH TICKET', 540, 200)

  // Render Member Image (Zee, Freya, etc.)
  const imgUrl = memberImageMap[memberName.value]
  if (imgUrl) {
    const memberImg = new Image()
    memberImg.src = imgUrl
    memberImg.onload = () => {
      // Draw circular frame or rounded frame for member
      ctx.save()
      ctx.beginPath()
      ctx.arc(540, 650, 280, 0, Math.PI * 2)
      ctx.closePath()
      ctx.clip()
      
      // Draw member image inside clip
      ctx.drawImage(memberImg, 260, 370, 560, 560)
      ctx.restore()

      // Circular border neon
      ctx.strokeStyle = '#A61C22'
      ctx.lineWidth = 10
      ctx.beginPath()
      ctx.arc(540, 650, 280, 0, Math.PI * 2)
      ctx.stroke()
      
      // Draw quote and remaining details after image load
      drawPosterDetails(ctx, canvas)
    }
    memberImg.onerror = () => {
      // Fallback if image fails to load
      drawPosterDetails(ctx, canvas)
    }
  } else {
    // Regular ticket (no member image)
    drawPosterDetails(ctx, canvas)
  }
}

const drawPosterDetails = (ctx, canvas) => {
  // Neon Gold Badge
  if (memberName.value !== 'Regular') {
    ctx.fillStyle = '#E3FF37'
    ctx.font = 'bold 36px sans-serif'
    ctx.fillText('⭐ EXCLUSIVE MABAR JKT48 ⭐', 540, 1020)
  } else {
    ctx.fillStyle = '#CCFF00'
    ctx.font = 'bold 36px sans-serif'
    ctx.fillText('🎾 REGULAR COURT BOOKING 🎾', 540, 1020)
  }

  // Draw glass box detail card
  ctx.fillStyle = 'rgba(0, 77, 70, 0.7)'
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.roundRect(140, 1100, 800, 520, 30)
  ctx.fill()
  ctx.stroke()

  // Booking Details
  ctx.fillStyle = '#FFFFFF'
  ctx.textAlign = 'left'
  ctx.font = 'bold 36px sans-serif'

  ctx.fillText('KODE PEMESANAN', 200, 1180)
  ctx.fillStyle = '#CCFF00'
  ctx.font = 'bold 44px monospace'
  ctx.fillText(bookingCode.value, 200, 1235)

  ctx.fillStyle = '#C5D0CD'
  ctx.font = 'bold 32px sans-serif'
  ctx.fillText('LAPANGAN:', 200, 1320)
  ctx.fillText('JADWAL bermain:', 200, 1400)
  ctx.fillText('TEMAN MABAR:', 200, 1480)

  ctx.fillStyle = '#FFFFFF'
  ctx.font = 'bold 32px sans-serif'
  ctx.fillText(courtName.value, 460, 1320)
  ctx.fillText(`${bookingDate.value} | ${bookingTime.value}`, 460, 1400)
  ctx.fillStyle = memberName.value !== 'Regular' ? '#CCFF00' : '#FFFFFF'
  ctx.fillText(memberName.value, 460, 1480)

  // Signature quote from member
  if (memberName.value !== 'Regular') {
    ctx.fillStyle = '#CCFF00'
    ctx.font = 'italic bold 28px sans-serif'
    ctx.textAlign = 'center'
    const quote = memberQuotes[memberName.value] || 'Terima kasih atas pesananmu!'
    ctx.fillText(`"${quote}"`, 540, 1570)
  }

  // Footer branding
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
  ctx.font = 'semibold 24px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('Generated by Padel48 Premium Hub', 540, 1720)

  // Set the image url state
  posterUrl.value = canvas.toDataURL()
  posterGenerating.value = false
}

// 6. Download digital poster
const downloadPosterImage = () => {
  if (!posterUrl.value) return
  const link = document.createElement('a')
  link.download = `PADEL48-POSTER-${bookingCode.value}.png`
  link.href = posterUrl.value
  link.click()
  showToast('📥 Poster Digital 9:16 berhasil diunduh!')
}

// Hologram Gyroscope/Tilt Effect simulation on mousemove
const handleTicketMouseMove = (e) => {
  const card = e.currentTarget
  const rect = card.getBoundingClientRect()
  const x = e.clientX - rect.left //x position within the element.
  const y = e.clientY - rect.top  //y position within the element.

  // Normalize between -10 and 10 degrees rotation
  const tiltX = -((y / rect.height) - 0.5) * 20
  const tiltY = ((x / rect.width) - 0.5) * 20

  ticketTiltX.value = tiltX
  ticketTiltY.value = tiltY

  // Shine position percentage
  ticketShineX.value = (x / rect.width) * 100
  ticketShineY.value = (y / rect.height) * 100
}

const resetTicketTilt = () => {
  ticketTiltX.value = 0
  ticketTiltY.value = 0
  ticketShineX.value = 50
  ticketShineY.value = 50
}
</script>

<template>
  <div class="relative min-h-screen bg-padel-dark text-white p-4 sm:p-6 lg:p-8 flex items-center justify-center overflow-hidden">
    <!-- Background Image with Overlay -->
    <div class="absolute inset-0 z-0 pointer-events-none">
      <img :src="bgSpotlightImg" alt="Invoice Background" class="w-full h-full object-cover opacity-55 brightness-[0.4] contrast-[1.1]" />
      <div class="absolute inset-0 bg-gradient-to-b from-black/85 via-black/35 to-black/90"></div>
    </div>

    <!-- Toast Notification -->
    <transition name="fade">
      <div v-if="toastMessage" class="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-padel-teal text-padel-dark px-6 py-3.5 rounded-xl shadow-2xl font-bold flex items-center gap-2 border border-white/20">
        <span>📢</span>
        <span class="text-xs">{{ toastMessage }}</span>
      </div>
    </transition>

    <!-- Deep link redirect overlay spinner -->
    <div v-if="isRedirecting" class="fixed inset-0 z-50 flex flex-col justify-center items-center bg-black/70 backdrop-blur-xl">
      <div class="w-16 h-16 border-4 border-padel-teal border-t-transparent rounded-full animate-spin"></div>
      <p class="mt-4 text-sm font-bold text-padel-teal animate-pulse">Membuka aplikasi {{ redirectingTo }}...</p>
    </div>

    <!-- MAIN PANEL -->
    <div :class="[
      'max-w-xl w-full solid-panel rounded-3xl p-6 sm:p-8 flex flex-col space-y-6 relative z-10 shadow-2xl transition-all duration-500',
      memberName !== 'Regular' ? 'border-padel-red/40 shadow-padel-red/5' : 'border-padel-teal/40 shadow-padel-teal/5'
    ]">
      
      <!-- HEADER INVOICE -->
      <div class="text-center flex flex-col space-y-2">
        <span class="text-xs text-padel-gray uppercase tracking-wider font-bold">Billing Invoice</span>
        <h2 class="text-lg font-mono font-extrabold text-white tracking-widest">{{ bookingCode }}</h2>
        
        <!-- Status Badges -->
        <div class="mx-auto mt-1.5">
          <span v-if="paymentStatus === 'PENDING'" class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 animate-pulse">
            ⏱️ Waiting for Payment
          </span>
          <span v-else-if="paymentStatus === 'PAID'" class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-500/20 text-green-400 border border-green-500/40 flex items-center gap-1.5 w-fit mx-auto">
            ✔ PAID & RESERVED
          </span>
          <span v-else class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/40">
            ⌛ EXPIRED
          </span>
        </div>
      </div>

      <!-- Animasi Centang Sukses PAID (Jika Baru Saja Dibayar) -->
      <transition name="fade">
        <div v-if="paymentStatus === 'PAID'" class="flex flex-col items-center space-y-2 py-2 success-badge-pulse">
          <svg class="w-16 h-16" viewBox="0 0 52 52">
            <circle class="success-checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
            <path class="success-checkmark-check" fill="none" stroke="#CCFF00" stroke-width="4" stroke-linecap="round" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
          </svg>
          <h3 class="text-sm font-black text-white tracking-widest uppercase">Pembayaran Berhasil!</h3>
        </div>
      </transition>

      <!-- TRANSACTION SUMMARY -->
      <div class="border-t border-b border-white/5 py-4 flex flex-col space-y-2.5 text-xs bg-black/15 backdrop-blur-md px-4 rounded-xl">
        <div class="flex justify-between">
          <span class="text-padel-gray">Lapangan Padel:</span>
          <span class="font-bold text-white">{{ courtName }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-padel-gray">Tipe Sesi Bermain:</span>
          <span class="font-bold" :class="memberName !== 'Regular' ? 'text-padel-gold' : 'text-padel-teal'">
            {{ memberName !== 'Regular' ? `Mabar ${memberName}` : 'Sesi Reguler' }}
          </span>
        </div>
        <div class="flex justify-between">
          <span class="text-padel-gray">Tanggal & Jam Sesi:</span>
          <span class="font-bold text-white font-mono">{{ bookingDate }} | {{ bookingTime }}</span>
        </div>
        <div class="flex justify-between pt-2 border-t border-white/5 text-sm">
          <span class="text-padel-gray font-semibold">Total Tagihan:</span>
          <span class="font-black text-padel-teal">Rp {{ totalAmount.toLocaleString('id-ID') }}</span>
        </div>
      </div>

      <!-- STATE PENDING PAYMENT -->
      <div v-if="paymentStatus === 'PENDING'" class="flex flex-col items-center space-y-6">
        
        <!-- Timer Countdown Radial Progress -->
        <div class="flex flex-col items-center">
          <span class="text-[9px] text-padel-gray uppercase tracking-widest font-bold">Batas Waktu Pembayaran QRIS</span>
          <span class="text-3xl font-black text-padel-red font-mono tracking-widest mt-1">{{ minutes }}:{{ seconds }}</span>
        </div>

        <!-- QRIS Box with code generation -->
        <div class="p-3 bg-white rounded-2xl shadow-2xl border-2 border-padel-teal/30 relative group transition-transform duration-300 hover:scale-[1.01]">
          <!-- Render barcode / QR mock -->
          <div class="w-48 h-48 bg-gray-100 flex items-center justify-center rounded-lg overflow-hidden border border-gray-200">
            <div class="relative w-44 h-44 bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=00020101021226380010ID.CO.QRIS.WWW')] bg-cover bg-center"></div>
          </div>
          <!-- Logo Brand QRIS Badge -->
          <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2.5 py-0.5 rounded border border-gray-300 text-[10px] font-black text-padel-red tracking-wider shadow">
            QRIS
          </div>
        </div>

        <!-- Mobile-first One-Tap Actions -->
        <div class="w-full flex flex-col gap-2">
          <div class="grid grid-cols-2 gap-2">
            <button @click="downloadQRCode" 
                    class="py-2.5 rounded-xl border border-padel-teal bg-padel-teal/5 text-padel-teal text-xs font-bold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] hover:bg-padel-teal hover:text-padel-dark">
              📥 Unduh QR Code
            </button>
            <button @click="copyPayload" 
                    class="py-2.5 rounded-xl border border-white/20 bg-white/5 text-white text-xs font-bold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] hover:border-padel-teal hover:text-padel-teal">
              📋 Salin Payload QRIS
            </button>
          </div>

          <!-- Deep-links direct options -->
          <div class="flex flex-col space-y-2 pt-2 border-t border-white/5">
            <span class="text-[9px] text-padel-gray text-center font-bold uppercase tracking-wider">Bayar Cepat via E-Wallet (Mobile Deep-Link):</span>
            <div class="grid grid-cols-3 gap-2">
              <button @click="handleDeepLink('GoPay')" class="py-2 rounded-xl bg-blue-900/20 border border-blue-500/30 text-blue-400 text-[10px] font-extrabold hover:bg-blue-500 hover:text-white transition-all">GoPay</button>
              <button @click="handleDeepLink('Dana')" class="py-2 rounded-xl bg-sky-900/20 border border-sky-500/30 text-sky-400 text-[10px] font-extrabold hover:bg-sky-500 hover:text-white transition-all">Dana</button>
              <button @click="handleDeepLink('OVO')" class="py-2 rounded-xl bg-purple-900/20 border border-purple-500/30 text-purple-400 text-[10px] font-extrabold hover:bg-purple-500 hover:text-white transition-all">OVO</button>
            </div>
          </div>
        </div>

        <!-- Polling Transisi Verifikasi Penenang -->
        <div class="w-full bg-padel-card/20 backdrop-blur-md border border-white/5 rounded-2xl p-4 flex flex-col items-center space-y-3 relative overflow-hidden">
          <div class="text-[10px] font-semibold text-padel-teal animate-pulse tracking-wide">{{ pollingMessage }}</div>
          
          <!-- Animasi Bola Padel Memantul Melintasi Net -->
          <div class="w-48 h-8 relative border-b border-white/10 flex items-center">
            <!-- Net -->
            <div class="absolute left-1/2 bottom-0 w-0.5 h-4 bg-padel-teal/80"></div>
            <!-- Bola Padel -->
            <div class="w-3.5 h-3.5 rounded-full bg-padel-gold absolute animate-bounce-padel shadow-sm"></div>
          </div>
        </div>

        <!-- Simulasi Webhook Bayar Sukses -->
        <button @click="simulatePaymentSuccess" class="w-full py-2.5 rounded-xl border border-dashed border-padel-teal/55 hover:border-padel-teal bg-padel-teal/5 hover:bg-padel-teal/15 text-padel-teal text-xs font-bold transition-all duration-300 hover:scale-[1.02]">
          ⚡ Bayar Simulasi (Simulate Webhook)
        </button>
      </div>

      <!-- STATE PAID (Tiket Digital & Poster Digital 9:16) -->
      <div v-else-if="paymentStatus === 'PAID'" class="flex flex-col space-y-6 w-full">
        
        <!-- Toggle Menu Sukses (Ticket vs Poster) -->
        <div class="flex border-b border-white/10 pb-1 gap-4">
          <button @click="activeTab = 'ticket'" 
                  :class="activeTab === 'ticket' ? 'border-padel-teal text-padel-teal font-extrabold border-b-2' : 'text-padel-gray'" 
                  class="pb-2 text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer">
            🎫 Tiket Digital
          </button>
          <button @click="activeTab = 'poster'" 
                  :class="activeTab === 'poster' ? 'border-padel-red text-padel-red font-extrabold border-b-2' : 'text-padel-gray'" 
                  class="pb-2 text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer">
            📷 Poster JKT48 Story (9:16)
          </button>
        </div>

        <!-- Tab Content Wrapper with Horizontal Transition -->
        <div class="relative overflow-hidden w-full flex flex-col items-center">
          <transition name="slide-fade-horizontal" mode="out-in">
            
            <!-- 1. TAMPILAN TIKET DIGITAL (Hologram shine & Live countdown) -->
            <div v-if="activeTab === 'ticket'" key="ticket" class="flex flex-col items-center space-y-4 w-full">
              
              <!-- Countdown Ticket Hari H -->
              <div class="flex flex-col items-center">
                <span class="text-[9px] text-padel-gray uppercase tracking-widest font-bold">Hitung Mundur Sesi Bermain</span>
                <span class="text-sm font-black text-padel-teal font-mono tracking-wider mt-1">{{ ticketTimeLeft }}</span>
              </div>

              <!-- Glassmorphic Ticket Card with Holographic Mouse Move tilt & Foil Effect -->
              <div @mousemove="handleTicketMouseMove"
                   @mouseleave="resetTicketTilt"
                   :style="{
                     transform: `perspective(1000px) rotateX(${ticketTiltX}deg) rotateY(${ticketTiltY}deg)`,
                     backgroundImage: `radial-gradient(circle at ${ticketShineX}% ${ticketShineY}%, rgba(255, 255, 255, 0.18) 0%, transparent 60%)`
                   }"
                   class="w-full max-w-sm solid-ticket rounded-2xl p-6 relative flex flex-col justify-between space-y-6 shadow-2xl transition-transform duration-200 ease-out cursor-default select-none overflow-hidden hologram-effect">
                
                <!-- Rainbow Holographic Foil Overlay -->
                <div class="absolute inset-0 pointer-events-none mix-blend-overlay opacity-15 bg-gradient-to-tr from-[#ff00a0] via-[#00ffcc] to-[#ff00ff] hologram-effect"></div>

                <!-- Top Brand -->
                <div class="flex justify-between items-center relative z-10 border-b border-white/10 pb-3">
                  <span class="text-xs font-extrabold text-white tracking-widest uppercase">PADEL48 PREMIUM TICKET</span>
                  <span class="text-[9px] font-black text-padel-gold border border-padel-gold/40 bg-padel-gold/10 px-2 py-0.5 rounded uppercase">VIP PASS</span>
                </div>

                <!-- Ticket Info Grid -->
                <div class="grid grid-cols-2 gap-4 relative z-10 text-xs">
                  <div class="flex flex-col space-y-1">
                    <span class="text-[9px] text-padel-gray font-bold uppercase tracking-wider">Lapangan</span>
                    <span class="font-bold text-white">{{ courtName.split(' (')[0] }}</span>
                  </div>
                  <div class="flex flex-col space-y-1">
                    <span class="text-[9px] text-padel-gray font-bold uppercase tracking-wider">Teman Mabar</span>
                    <span class="font-bold text-padel-gold">{{ memberName }}</span>
                  </div>
                  <div class="flex flex-col space-y-1">
                    <span class="text-[9px] text-padel-gray font-bold uppercase tracking-wider">Tanggal</span>
                    <span class="font-bold text-white">{{ bookingDate }}</span>
                  </div>
                  <div class="flex flex-col space-y-1">
                    <span class="text-[9px] text-padel-gray font-bold uppercase tracking-wider">Sesi Waktu</span>
                    <span class="font-bold text-padel-teal font-mono">{{ bookingTime }}</span>
                  </div>
                </div>

                <!-- Bottom barcode check-in -->
                <div class="flex flex-col items-center space-y-2 relative z-10 pt-4 border-t border-white/10">
                  <!-- Render code QR mock check in -->
                  <div class="p-1 bg-white rounded-lg">
                    <div class="w-24 h-24 bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=CHECKIN-PADEL48-')] bg-cover"></div>
                  </div>
                  <span class="text-[8px] text-padel-gray font-mono">PINDAI DI COUNTER MASUK LAPANGAN</span>
                </div>
              </div>

              <!-- Simpan tiket digital -->
              <div class="flex gap-3 w-full">
                <button @click="showToast('💼 Tiket berhasil disimpan ke Apple Wallet!')" class="flex-1 py-2.5 rounded-xl bg-black/40 backdrop-blur-md hover:bg-white/10 border border-white/10 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer">
                   Simpan ke Apple Wallet
                </button>
                <button @click="showToast('💼 Tiket berhasil disimpan ke Google Wallet!')" class="flex-1 py-2.5 rounded-xl bg-black/40 backdrop-blur-md hover:bg-white/10 border border-white/10 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer">
                  🤖 Simpan ke Google Wallet
                </button>
              </div>

              <RouterLink to="/" class="mt-2 text-xs text-padel-teal hover:underline text-center">
                Kembali ke Beranda
              </RouterLink>
            </div>

            <!-- 2. TAMPILAN POSTER JKT48 (Instagram Story Ready 9:16) -->
            <div v-else-if="activeTab === 'poster'" key="poster" class="flex flex-col items-center space-y-4 w-full">
              
              <!-- Info share poster -->
              <p class="text-[10px] text-padel-gray text-center max-w-xs leading-relaxed">
                Poster digital dinamis Anda telah berhasil di-generate! Unduh poster beresolusi tinggi ini dan bagikan di Instagram Story Anda.
              </p>

              <!-- Poster Preview Box -->
              <div class="relative w-64 h-[455px] rounded-2xl overflow-hidden border border-white/10 bg-black/60 backdrop-blur-md shadow-2xl group flex justify-center items-center">
                <div v-if="posterGenerating" class="absolute inset-0 flex flex-col justify-center items-center bg-padel-dark/80 backdrop-blur-xl z-10">
                  <div class="w-8 h-8 border-2 border-padel-red border-t-transparent rounded-full animate-spin"></div>
                  <span class="mt-2 text-[10px] text-padel-red animate-pulse">Menggambar Poster...</span>
                </div>
                
                <img v-if="posterUrl" :src="posterUrl" alt="Poster Padel48 JKT48" class="w-full h-full object-contain" />
              </div>

              <!-- Unduh poster button -->
              <button @click="downloadPosterImage" :disabled="!posterUrl"
                      class="w-full py-3 rounded-xl bg-padel-red hover:bg-padel-red/90 text-white font-black text-xs transition-transform duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer">
                📷 Unduh Poster Instagram Story (9:16 PNG)
              </button>

              <RouterLink to="/" class="mt-2 text-xs text-padel-teal hover:underline text-center">
                Kembali ke Beranda
              </RouterLink>
            </div>

          </transition>
        </div>

      </div>

      <!-- STATE EXPIRED -->
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

<style scoped>
.solid-panel {
  background-color: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.solid-ticket {
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.6);
}

/* Animasi bola memantul melintasi net */
@keyframes bouncePadel {
  0% { left: 5%; bottom: 0px; }
  25% { bottom: 20px; }
  50% { left: 90%; bottom: 0px; }
  75% { bottom: 20px; }
  100% { left: 5%; bottom: 0px; }
}

.animate-bounce-padel {
  animation: bouncePadel 3.5s infinite linear;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px);
}
</style>
