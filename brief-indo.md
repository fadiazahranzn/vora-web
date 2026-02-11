# Prompt yang Ditingkatkan: Aplikasi Web Vora – Spesifikasi Pengembangan Lengkap

## Gambaran Proyek

Kembangkan **Vora**, sebuah aplikasi web pelacakan kebiasaan dan manajemen tugas yang komprehensif, dilengkapi fitur inovatif **Smart Daily Check-in** yang memantau dan merespons kondisi emosional pengguna sepanjang perjalanan produktivitas mereka.

---

## 1. Arsitektur Aplikasi & Struktur Navigasi

### Sistem Navigasi Utama

Implementasikan **bottom navigation bar** dengan tiga menu utama:

#### **Menu 1: Home (Dashboard Habit)**

* Antarmuka pelacakan kebiasaan harian
* Tampilan kalender interaktif
* Sistem manajemen kategori kebiasaan dengan side bar
* Checkbox penyelesaian kebiasaan dengan akses cepat
* Terdapat to do list 

#### **Menu 2: Tasks (Manajemen Tugas)**

* Tampilan kalender interaktif
* Antarmuka pembuatan dan pengeditan tugas
* Pengelompokan tugas berdasarkan prioritas
* Sistem pengelolaan tenggat waktu
* Dukungan hierarki sub-tugas

#### **Menu 3: Analytics (Visualisasi Progres)**

* Dashboard statistik
* Visualisasi data interaktif
* Metrik performa dan tren
* Pelacakan progres historis

---

## 2. Spesifikasi Fitur Utama

### A. Sistem Manajemen Habit (Menu 1)

#### Kategori Habit

Implementasikan kategori bawaan berikut dengan contoh kebiasaan:

| Kategori              | Contoh Habit                                                    |
| --------------------- | --------------------------------------------------------------- |
| **Pengembangan Diri** | Membaca buku, Belajar skill baru, Review target bulanan, Rencana untuk Besok         |
| **Olahraga**          | Gym, Renang, Lari, Bersepeda, Padel                             |
| **Kesehatan Sosial**  | Waktu bersama keluarga, Menelepon orang tua, Mengikuti workshop atau festival, berbiacara dengan teman |
| **Keuangan**          | Bayar tagihan, Belanja, Anggaran bulanan, cek keuangan mingguan                        |
| **Pekerjaan Rumah**   | Membersihkan rumah, Menyiram tanaman, Mencuci pakaian, mingguan prioritas           |

#### Form Pembuatan Habit

Rancang form input komprehensif dengan field berikut:

**Informasi Dasar:**

* Nama habit (input teks)
* Pilihan kategori (dropdown dari kategori yang tersedia)
* Pilihan tema warna (color picker untuk kustomisasi visual)

**Pengaturan Frekuensi:**
Terapkan tiga jenis frekuensi dengan field dinamis:

1. **Frekuensi Harian:**

   * Input target (contoh: “8 gelas air”)
   * Spesifikasi satuan (gelas, kali, menit, dll)
   * Nilai target numerik harian

2. **Frekuensi Mingguan:**

   * Checkbox multi-pilih hari (Senin–Minggu)
   * Selector hari visual dengan status toggle
   * Validasi minimal satu hari harus dipilih

3. **Frekuensi Bulanan:**

   * Modal kalender untuk memilih tanggal
   * Mendukung multi-tanggal
   * Tampilan kalender visual dengan highlight tanggal terpilih

**Pengaturan Notifikasi:**

* Time picker untuk pengingat
* Field “Ingatkan saya pada” dengan antarmuka jam
* Opsional: lebih dari satu waktu pengingat per habit

---

### B. Sistem Smart Daily Check-in & Mood Board

#### Mekanisme Trigger

* Modal aktif saat pengguna menekan checkbox penyelesaian habit
* Modal bersifat blocking (tidak bisa berinteraksi dengan background sebelum selesai)

#### Antarmuka Mood Board

**Layar Pemilihan Mood:**
Tampilkan pilihan emosi dengan ikon visual:

* 😊 Senang
* 💪 Bangga
* 😟 Khawatir
* 😠 Kesal
* 😢 Sedih
* 😡 Marah

**Alur Logika Kondisional:**

**Untuk Emosi Positif (Senang, Bangga):**

1. Tampilkan pesan ucapan selamat
2. Tampilkan maskot animasi atau stempel “Good Job”
3. Simpan data mood
4. Modal tertutup otomatis setelah 2 detik

**Untuk Emosi Negatif (Khawatir, Kesal, Sedih, Marah):**

1. Tampilkan pesan empati
2. Pertanyaan lanjutan: *“Apa yang membuat kamu merasa seperti ini?”*
3. Text area untuk refleksi (opsional)
4. Prompt suportif: *“Apa yang bisa menenangkanmu sekarang?”*
5. Pilihan saran aktivitas:

   * Istirahat sejenak
   * Latihan pernapasan
   * Mendengarkan musik yang menenangkan
   * Berbicara dengan seseorang
   * Jalan santai
