# 📚 Scholar Today

**Scholar Today** adalah aplikasi web media sosial berbasis komunitas akademik yang memungkinkan pengguna untuk berbagi postingan, mengelola tugas harian, menjelajahi album foto, serta terhubung dengan pengguna lainnya.

> 🌐 **Live Demo:** [https://www.scholartoday.web.id](https://www.scholartoday.web.id)

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss&logoColor=white)

## ✨ Fitur Utama

- **Autentikasi** — Login & Register dengan validasi form dan session berbasis JWT
- **Feed Postingan** — Feed dengan infinite scroll, membuat post, serta fitur like dan komentar
- **Detail Postingan** — Tampilan lengkap post dengan komentar, like, dan bookmark
- **Profil Pengguna** — Halaman profil dengan tab postingan dan album foto
- **Album Foto** — Galeri foto dengan grid layout dan lightbox viewer
- **Manajemen Tugas** — Todo list pribadi dengan filter (semua/belum selesai/selesai) dan progress bar
- **Bookmark** — Simpan dan kelola postingan yang di-bookmark
- **Followers** — Lihat daftar pengikut dan fitur follow/unfollow
- **Notifikasi** — Sistem notifikasi untuk aktivitas pengguna
- **Pencarian** — Cari dan temukan pengguna lain
- **Trending Topics** — Topik trending yang otomatis digenerate dari feed
- **Pengguna yang Disarankan** — Rekomendasi pengguna di sidebar
- **Judul Halaman Dinamis** — Judul tab browser berubah sesuai halaman yang aktif
- **Desain Responsif** — Layout optimal dengan navigasi sidebar

## 🛠️ Tech Stack

| Kategori | Teknologi |
|---|---|
| **Framework** | React 19 |
| **Bahasa** | TypeScript 5.9 |
| **Build Tool** | Vite 7 |
| **Styling** | Tailwind CSS 4 |
| **Routing** | React Router 7 |
| **State Management** | Zustand |
| **Server State** | TanStack React Query |
| **Form Handling** | React Hook Form + Yup |
| **HTTP Client** | Axios |
| **Animasi** | Framer Motion |
| **Ikon** | React Icons |
| **Notifikasi Toast** | React Toastify |
| **Kualitas Kode** | ESLint + Prettier |


## 🚀 Cara Menjalankan Aplikasi

### Prasyarat

- [Node.js](https://nodejs.org/) versi 18 atau lebih baru
- [npm](https://www.npmjs.com/) atau [yarn](https://yarnpkg.com/)
- Backend API server berjalan (lihat [Repository Backend](https://github.com/fridoa/scholar-today-api))

### Instalasi

1. **Clone repository**

   ```bash
   git clone https://github.com/fridoa/scholar-today-app.git
   cd scholar-today-app
   ```

2. **Install dependensi**

   ```bash
   npm install
   ```

3. **Konfigurasi environment**

   Buat file `.env` di direktori root:

   ```env
   VITE_API_URL=http://localhost:3000/api
   ```

4. **Jalankan server development**

   ```bash
   npm run dev
   ```

   Aplikasi akan tersedia di `http://localhost:5173`

### Script yang Tersedia

| Perintah | Keterangan |
|---|---|
| `npm run dev` | Menjalankan server development dengan HMR |
| `npm run build` | Type-check dan build untuk production |
| `npm run lint` | Menjalankan ESLint untuk pemeriksaan kualitas kode |
| `npm run preview` | Preview hasil build production secara lokal |

## � Informasi Tambahan

- **Backend:** Aplikasi ini menggunakan backend Express.js yang terpisah sebagai REST API server
- **Deployment:** Frontend di-deploy menggunakan Vercel, backend di-deploy secara terpisah
- **Data Source:** Data pengguna diambil dari JSONPlaceholder sebagai sumber data awal

## 🔐 Akun untuk Testing

Semua akun menggunakan password: `12341234`

| User ID | Email | Password | Registered |
|---------|-------|----------|------------|
| 1 | Sincere@april.biz | 12341234 | ✅ |
| 2 | Shanna@melissa.tv | 12341234 | ✅ |
| 3 | Nathan@yesenia.net | 12341234 | ✅ |
| 4 | Julianne.OConner@kory.org | 12341234 | ✅ |
| 5 | Lucio_Hettinger@annie.ca | 12341234 | ✅ |
| 6 | Karley_Dach@jasper.info | 12341234 | ✅ |
| 7 | Telly.Hoeger@billy.biz | 12341234 | ✅ |
| 8 | Sherwood@rosamond.me | — | ❌ |
| 9 | Chaim_McDermott@dana.io | — | ❌ |
| 10 | Rey.Padberg@karina.biz | — | ❌ |

> User 8–10 belum terdaftar, silakan register terlebih dahulu melalui halaman Register.

## 📄 Lisensi

Proyek ini dikembangkan untuk keperluan akademik.

---

