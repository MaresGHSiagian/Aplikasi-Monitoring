<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // First drop the constraint
        DB::statement('ALTER TABLE bengkel_jobs DROP CONSTRAINT IF EXISTS bengkel_jobs_status_check');
        
        // Add new column with correct enum
        Schema::table('bengkel_jobs', function (Blueprint $table) {
            $table->enum('status_new', ['Belum Mulai', 'Proses', 'Waiting', 'Selesai', 'Rejected', 'Lewat Waktu'])->default('Belum Mulai');
        });
        
        // Copy data, converting 'Approved' to 'Selesai'
        DB::statement("UPDATE bengkel_jobs SET status_new = CASE 
            WHEN status = 'Approved' THEN 'Selesai' 
            ELSE status 
        END");
        
        // Drop old status column and rename new one
        Schema::table('bengkel_jobs', function (Blueprint $table) {
            $table->dropColumn('status');
            $table->renameColumn('status_new', 'status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bengkel_jobs', function (Blueprint $table) {
            $table->dropColumn('status');
        });
        
        Schema::table('bengkel_jobs', function (Blueprint $table) {
            $table->enum('status', ['Belum Mulai', 'Proses', 'Waiting', 'Approved', 'Rejected', 'Lewat Waktu'])->default('Belum Mulai');
        });
    }
};
