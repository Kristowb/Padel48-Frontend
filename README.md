# Product Requirement Document (PRD) - Padel48 🎾✨

Dokumen ini mendefinisikan persyaratan produk, spesifikasi teknis, arsitektur database, dan alur integrasi sistem untuk **Padel48**, sebuah platform digital inovatif untuk pemesanan (*booking*) lapangan padel premium dengan nilai keunikan utama: kesempatan bermain bersama member **JKT48**.

---

## 📖 1. Latar Belakang & Visi Produk

Olahraga padel mengalami peningkatan popularitas yang pesat di Indonesia. Di sisi lain, ekosistem penggemar JKT48 memiliki loyalitas dan tingkat keterlibatan (*engagement*) yang sangat tinggi. **Padel48** hadir sebagai jembatan yang menggabungkan gaya hidup sehat melalui olahraga padel dengan pengalaman interaksi eksklusif bersama member JKT48 secara sportif dan menyenangkan.

### Visi Utama
Menjadi platform pemesanan padel hub nomor satu yang tidak hanya menyediakan fasilitas olahraga berkualitas tinggi tetapi juga menyajikan pengalaman hiburan (*sportainment*) eksklusif yang aman, terorganisir, dan berkesan bagi para fans JKT48 dan pecinta olahraga.

---

## 🛠️ 2. Arsitektur & Teknologi

Sistem dibangun menggunakan pendekatan modern yang memisahkan antara presentasi (Frontend 3D-Interactive) dan logika bisnis serta data (Backend & Database).

```mermaid
graph TD
    Client[Browser / Frontend Vue 3 + Three.js] <-->|HTTPS API / Webhook| Gateway[Backend Spring Boot Java 21]
    Gateway <-->|JPA / JDBC| DB[(PostgreSQL Database)]
    Gateway <-->|REST API| PaymentGateway[Payment Gateway / QRIS Provider]
```

### Komponen Teknologi
*   **Frontend**: 
    *   **Vue 3 (Vite)**: Framework utama untuk reaktivitas UI dan struktur komponen SPA (*Single Page Application*).
    *   **Three.js & TresJS (Vue 3 Declarative Three.js)**: Untuk me-render visualisasi 3D interaktif pada Landing Page dan Menu Utama.
    *   **Tailwind CSS**: Framework CSS utama dengan arsitektur utility-first yang dikonfigurasi secara kustom dan mengikuti praktik terbaik (*best practices*).
    *   **Pinia**: State Management untuk menyimpan data sesi booking, detail pengguna, dan status autentikasi.
    *   **Axios**: HTTP Client untuk berkomunikasi dengan API backend.
*   **Backend**: Java 21 (Spring Boot 3.2+, Spring Security dengan JWT, Spring Data JPA, Lombok, Validation).
*   **Database**: PostgreSQL (Menjamin integritas data transaksi booking melalui ACID compliance).
*   **Payment Gateway**: Simulator QRIS (menggunakan API QRIS dinamis/Midtrans/Xendit untuk produksi).

---

## 🔄 3. Kebutuhan Fungsional & Alur Kerja

Platform ini dibagi menjadi dua subsistem utama: **Aplikasi Pengguna (Public Web App 3D)** dan **Dashboard Admin (Admin Hub)**.

### A. Alur Kerja Pengguna (User Flow)

#### 1. Landing Page (`LandingPage.vue` dengan Three.js Hero Canvas)
*   **Deskripsi**: Halaman utama yang diakses pertama kali oleh pengguna. Menyajikan visualisasi premium Padel48 berbasis grafis 3D interaktif yang langsung memukau pengguna saat pertama kali memuat halaman.
*   **Implementasi Visual 3D & UI**:
    *   **Hero Section 3D**: Menggunakan Three.js (diintegrasikan melalui `TresJS` di Vue 3) untuk merender model 3D Lapangan Padel mini yang interaktif secara real-time.
    *   **Interaktivitas Mouse**: Model 3D lapangan padel berputar secara halus (*orbit control*) atau merespons gerakan kursor pengguna (*parallax/mouse-follow effect*). Ketika pengguna mengarahkan kursor ke area tertentu pada lapangan 3D (seperti jaring, area servis, atau raket 3D), elemen tersebut akan menyala (*glowing effect* menggunakan *post-processing bloom*).
    *   **Overlay Glassmorphism**: Elemen teks judul utama ("Padel48 - Play Padel with JKT48 Members") dan tombol CTA *"Mulai Booking"* dilapisi dengan UI bergaya Glassmorphism yang melayang secara elegan di atas canvas 3D.
