# Dota 2 Draft Simulator

Aplikasi simulasi draft Dota 2 yang memungkinkan pengguna untuk berlatih strategi drafting melawan bot yang menggunakan AI.

## Fitur

- **Simulasi Draft Lengkap**: Mengikuti format Captain Mode dengan urutan ban dan pick yang sesuai
- **Pemilihan Tim**: Pilih antara tim Radiant atau Dire
- **Bot AI**: Lawan bot yang menggunakan AI untuk membuat keputusan ban dan pick
- **Visualisasi Draft**: Timeline visual yang menunjukkan progress draft
- **Pencarian Hero**: Cari hero dengan mengetik nama hero
- **Batas Waktu**: Opsional batas waktu untuk setiap fase draft (1-300 detik)
- **Analisis Draft**: Dapatkan analisis mendalam tentang draft setelah selesai, termasuk:
  - Probabilitas kemenangan untuk masing-masing tim
  - Kekuatan dan kelemahan draft
  - Faktor-faktor yang mempengaruhi hasil pertandingan
  - Saran strategi untuk kedua tim

## Teknologi

- Nuxt 3
- Vue 3
- Pinia
- Tailwind CSS
- Google Gemini AI

## Cara Penggunaan

1. Pilih tim (Radiant atau Dire)
2. (Opsional) Aktifkan batas waktu dan atur durasi (1-300 detik)
3. Tunggu countdown selesai
4. Saat giliran Anda:
   - Klik hero untuk memilih
   - Tekan tombol "Ban Hero" atau "Pick Hero"
   - Jika batas waktu diaktifkan, Anda harus memilih dalam waktu yang ditentukan
5. Saat giliran bot:
   - Bot akan "berpikir" selama 1-3 detik
   - Bot akan memilih hero secara otomatis
6. Setelah draft selesai:
   - Klik tombol "Get Analysis"
   - Tunggu hasil analisis dari AI
   - Baca analisis mendalam tentang draft

## Kontrol

- **Mouse**: 
  - Klik hero untuk memilih
  - "Ban Hero": Untuk membanned hero yang dipilih
  - "Pick Hero": Untuk memilih hero yang dipilih
  - "Get Analysis": Untuk mendapatkan analisis draft (muncul setelah draft selesai)
  - "Ulang Simulasi": Untuk memulai ulang draft dengan tim yang sama
  - "Restart Simulasi": Untuk kembali ke pemilihan tim
- **Keyboard**: Ketik nama hero untuk mencari
- **Batas Waktu**:
  - Timer akan muncul saat giliran Anda
  - Tombol akan berkedip merah saat waktu habis
  - Timer hanya aktif saat giliran Anda

## Instalasi

1. Clone repository
```bash
git clone [repository-url]
```

2. Install dependencies
```bash
npm install
```

3. Buat file `.env` dan tambahkan API key Gemini
```
GEMINI_API_KEY=your_api_key_here
```

4. Jalankan aplikasi
```bash
npm run dev
```

## Lisensi

[GNU GPL v3](https://choosealicense.com/licenses/gpl-3.0/)
