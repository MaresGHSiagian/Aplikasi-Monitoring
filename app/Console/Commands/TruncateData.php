<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class TruncateData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'data:clear {--force : Skip confirmation}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Kosongkan semua data kecuali tabel users';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Konfirmasi terlebih dahulu
        if (!$this->option('force')) {
            $confirm = $this->confirm('Yakin ingin mengosongkan semua data kecuali users? Data akan hilang permanen!');
            if (!$confirm) {
                $this->info('Operasi dibatalkan.');
                return;
            }
        }

        $this->info('Mulai mengosongkan data...');

        try {
            // Deteksi database driver
            $driver = DB::getDriverName();
            
            // Nonaktifkan foreign key checks berdasarkan driver
            if ($driver === 'mysql') {
                DB::statement('SET FOREIGN_KEY_CHECKS=0');
            } elseif ($driver === 'sqlite') {
                DB::statement('PRAGMA foreign_keys = OFF');
            }
            // PostgreSQL tidak perlu disable foreign key untuk truncate cascade
            
            // Truncate tabel bengkel_jobs
            if (DB::getSchemaBuilder()->hasTable('bengkel_jobs')) {
                if ($driver === 'pgsql') {
                    DB::statement('TRUNCATE TABLE bengkel_jobs RESTART IDENTITY CASCADE');
                } else {
                    DB::table('bengkel_jobs')->truncate();
                }
                $this->line('✓ Tabel bengkel_jobs dikosongkan');
            }

            // Truncate tabel damage_reports  
            if (DB::getSchemaBuilder()->hasTable('damage_reports')) {
                if ($driver === 'pgsql') {
                    DB::statement('TRUNCATE TABLE damage_reports RESTART IDENTITY CASCADE');
                } else {
                    DB::table('damage_reports')->truncate();
                }
                $this->line('✓ Tabel damage_reports dikosongkan');
            }

            // Truncate tabel jobs (Laravel queue jobs)
            if (DB::getSchemaBuilder()->hasTable('jobs')) {
                if ($driver === 'pgsql') {
                    DB::statement('TRUNCATE TABLE jobs RESTART IDENTITY CASCADE');
                } else {
                    DB::table('jobs')->truncate();
                }
                $this->line('✓ Tabel jobs dikosongkan');
            }

            // Truncate tabel failed_jobs
            if (DB::getSchemaBuilder()->hasTable('failed_jobs')) {
                if ($driver === 'pgsql') {
                    DB::statement('TRUNCATE TABLE failed_jobs RESTART IDENTITY CASCADE');
                } else {
                    DB::table('failed_jobs')->truncate();
                }
                $this->line('✓ Tabel failed_jobs dikosongkan');
            }

            // Truncate tabel sessions (opsional)
            if (DB::getSchemaBuilder()->hasTable('sessions')) {
                if ($driver === 'pgsql') {
                    DB::statement('TRUNCATE TABLE sessions RESTART IDENTITY CASCADE');
                } else {
                    DB::table('sessions')->truncate();
                }
                $this->line('✓ Tabel sessions dikosongkan');
            }

            // Aktifkan kembali foreign key checks berdasarkan driver
            if ($driver === 'mysql') {
                DB::statement('SET FOREIGN_KEY_CHECKS=1');
            } elseif ($driver === 'sqlite') {
                DB::statement('PRAGMA foreign_keys = ON');
            }

            $this->newLine();
            $this->info('✅ Semua data berhasil dikosongkan!');
            $this->comment('Tabel users tetap aman dan tidak dihapus.');

        } catch (\Exception $e) {
            $this->error('❌ Terjadi kesalahan: ' . $e->getMessage());
            return 1;
        }

        return 0;
    }
}