*   **Fitur Pendukung**:
    *   Informasi promo dan daftar kehadiran mingguan member JKT48 yang divisualisasikan dalam bentuk "kartu holografik 3D" (holographic cards) yang memantulkan cahaya secara dinamis menggunakan custom shader Three.js saat di-hover.
    *   Tombol navigasi cepat ke section booking.

#### 2. Eksplorasi & Detail Lapangan (`CourtDetail.vue` / 3D Court Selector)
*   **Deskripsi**: Menampilkan kartu-kartu lapangan (*court*) yang tersedia di Padel48 Hub dengan opsi peninjauan lapangan 3D.
*   **Fitur**:
    *   **3D Court Tour**: Pengguna dapat mengklik tombol "Lihat Lapangan 3D" untuk memicu popup canvas Three.js yang memuat model 3D lapangan spesifik (Indoor / Semi-Outdoor). Pengguna dapat memutar sudut pandang 360 derajat untuk meninjau fasilitas pencahayaan dan tata letak lapangan sebelum memesan.
    *   Detail informasi lapangan tradisional (harga per jam, ukuran, fasilitas penunjang) ditampilkan di sisi samping canvas dengan layout responsif Tailwind CSS.

#### 3. Pemilihan Sesi & Member (`Booking.vue`)
*   **Deskripsi**: Formulir interaktif premium dengan tata letak dua kolom (*split-column* untuk desktop) guna memilih lapangan, tanggal, tipe sesi, slot waktu bermain, dan pengisian data kontak pemesan secara aman.
*   **Fitur Visual & Alur Booking**:
    1.  **Step Progress Indicator**: Bar panduan di bagian atas yang melacak progres pemesanan secara visual (*1. Select Slot -> 2. Payment -> 3. Ticket*) dengan penomoran lingkaran ber-glow neon teal.
    2.  **Tipe Sesi Bermain**: Opsi pilihan sesi menggunakan tombol kartu bersinar:
        *   **Sesi Reguler**: Desain minimalis dengan aksen neon teal.
        *   **Sesi Mabar JKT48**: Aksen VIP ber-glow merah khas JKT48 disertai ikon bintang.
    3.  **Member Selection Grid (Khusus Sesi Mabar)**: Menampilkan pilihan member JKT48 (seperti Zee, Freya, Gracia, Christy) yang tersedia pada tanggal tersebut. Setiap kartu memiliki avatar bulat dengan pinggiran yang memancarkan efek *glow* merah saat di-hover dan lencana harga tambahan (misal: *+Rp 500.000*).
    4.  **Aset Gambar Lokal (Bebas Masalah CORS)**: Foto potret realistis member JKT48 disimpan secara lokal di folder `src/assets/` (`zee.png`, `freya.png`, `gracia.png`, `christy.png`) untuk menghindari pembatasan lintas-domain (*CORS/hotlinking block*).
    5.  **Weekly Calendar Selector**: Baris selector tanggal mingguan horizontal dengan border neon teal menyala untuk menandai tanggal aktif yang dipilih.
    6.  **Time Slot Grid**: Grid tombol 1 jam sesi bermain. Slot waktu yang sudah dipesan (*booked/unavailable*) dinonaktifkan (*disabled*) dan diisi dengan pola arsir garis diagonal (*diagonal stripe overlay*) agar mudah dibedakan.
    7.  **Floating Bottom Checkout Summary Bar**: Bilah ringkasan yang selalu melayang (*sticky*) di bagian bawah layar. Bilah ini menampilkan ringkasan lapangan, sesi, slot waktu yang dipilih, kalkulasi total harga secara real-time, dan tombol utama *Proceed to Payment* dengan micro-animation hover scale.

#### 4. Checkout & Pembayaran QRIS (`Invoice.vue`)
*   **Deskripsi**: Halaman checkout pesanan dan tampilan QRIS dinamis untuk pembayaran.
*   **Alur**:
    1.  Sistem mengirim data booking via `POST /api/v1/bookings` dan menerima respons berupa `booking_code` dan `qr_payload`.
    2.  Frontend menampilkan detail transaksi dengan countdown timer 15 menit menggunakan komponen radial progress bar CSS.
    3.  QRIS di-render secara dinamis di layar menggunakan pustaka barcode/QR generator sisi client atau langsung menampilkan gambar QRIS terenkripsi.
    4.  Sistem melakukan polling berkala (tiap 5 detik) ke `/api/v1/bookings/status/{booking_code}` untuk merespons status sukses (`PAID`) secara instan.

