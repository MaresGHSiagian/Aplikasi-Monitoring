<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create Manager User
        User::create([
            'name' => 'Manager Bengkel',
            'email' => 'manager@gmail.com',
            'password' => bcrypt('manager123'),
            'role' => 'manager',
            'email_verified_at' => now(),
        ]);

        // Create Askep User
        User::create([
            'name' => 'Asisten Kepala',
            'email' => 'asistenkepala@gmail.com',
            'password' => bcrypt('askep123'),
            'role' => 'askep',
            'email_verified_at' => now(),
        ]);

        // Create Asisten Bengkel User
        User::create([
            'name' => 'Asisten Bengkel',
            'email' => 'asisten.bengkel@bengkel.com',
            'password' => bcrypt('asistenbengkel123'),
            'role' => 'asisten_bengkel',
            'email_verified_at' => now(),
        ]);

        // Create Asisten Proses User
        User::create([
            'name' => 'Asisten Proses',
            'email' => 'asisten.proses@gmailcom',
            'password' => bcrypt('asistenproses123'),
            'role' => 'asisten_proses',
            'email_verified_at' => now(),
        ]);

        // Create Sample Karyawan Users
        User::create([
            'name' => 'Karyawan 1',
            'email' => 'karyawan1@bengkel.com',
            'password' => bcrypt('karyawan123'),
            'role' => 'karyawan',
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Karyawan 2',
            'email' => 'karyawan2@bengkel.com',
            'password' => bcrypt('karyawan123'),
            'role' => 'karyawan',
            'email_verified_at' => now(),
        ]);

        // Create Sample Jobs (assigned to actual karyawan users)
        \App\Models\BengkelJob::create([
            'nama_pekerjaan' => 'Service Motor Vario',
            'mekanik' => 'Karyawan 1',
            'estimasi_menit' => 120,
            'status' => 'Belum Mulai',
        ]);

        \App\Models\BengkelJob::create([
            'nama_pekerjaan' => 'Ganti Oli Motor Beat',
            'mekanik' => 'Karyawan 2',
            'estimasi_menit' => 30,
            'waktu_mulai' => now()->subMinutes(10),
            'status' => 'Proses',
        ]);

        \App\Models\BengkelJob::create([
            'nama_pekerjaan' => 'Perbaikan Rem Motor',
            'mekanik' => 'Karyawan 1',
            'estimasi_menit' => 90,
            'waktu_mulai' => now()->subMinutes(100),
            'status' => 'Selesai',
        ]);

        \App\Models\BengkelJob::create([
            'nama_pekerjaan' => 'Tune Up Motor Supra',
            'mekanik' => 'Karyawan 2',
            'estimasi_menit' => 60,
            'waktu_mulai' => now()->subMinutes(70),
            'status' => 'Lewat Waktu',
        ]);

        // Create a job waiting for approval (for testing approval/rejection)
        \App\Models\BengkelJob::create([
            'nama_pekerjaan' => 'Ganti Ban Motor Scoopy',
            'mekanik' => 'Karyawan 1',
            'estimasi_menit' => 45,
            'waktu_mulai' => now()->subMinutes(50),
            'status' => 'Waiting',
            'completion_note' => 'Ban sudah diganti dengan yang baru, sudah dicek tekanan anginnya juga.',
            'completed_by' => 5, // Karyawan 1's ID
            'submitted_at' => now()->subMinutes(5),
        ]);

        // Create a rejected job (for testing rejected card)
        \App\Models\BengkelJob::create([
            'nama_pekerjaan' => 'Service Berkala Motor Honda',
            'mekanik' => 'Karyawan 2',
            'estimasi_menit' => 90,
            'waktu_mulai' => now()->subMinutes(120),
            'status' => 'Rejected',
            'completion_note' => 'Sudah ganti oli dan filter udara.',
            'completed_by' => 6, // Karyawan 2's ID
            'submitted_at' => now()->subMinutes(30),
            'reject_reason' => 'Foto bukti kerja tidak jelas. Mohon upload ulang foto yang lebih detail menunjukkan hasil pekerjaan.',
            'reviewed_at' => now()->subMinutes(10),
            'reviewed_by' => 1, // Manager's ID
        ]);
    }
}
