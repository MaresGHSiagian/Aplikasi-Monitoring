# 🔧 Monitor Bengkel - Panduan Instalasi Lengkap

Aplikasi Monitor Bengkel adalah sistem manajemen bengkel yang dibuat menggunakan framework Laravel (PHP) dengan frontend React. Panduan ini akan membantu Anda menjalankan aplikasi dari nol sampai bisa digunakan.

## 📋 Daftar Isi

-   [Apa yang Dibutuhkan](#apa-yang-dibutuhkan)
-   [Langkah 1: Instalasi Software](#langkah-1-instalasi-software)
-   [Langkah 2: Download dan Setup Proyek](#langkah-2-download-dan-setup-proyek)
-   [Langkah 3: Konfigurasi Environment](#langkah-3-konfigurasi-environment)
-   [Langkah 4: Setup Database](#langkah-4-setup-database)
-   [Langkah 5: Instalasi Dependencies](#langkah-5-instalasi-dependencies)
-   [Langkah 6: Migrasi Database dan Seeder](#langkah-6-migrasi-database-dan-seeder)
-   [Langkah 7: Menjalankan Aplikasi](#langkah-7-menjalankan-aplikasi)
-   [Troubleshooting](#troubleshooting)
-   [Informasi Tambahan](#informasi-tambahan)

## 🎯 Apa yang Dibutuhkan

Sebelum memulai, Anda perlu memahami bahwa aplikasi ini menggunakan:

-   **Laravel** (Framework PHP untuk backend)
-   **React** (Library JavaScript untuk frontend)
-   **Inertia.js** (Penghubung antara Laravel dan React)
-   **Tailwind CSS** (Framework CSS untuk styling)
-   **SQLite** (Database)

## 📦 Langkah 1: Instalasi Software

### A. Install PHP (versi 8.2 atau lebih baru)

**Untuk Windows:**

1. Download PHP dari https://windows.php.net/download
2. Extract ke folder `C:\php`
3. Tambahkan `C:\php` ke PATH environment variable
4. Atau gunakan XAMPP/Laragon yang sudah include PHP

**Untuk macOS:**

```bash
brew install php
```

**Atau gunakan XAMPP/Laragon (Direkomendasikan untuk Windows):**

1. Download XAMPP dari https://www.apachefriends.org/
2. Atau download Laragon dari https://laragon.org/
3. Install dan pastikan PHP aktif
4. Tambahkan PHP ke PATH environment variable

### B. Install Composer (Package Manager untuk PHP)

1. Download dari https://getcomposer.org/download/
2. Install sesuai petunjuk untuk OS Anda
3. Verifikasi dengan menjalankan: `composer --version`

### C. Install Node.js (versi 18 atau lebih baru)

1. Download dari https://nodejs.org/
2. Install sesuai petunjuk
3. Verifikasi dengan menjalankan:
    ```bash
    node --version
    npm --version
    ```

### D. Install Git

1. Download dari https://git-scm.com/
2. Install dengan pengaturan default
3. Verifikasi dengan: `git --version`

## 📂 Langkah 2: Download dan Setup Proyek

### Option A: Clone dari GitHub

```cmd
git clone https://github.com/MaresGHSiagian/Aplikasi-Monitoring.git
cd Aplikasi-Monitoring
```

### Option B: Download ZIP

1. Download file ZIP dari GitHub
2. Extract ke folder yang diinginkan
3. Buka terminal/command prompt di folder tersebut

## ⚙️ Langkah 3: Konfigurasi Environment

1. **Copy file environment:**

    ```cmd
    copy .env.example .env
    ```

2. **Edit file `.env`** dengan text editor favorit Anda:

    ```
    APP_NAME="Monitor Bengkel"
    APP_ENV=local
    APP_KEY=
    APP_DEBUG=true
    APP_TIMEZONE=Asia/Jakarta
    APP_URL=http://localhost:8000

    DB_CONNECTION=sqlite
    # DB_HOST=127.0.0.1
    # DB_PORT=3306
    # DB_DATABASE=monitor_bengkel
    # DB_USERNAME=root
    # DB_PASSWORD=
    ```

3. **Generate application key:**
    ```cmd
    php artisan key:generate
    ```

## 🗄️ Langkah 4: Setup Database

Aplikasi ini menggunakan SQLite secara default (database file, tidak perlu server database terpisah).

1. **Buat file database:**

    ```cmd
    type nul > database\database.sqlite
    ```

2. **Atau buat file kosong** dengan nama `database.sqlite` di folder `database/` menggunakan File Explorer

## 📱 Langkah 5: Instalasi Dependencies

### A. Install PHP Dependencies

```cmd
composer install
```

### B. Install JavaScript Dependencies

```cmd
npm install
```

## 🏗️ Langkah 6: Migrasi Database dan Seeder

1. **Jalankan migrasi database:**

    ```cmd
    php artisan migrate
    ```

2. **Jalankan seeder (data awal):**

    ```cmd
    php artisan db:seed
    ```

3. **Atau jalankan sekaligus:**
    ```cmd
    php artisan migrate --seed
    ```

## 🚀 Langkah 7: Menjalankan Aplikasi

Anda perlu membuka 2 Command Prompt secara bersamaan:

### Command Prompt 1: Laravel Development Server

```cmd
php artisan serve
```

Server akan berjalan di: http://localhost:8000

### Command Prompt 2: Vite Development Server (untuk frontend)

```cmd
npm run dev
```

Vite akan berjalan di port lain (biasanya 5173) dan akan di-proxy oleh Laravel.

### Akses Aplikasi

Buka browser dan kunjungi: **http://localhost:8000**

## 🔧 Troubleshooting

### Error "Class not found" atau Autoloader

```cmd
composer dump-autoload
```

### Error Permission (Folder tidak bisa diakses)

1. Klik kanan pada folder `storage` dan `bootstrap\cache`
2. Pilih Properties → Security → Edit
3. Berikan Full Control untuk user Anda
4. Atau jalankan Command Prompt sebagai Administrator

### Error Node.js modules

```cmd
rmdir /s node_modules
del package-lock.json
npm install
```

### Database tidak terbuat

1. Pastikan folder `database\` ada
2. Buat manual file `database.sqlite` di folder `database\`
3. Jalankan ulang: `php artisan migrate`

### Vite tidak bisa connect

1. Pastikan port 5173 tidak digunakan aplikasi lain
2. Restart: `npm run dev`
3. Clear browser cache

### Laravel server error 500

1. Cek file `.env` sudah benar
2. Jalankan: `php artisan config:clear`
3. Jalankan: `php artisan cache:clear`
4. Cek log error di `storage\logs\laravel.log`

## 📚 Informasi Tambahan

### Struktur Aplikasi

```
Monitor Bengkel/
├── app/                 # Logika aplikasi (Controllers, Models)
├── database/           # Migrasi dan seeder database
├── public/            # File yang bisa diakses publik
├── resources/         # File frontend (React components, CSS)
├── routes/            # Definisi URL routing
├── storage/           # File upload dan cache
└── vendor/            # Dependencies PHP
```

### Perintah Berguna

**Membuat user admin baru:**

```cmd
php artisan tinker
```

Kemudian di dalam tinker:

```php
use App\Models\User;
User::create([
    'name' => 'Admin',
    'email' => 'admin@example.com',
    'password' => bcrypt('password'),
    'role' => 'admin'
]);
exit;
```

**Reset database:**

```cmd
php artisan migrate:fresh --seed
```

**Update dependencies:**

```cmd
composer update
npm update
```

### Mode Produksi

Untuk deploy ke server produksi:

1. **Build frontend:**

    ```cmd
    npm run build
    ```

2. **Optimize Laravel:**

    ```cmd
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
    ```

3. **Set environment ke production** di file `.env`:
    ```
    APP_ENV=production
    APP_DEBUG=false
    ```

## 🆘 Bantuan Lebih Lanjut

Jika masih mengalami masalah:

1. **Cek dokumentasi resmi:**

    - Laravel: https://laravel.com/docs
    - React: https://react.dev/
    - Inertia.js: https://inertiajs.com/

2. **Periksa log error:**

    - Laravel: `storage/logs/laravel.log`
    - Browser: Console Developer Tools (F12)

3. **Perintah debugging:**
    ```cmd
    php artisan config:clear
    php artisan cache:clear
    php artisan route:clear
    composer dump-autoload
    ```

---

**Selamat! Aplikasi Monitor Bengkel sudah siap digunakan! 🎉**

> 💡 **Tips:** Simpan panduan ini dan bookmark halaman dokumentasi framework yang digunakan untuk referensi di masa depan.