---

### B. Alur Kerja Admin (Admin Hub / Dashboard)

Admin Hub merupakan portal internal bagi tim operasional Padel48 untuk memantau pemesanan dan jadwal.

```mermaid
graph LR
    Admin[Admin] -->|Login| AdminDashboard[Dashboard Utama]
    AdminDashboard -->|Manage| CourtList[Kelola Lapangan]
    AdminDashboard -->|Schedule| MemberSchedule[Jadwal Kehadiran Member JKT48]
    AdminDashboard -->|Verify| BookingList[Daftar Booking & Status QRIS]
```

#### 1. Login Admin
*   Autentikasi aman berbasis Spring Security (JWT). Admin harus memasukkan username dan password terdaftar.

#### 2. Dashboard Monitoring
*   Ringkasan statistik penting:
    *   Total pendapatan hari ini/bulan ini.
    *   Persentase okupansi lapangan.
    *   Statistik sesi terpopuler (Regular vs Mabar Member).
    *   Tabel aktivitas booking terbaru.

#### 3. Manajemen Jadwal & Booking
*   Melihat kalender master dari seluruh lapangan untuk mendeteksi *double booking* atau jadwal bentrok.
*   Fitur pembatalan booking manual oleh admin (misalnya karena keadaan darurat / *force majeure* lapangan).
*   Melihat detail transaksi pembayaran dan log status QRIS dari database.

#### 4. Manajemen Slot Kehadiran Member JKT48
*   Admin dapat menginput jadwal ketersediaan member JKT48 (misal: Zee di Court 1 hari Sabtu jam 16.00 - 18.00). Jadwal inilah yang nantinya muncul sebagai opsi saat user melakukan booking tipe "Mabar".

---

## 🎨 4. Desain & Panduan Praktik Terbaik Tailwind CSS (Tailwind CSS Best Practice)

Untuk memastikan kode CSS terstruktur, efisien, dan memiliki performa tinggi, berikut panduan implementasi Tailwind CSS di proyek Padel48:

### A. Konfigurasi Tema Kustom (`tailwind.config.js`)
Gunakan palet warna terkurasi yang memadukan estetika futuristik bertema JKT48 (merah energetik, hitam/abu gelap premium, dan aksen emas):

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        padel: {
          dark: '#0B0C10',       // Background utama aplikasi
          card: '#1F2833',       // Background kartu/container
          gray: '#C5C6C7',       // Teks sekunder
          teal: '#66FCF1',       // Aksen interaktif utama (Neon Teal)
          red: '#ED1C24',        // Warna identitas JKT48 (Sporty Red)
          gold: '#FFD700',       // Aksen VIP / Mabar Member JKT48
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'], // Tipografi premium modern
      },
      backdropBlur: {
        xs: '2px',
      }
    }
  }
}
```

### B. Aturan Implementasi CSS
1.  **Mobile First Design**: Selalu buat tata letak responsif menggunakan prefix media query Tailwind secara bertahap (contoh: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`).
2.  **Efek Glassmorphism**: Untuk kontainer di atas canvas Three.js, gunakan kombinasi kelas:
    `bg-opacity-30 bg-clip-padding backdrop-filter backdrop-blur-md border border-white/10`
3.  **Animasi Mikro (Micro-Animations)**: Tambahkan transisi halus pada setiap elemen interaktif:
    `transition-all duration-300 ease-in-out hover:scale-105 active:scale-95`
4.  **Menghindari Penumpukan Kelas (Utility Pollution)**: Untuk elemen UI yang digunakan berulang (seperti tombol utama), gunakan fitur komponen Vue atau satukan via utility directive jika diperlukan. Namun, sangat disarankan untuk mempertahankan penulisan kelas langsung pada elemen Vue guna memudahkan optimasi compiler Tailwind.

---

## 🗄️ 5. Skema Database (Database Schema)

Skema relasional PostgreSQL dirancang untuk mengamankan data booking secara transaksional dengan relasi tabel sebagai berikut:

### Tabel 1: `courts` (Data Lapangan)
Menyimpan informasi fisik lapangan padel yang tersedia.

