# 🔧 Monitor Bengkel - Sistem Manajemen Bengkel

<p align="center">
  <img src="https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite">
</p>

Aplikasi Monitor Bengkel adalah sistem manajemen bengkel modern yang memungkinkan Anda untuk mengelola pekerjaan bengkel, laporan kerusakan, dan monitoring aktivitas bengkel dengan mudah.

## ✨ Fitur Utama

-   📋 **Manajemen Job Bengkel** - Kelola pekerjaan bengkel dari awal hingga selesai
-   🔧 **Laporan Kerusakan** - Catat dan pantau laporan kerusakan kendaraan
-   👥 **Manajemen User** - Sistem user dengan role admin dan staff
-   📊 **Dashboard Monitoring** - Pantau aktivitas dan progress pekerjaan
-   🔐 **Sistem Autentikasi** - Login aman dengan Laravel Sanctum

## 🚀 Panduan Instalasi Cepat

### Prerequisites

-   PHP 8.2+
-   Composer
-   Node.js 18+
-   Git

### Langkah Instalasi

```cmd
# Clone repository
git clone [repository-url]
cd Monitor-Bengkel

# Setup environment
copy .env.example .env
php artisan key:generate

# Install dependencies
composer install
npm install

# Setup database
type nul > database\database.sqlite
php artisan migrate --seed

# Jalankan aplikasi (2 Command Prompt)
php artisan serve          # CMD 1: http://localhost:8000
npm run dev               # CMD 2: Frontend development server
npm run build             # MCD 3 : consume kode
```

## 📖 Panduan Lengkap

**[📚 Baca Panduan Instalasi Lengkap](README_INSTALASI_LENGKAP.md)**

Untuk panduan step-by-step yang detail dan mudah dipahami untuk pemula, silakan baca file `README_INSTALASI_LENGKAP.md`.

## 🛠️ Teknologi yang Digunakan

-   **Backend**: Laravel 12 (PHP Framework)
-   **Frontend**: React 18 dengan Inertia.js
-   **Styling**: Tailwind CSS
-   **Database**: SQLite (default), MySQL/PostgreSQL (opsional)
-   **Build Tool**: Vite
-   **Authentication**: Laravel Sanctum

## 📁 Struktur Proyek

```
Monitor Bengkel/
├── app/
│   ├── Http/Controllers/    # Controller untuk handling request
│   ├── Models/             # Model database (User, Job, DamageReport)
│   └── ...
├── database/
│   ├── migrations/         # Migrasi database
│   ├── seeders/           # Data awal database
│   └── database.sqlite    # File database SQLite
├── resources/
│   ├── js/                # React components dan pages
│   └── views/             # Blade templates
├── routes/
│   ├── web.php           # Route web aplikasi
│   └── auth.php          # Route authentication
└── ...
```

## 🔐 Default Login

Setelah menjalankan seeder, Anda dapat login dengan:

-   **Email**: admin@example.com
-   **Password**: password
-   **Role**: Admin

## 🧪 Testing

Jalankan test untuk memastikan aplikasi berfungsi dengan baik:

```cmd
# Jalankan semua test
php artisan test

# Jalankan test spesifik
php artisan test --filter UserTest
```

## 🚀 Deployment

Untuk deploy ke production server:

```cmd
# Build assets untuk production
npm run build

# Optimize Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Update .env untuk production
APP_ENV=production
APP_DEBUG=false
```

## 🤝 Kontribusi

1. Fork repository ini
2. Buat branch fitur baru (`git checkout -b fitur-baru`)
3. Commit perubahan (`git commit -am 'Menambah fitur baru'`)
4. Push ke branch (`git push origin fitur-baru`)
5. Buat Pull Request

## 📞 Support

Jika Anda mengalami masalah atau memiliki pertanyaan:

1. Baca [Panduan Instalasi Lengkap](README_INSTALASI_LENGKAP.md)
2. Periksa section [Troubleshooting](README_INSTALASI_LENGKAP.md#troubleshooting)
3. Buat issue baru di GitHub repository ini

## 📄 License

Aplikasi ini menggunakan [MIT License](https://opensource.org/licenses/MIT).

---

**Happy Coding! 🎉**
