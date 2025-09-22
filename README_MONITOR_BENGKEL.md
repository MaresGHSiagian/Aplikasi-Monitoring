# Monitor Bengkel - Laravel Breeze + React

Aplikasi monitoring pekerjaan bengkel dengan fitur real-time timer dan progress bar.

## Fitur Utama

### 🔑 Autentikasi & Role

-   **Laravel Breeze** dengan React (Inertia.js) untuk login/register
-   **Role-based access**: Admin & Karyawan
-   Default role: Karyawan
-   Admin dapat dibuat manual atau lewat seeding

### 📊 Dashboard Real-time

-   **Timer countdown** untuk setiap pekerjaan yang sedang berjalan
-   **Progress bar** persentase sisa waktu
-   **Status otomatis** berubah menjadi "Lewat Waktu" jika melebihi estimasi
-   **Cards/tabel pekerjaan** dengan informasi lengkap
-   **Statistik** total pekerjaan per status

### 🛠️ Jobs/Pekerjaan Management

-   **Tambah Pekerjaan**: Form input nama pekerjaan, mekanik, estimasi waktu
-   **Status Management**: Belum Mulai → Proses → Selesai/Lewat Waktu
-   **Filter status** pada daftar pekerjaan
-   **CRUD lengkap**: Create, Read, Update, Delete
-   **Detail view** dengan real-time timer dan progress

### 👥 Manajemen User (Admin Only)

-   **List semua user** dengan informasi role dan tanggal bergabung
-   **Tambah user baru** (admin/karyawan)
-   **Edit user**: nama, email, password, role
-   **Hapus user** dengan proteksi (tidak bisa hapus diri sendiri)
-   **Middleware protection**: Hanya admin yang bisa akses

### 🧭 Sidebar Navigation

Menu sidebar yang responsive dengan:

-   **Dashboard** - Monitor semua pekerjaan aktif
-   **Tambah Pekerjaan** - Form tambah pekerjaan baru
-   **Pekerjaan** - Daftar semua pekerjaan dengan filter
-   **Manajemen User** - Khusus admin saja (conditional menu)

## Database Structure

### Users Table

```sql
- id (primary key)
- name (string)
- email (string, unique)
- password (hashed)
- role (enum: 'admin', 'karyawan') - default 'karyawan'
- email_verified_at (timestamp)
- created_at, updated_at
```

### Bengkel Jobs Table

```sql
- id (primary key)
- nama_pekerjaan (string)
- mekanik (string)
- estimasi_menit (integer)
- waktu_mulai (datetime, nullable)
- status (enum: 'Belum Mulai', 'Proses', 'Selesai', 'Lewat Waktu')
- created_at, updated_at
```

## Login Credentials (Seeded Data)

### Admin

-   **Email**: admin@bengkel.com
-   **Password**: admin123
-   **Role**: admin

### Karyawan

-   **Email**: karyawan1@bengkel.com
-   **Password**: karyawan123
-   **Role**: karyawan

-   **Email**: karyawan2@bengkel.com
-   **Password**: karyawan123
-   **Role**: karyawan

## Sample Jobs (Seeded)

1. **Service Motor Vario** - Budi Santoso (120 menit, Belum Mulai)
2. **Ganti Oli Motor Beat** - Ahmad Yusuf (30 menit, Sedang Proses)
3. **Perbaikan Rem Motor** - Slamet Riyadi (90 menit, Selesai)
4. **Tune Up Motor Supra** - Joko Widodo (60 menit, Lewat Waktu)

## Teknologi Stack

-   **Backend**: Laravel 12 + Laravel Breeze
-   **Frontend**: React 18 + Inertia.js
-   **Styling**: Tailwind CSS
-   **Database**: SQLite (default)
-   **Build Tool**: Vite

## Cara Menjalankan

1. Install dependencies: `composer install && npm install`
2. Setup database: `php artisan migrate:fresh --seed`
3. Build assets: `npm run build` (atau `npm run dev` untuk development)
4. Jalankan server: `php artisan serve`

## Fitur Real-time

-   **Timer countdown** update setiap detik
-   **Progress bar** menunjukkan persentase waktu yang telah berlalu
-   **Status otomatis** berubah menjadi "Lewat Waktu" jika timer habis
-   **Color coding** untuk status (hijau=selesai, biru=proses, merah=lewat waktu, abu-abu=belum mulai)

## Security & Authorization

-   **Middleware authentication** untuk semua halaman setelah login
-   **AdminMiddleware** untuk proteksi fitur manajemen user
-   **Role-based menu** (sidebar menu berbeda untuk admin dan karyawan)
-   **Route protection** dengan middleware 'admin'