| Nama Kolom | Tipe Data | Deskripsi |
| :--- | :--- | :--- |
| `id` (PK) | `UUID` / `BIGSERIAL` | Unique Identifier |
| `name` | `VARCHAR(100)` | Nama lapangan (contoh: "Court Center Court JKT") |
| `court_type` | `VARCHAR(20)` | `INDOOR` atau `SEMI_OUTDOOR` |
| `image_url` | `VARCHAR(255)` | Tautan gambar visual lapangan |
| `base_price` | `NUMERIC(12,2)` | Tarif dasar sewa per jam (regular) |
| `description`| `TEXT` | Detail deskripsi fasilitas lapangan |
| `created_at` | `TIMESTAMP` | Waktu data dibuat |

### Tabel 2: `jkt48_members` (Data Member JKT48)
Menyimpan informasi member JKT48 yang bersedia berpartisipasi dalam sesi bermain.

| Nama Kolom | Tipe Data | Deskripsi |
| :--- | :--- | :--- |
| `id` (PK) | `UUID` / `BIGSERIAL` | Unique Identifier |
| `name` | `VARCHAR(100)` | Nama lengkap member (contoh: "Zee JKT48") |
| `image_url` | `VARCHAR(255)` | Foto profil member |
| `status` | `VARCHAR(20)` | Status aktif member (`ACTIVE`, `INACTIVE`) |
| `created_at` | `TIMESTAMP` | Waktu data dibuat |

### Tabel 3: `member_schedules` (Jadwal Ketersediaan Member)
Mengatur tanggal dan slot jam berapa saja seorang member JKT48 ditugaskan/tersedia untuk bermain.

| Nama Kolom | Tipe Data | Deskripsi |
| :--- | :--- | :--- |
| `id` (PK) | `UUID` / `BIGSERIAL` | Unique Identifier |
| `member_id` (FK)| `UUID` / `BIGSERIAL` | Menunjuk ke tabel `jkt48_members` |
| `court_id` (FK) | `UUID` / `BIGSERIAL` | Lapangan tempat member bermain |
| `date` | `DATE` | Tanggal kehadiran |
| `start_time` | `TIME` | Waktu mulai sesi (misal: 16:00:00) |
| `end_time` | `TIME` | Waktu selesai sesi (misal: 18:00:00) |
| `mabar_price`| `NUMERIC(12,2)` | Tarif tambahan bermain bersama member |
| `is_booked` | `BOOLEAN` | Menyatakan apakah slot member ini sudah dibooking |

### Tabel 4: `bookings` (Data Pemesanan)
Menyimpan status utama dan detail transaksi pemesanan lapangan oleh pengguna.

| Nama Kolom | Tipe Data | Deskripsi |
| :--- | :--- | :--- |
| `id` (PK) | `UUID` / `BIGSERIAL` | Unique Identifier |
| `booking_code`| `VARCHAR(50)` (Unique)| Kode booking unik untuk invoice (contoh: `PADEL-20260528-XXXX`) |
| `court_id` (FK) | `UUID` / `BIGSERIAL` | Menunjuk ke tabel `courts` |
| `member_id` (FK)| `UUID` / `BIGSERIAL` (Nullable)| Menunjuk ke tabel `jkt48_members` (kosong jika regular) |
| `user_name` | `VARCHAR(100)` | Nama pemesan |
| `user_email` | `VARCHAR(100)` | Email pemesan |
| `user_phone` | `VARCHAR(20)` | Nomor WhatsApp pemesan |
| `booking_date`| `DATE` | Tanggal sesi yang dipesan |
| `start_time` | `TIME` | Jam mulai sewa |
| `end_time` | `TIME` | Jam selesai sewa |
| `total_amount`| `NUMERIC(12,2)` | Total nominal biaya yang harus dibayar |
| `payment_status`| `VARCHAR(20)` | `PENDING`, `PAID`, `EXPIRED`, `CANCELLED` |
| `created_at` | `TIMESTAMP` | Waktu booking dibuat |
| `expired_at` | `TIMESTAMP` | Batas waktu pembayaran (created\_at + 15 menit) |

### Tabel 5: `payments` (Detail Pembayaran & Log QRIS)
Menyimpan metadata pembayaran QRIS yang terkait dengan booking.