6. Tampilkan animasi maskot yang memberi dukungan
7. Simpan data mood dan refleksi secara detail

**Pengumpulan Data:**
Simpan data berikut untuk setiap check-in:

* Timestamp
* Habit terkait
* Emosi yang dipilih
* Teks refleksi (jika ada)
* Aktivitas penenang yang dipilih

---

### C. Sistem Manajemen Tugas (Menu 2)

#### Form Pembuatan Tugas

**1. Identitas Tugas:**

* Judul tugas utama (wajib)
* Deskripsi (opsional, rich text)

**2. Manajemen Sub-tugas:**

* Tambah banyak sub-tugas (list dinamis)
* Checkbox penyelesaian sub-tugas
* Hierarki visual bertingkat
* Mendukung drag-and-drop untuk urutan

**3. Penjadwalan:**

* **Tanggal Jatuh Tempo:** date picker kalender
* **Auto Postpone:** toggle

  * Aktif: tugas yang belum selesai otomatis pindah ke hari berikutnya
  * Nonaktif: tugas tetap di tanggal semula

**4. Sistem Prioritas:**

* 🔴 **Tinggi:** badge/border merah
* 🟡 **Sedang:** badge/border kuning
* 🟢 **Rendah:** badge/border hijau

**5. Pengulangan Tugas:**

* Dropdown:

  * Tidak mengulang
  * Harian
  * Mingguan (pilih hari)
  * Bulanan (pilih tanggal)
  * Kustom (interval khusus)

**Logika Tampilan Tugas:**

* Urutkan default berdasarkan prioritas
* Filter: Semua, Hari Ini, Mendatang, Terlewat
* Aksi swipe: Edit, Hapus, Tunda
* Checkbox penyelesaian dengan animasi coret

---

## 3. Dashboard Analitik & Visualisasi (Menu 3)

### Indikator Kinerja Utama

#### Tingkat Penyelesaian

* Persentase total habit selesai
* Rumus: `(Habit Selesai / Total Habit Terjadwal) × 100`
* Ditampilkan sebagai indikator progres melingkar
* Update real-time

#### Visualisasi Aktivitas Habit

Grafik garis:

* Sumbu X: periode waktu
* Sumbu Y: tingkat penyelesaian
* Tooltip interaktif
* Toggle tampilan mingguan/bulanan/tahunan

#### Metrik Statistik

* **Streak Hari:** hari berturut-turut semua habit selesai 🔥
* **Perfect Days:** hari dengan penyelesaian 100% 🏆
* **Active Days:** hari dengan aktivitas habit

### Heatmap Kalender

* Grid kalender bulanan
* Warna performa harian:

  * 🟢 80–100%
  * 🟡 40–79%
  * 🔴 1–39%
  * ⚪ Skip
* Tooltip detail
* Klik untuk detail harian

---

## 4. Kebutuhan UI/UX

### Sistem Tema Warna

* Warna khusus per habit
* Palet warna bawaan (8–12 warna)
* Light mode & dark mode
* Preferensi disimpan lokal

### Komponen UI

* Toggle switch animatif
* Modal pop-up dengan blur
* Calendar & date picker lengkap
* Time picker sesuai locale

### Animasi & Interaksi

* Stempel penyelesaian animasi
* Maskot ekspresif sesuai mood
* Micro-interactions (klik, checkbox, progres)
* Confetti milestone (opsional)

### Aksesibilitas

* WCAG 2.1 AA
* Navigasi keyboard
* Screen reader support
* Kontras warna memadai
* Target sentuh min. 44×44px

### Responsif

* Mobile-first (min. 320px)
* Tablet (768px)
* Desktop (1024px+)
* Bottom nav jadi sidebar di desktop

---

## 5. Panduan Implementasi Teknis

### Penyimpanan Data

* Local storage (offline)
* Sinkronisasi cloud (opsional)
* Ekspor/impor data

### Performa

* Load awal < 2 detik
* Animasi 60fps
* Lazy loading chart

### Kompatibilitas

* Chrome, Firefox, Safari, Edge
* PWA support
* Offline mode

---

## 6. Kriteria Keberhasilan & Deliverables

### MVP Minimal:

1. Pelacakan habit lengkap
2. Smart Daily Check-in & Mood Board
3. Manajemen tugas dasar
4. Dashboard analitik
5. Desain responsif
6. Kustomisasi tema

### Pengembangan Lanjutan:

* Fitur sosial
* Rekomendasi habit berbasis AI
* Integrasi kalender
* Gamifikasi
* Habit kolaboratif

---

## Format Deliverable

* Aplikasi web fungsional lengkap
* Kode bersih & terdokumentasi
* UI responsif sesuai spesifikasi
* Panduan pengguna
* Testing untuk fitur inti
