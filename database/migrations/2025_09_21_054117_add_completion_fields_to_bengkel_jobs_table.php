<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('bengkel_jobs', function (Blueprint $table) {
            // Update enum status untuk menambahkan Waiting, Approved, Rejected
            $table->dropColumn('status');
        });
        
        Schema::table('bengkel_jobs', function (Blueprint $table) {
            $table->enum('status', ['Belum Mulai', 'Proses', 'Waiting', 'Approved', 'Rejected', 'Lewat Waktu'])->default('Belum Mulai');
            
            // Field untuk completion oleh karyawan
            $table->text('completion_note')->nullable(); // Catatan wajib saat karyawan submit completion
            $table->string('completion_image')->nullable(); // Path gambar bukti penyelesaian
            $table->timestamp('submitted_at')->nullable(); // Waktu karyawan submit completion
            $table->foreignId('completed_by')->nullable()->constrained('users'); // Karyawan yang submit
            
            // Field untuk approval oleh admin  
            $table->text('reject_reason')->nullable(); // Alasan jika admin reject
            $table->timestamp('reviewed_at')->nullable(); // Waktu admin review
            $table->foreignId('reviewed_by')->nullable()->constrained('users'); // Admin yang review
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bengkel_jobs', function (Blueprint $table) {
            $table->dropColumn(['completion_note', 'completion_image', 'submitted_at', 'reject_reason', 'reviewed_at']);
            $table->dropForeign(['completed_by']);
            $table->dropForeign(['reviewed_by']);
            $table->dropColumn(['completed_by', 'reviewed_by']);
            $table->dropColumn('status');
        });
        
        Schema::table('bengkel_jobs', function (Blueprint $table) {
            $table->enum('status', ['Belum Mulai', 'Proses', 'Selesai', 'Lewat Waktu'])->default('Belum Mulai');
        });
    }
};