| Nama Kolom | Tipe Data | Deskripsi |
| :--- | :--- | :--- |
| `id` (PK) | `UUID` / `BIGSERIAL` | Unique Identifier |
| `booking_id` (FK)| `UUID` / `BIGSERIAL` | Menunjuk ke tabel `bookings` |
| `transaction_id`| `VARCHAR(100)` | ID Transaksi dari Payment Gateway |
| `qr_payload` | `TEXT` | Raw data/string QRIS (untuk me-render QR Code di client) |
| `paid_at` | `TIMESTAMP` (Nullable)| Waktu sukses pembayaran diterima |
| `created_at` | `TIMESTAMP` | Waktu log pembayaran dibuat |

---

## 📲 6. Alur Integrasi Pembayaran QRIS

Sistem menggunakan QRIS Dinamis (*Dynamic QRIS*) untuk mencocokkan nominal transaksi secara presisi secara otomatis.

### Diagram Alur Transaksi QRIS:

```mermaid
sequenceDiagram
    autonumber
    actor User as Pengguna (Frontend)
    participant API as Backend (Spring Boot)
    participant PG as Payment Gateway / QRIS Provider
    participant Bank as Aplikasi E-Wallet / Mobile Banking

    User->>API: POST /api/v1/bookings (Pilih Lapangan + Tanggal + Slot + Member)
    Note over API: Validasi slot & hitung total biaya (Base + Mabar)
    API->>PG: Generate QRIS (Nominal, Expiry, Booking Code)
    PG-->>API: Response QRIS Payload (raw string/URL QR)
    API->>API: Simpan data booking & log pembayaran (Status PENDING)
    API-->>User: Kirim detail booking + String Payload QRIS
    Note over User: User melihat layar Invoice & QR Code (timer 15 menit)
    
    rect rgb(240, 248, 255)
        Note over User, Bank: Pembayaran oleh User
        User->>Bank: Scan QRIS menggunakan E-Wallet & bayar
        Bank->>PG: Transaksi sukses diproses
    end

    PG->>API: Kirim Webhook Notifikasi HTTP POST (Status PAID)
    Note over API: Verifikasi tanda tangan webhook & update booking status ke PAID
    
    par Polling Fallback
        User->>API: GET /api/v1/bookings/status/{code} (Polling berkala)
        API-->>User: Status PAID / SUCCESS
    end
    
    User->>User: Menampilkan tiket sukses / QR Masuk Lapangan
```

---

## 🔌 7. Spesifikasi API (API Contract)

### A. Endpoint Publik (Akses User)

#### 1. Get List Lapangan
*   **Method / URL**: `GET /api/v1/courts`
*   **Response (200 OK)**:
    ```json
    [
      {
        "id": "c61b2e56-11b3-4f9e-a89e-9d2208d51123",
        "name": "Padel Court 1 (Main Arena)",
        "court_type": "INDOOR",
        "image_url": "https://padel48.com/images/court-1.jpg",
        "base_price": 250000.00,
        "description": "Premium court with professional turf and lighting."
      }
    ]
    ```

#### 2. Get Available Slots (Tanggal Terpilih)
*   **Method / URL**: `GET /api/v1/courts/{court_id}/slots?date=2026-05-28`
*   **Response (200 OK)**:
    ```json
    {
      "date": "2026-05-28",
      "court_id": "c61b2e56-11b3-4f9e-a89e-9d2208d51123",
      "slots": [
        {
          "start_time": "16:00:00",
          "end_time": "17:00:00",
          "is_available": true,
          "price": 250000.00,
          "member_available": {
            "id": "e81c1c1c-99a2-4a8e-b88e-1d2208f51199",
            "name": "Zee JKT48",
            "mabar_extra_price": 500000.00
          }
        },
        {
          "start_time": "17:00:00",
          "end_time": "18:00:00",
          "is_available": false,
          "price": 250000.00,
          "member_available": null
        }
      ]
    }
    ```

#### 3. Create Booking (Buat Pesanan)
*   **Method / URL**: `POST /api/v1/bookings`
*   **Request Body**:
    ```json
    {
      "court_id": "c61b2e56-11b3-4f9e-a89e-9d2208d51123",
      "member_id": "e81c1c1c-99a2-4a8e-b88e-1d2208f51199", // null jika regular
      "booking_date": "2026-05-28",
      "start_time": "16:00:00",
      "end_time": "17:00:00",
      "user_name": "Wota Sejati",
      "user_email": "wota.sejati@gmail.com",
      "user_phone": "081234567890"
    }
    ```
*   **Response (201 Created)**:
    ```json
    {
      "booking_code": "PADEL-20260528-77192",
      "total_amount": 750000.00,
      "payment_status": "PENDING",
      "qr_payload": "00020101021226380010ID.CO.QRIS.WWW0215ID1020304050607110303UMI51440014ID.CO.QRIS.WWW52045999530336054067500005802ID5915PADEL48 JAKARTA6007JAKARTA61051211062070703A016304ABCD",
      "expired_at": "2026-05-28T23:28:02Z"
    }
    ```

#### 4. Check Booking Status
*   **Method / URL**: `GET /api/v1/bookings/status/{booking_code}`
*   **Response (200 OK)**:
    ```json
    {
      "booking_code": "PADEL-20260528-77192",
      "payment_status": "PAID",
      "paid_at": "2026-05-28T23:18:45Z"
    }
    ```

---

### B. Endpoint Admin (Akses Terproteksi Admin Hub)

#### 1. Get All Bookings
*   **Method / URL**: `GET /api/v1/admin/bookings?page=0&size=10`
*   **Headers**: `Authorization: Bearer <JWT_TOKEN>`
*   **Response (200 OK)**:
    ```json
    {
      "content": [
        {
          "booking_code": "PADEL-20260528-77192",
          "user_name": "Wota Sejati",
          "court_name": "Padel Court 1",
          "member_name": "Zee JKT48",
          "booking_date": "2026-05-28",
          "start_time": "16:00:00",
          "end_time": "17:00:00",
          "total_amount": 750000.00,
          "payment_status": "PAID"
        }
      ],
      "total_elements": 1,
      "total_pages": 1
    }
    ```

#### 2. Manage Member Schedules (Input Jadwal Member)
*   **Method / URL**: `POST /api/v1/admin/schedules/member`
*   **Headers**: `Authorization: Bearer <JWT_TOKEN>`
*   **Request Body**:
    ```json
    {
      "member_id": "e81c1c1c-99a2-4a8e-b88e-1d2208f51199",
      "court_id": "c61b2e56-11b3-4f9e-a89e-9d2208d51123",
      "date": "2026-05-29",
      "start_time": "18:00:00",
      "end_time": "19:00:00",
      "mabar_price": 500000.00
    }
    ```
*   **Response (200 OK)**:
    ```json
    {
      "status": "SUCCESS",
      "message": "Jadwal member Zee JKT48 berhasil dibuat."
    }
    ```

---

## 🛠️ 8. Langkah Pengembangan (Local Development Setup)

### Prasyarat
*   **Node.js** (Versi minimal v18.x) & npm/yarn
*   **Java Development Kit (JDK)** 21 (misalnya Eclipse Temurin / Azul Zulu)
*   **Maven** 3.8+ (atau wrapper `mvnw` bawaan Spring Boot)
*   **PostgreSQL** (Port default 5432)

---

### A. Pengaturan Frontend (Vue 3 / Vite + Three.js)

1.  Masuk ke direktori frontend:
    ```bash
    cd d:/Code/AI/Padel48/Frontend
    ```
2.  Install dependensi proyek:
    ```bash
    npm install
    ```
3.  Pasang pustaka pendukung Three.js & TresJS:
    ```bash
    npm install three @tresjs/core @tresjs/caniuse
    npm install --save-dev @types/three
    ```
4.  Konfigurasi Environment Variable:
    Buat file `.env` di root direktori frontend:
    ```env
    VITE_API_BASE_URL=http://localhost:8080/api/v1
    ```
5.  Jalankan server pengembangan lokal:
    ```bash
    npm run dev
    ```
    Buka `http://localhost:5173` di browser Anda.

---

### B. Pengaturan Backend (Spring Boot Java 21)

1.  Masuk ke direktori backend (bila ada, jika belum silakan buat project Spring Boot 3 di level yang setara).
2.  Konfigurasi database di `src/main/resources/application.yml` atau `application.properties`:
    ```yaml
    spring:
      datasource:
        url: jdbc:postgresql://localhost:5432/padel48
        username: postgres
        password: yourpassword
      jpa:
        hibernate:
          ddl-auto: update
        show-sql: true
        properties:
          hibernate:
            dialect: org.hibernate.dialect.PostgreSQLDialect
    ```
3.  Jalankan aplikasi backend:
    ```bash
    ./mvnw spring-boot:run
    ```
    Server backend akan berjalan di port `8080`.