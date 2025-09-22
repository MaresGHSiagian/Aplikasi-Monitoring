<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Carbon\Carbon;

class Job extends Model
{
    use HasFactory;

    protected $table = 'bengkel_jobs';

    protected $fillable = [
        'nama_pekerjaan',
        'mekanik', 
        'estimasi_menit',
        'waktu_mulai',
        'status',
        'user_id',
        'completion_note',
        'completion_image',
        'submitted_at',
        'completed_by',
        'reject_reason',
        'reviewed_at',
        'reviewed_by'
    ];

    protected $casts = [
        'waktu_mulai' => 'datetime',
        'submitted_at' => 'datetime',
        'reviewed_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function completedBy()
    {
        return $this->belongsTo(User::class, 'completed_by');
    }

    public function reviewedBy()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function getSisaWaktuAttribute()
    {
        if (!$this->waktu_mulai || $this->status !== 'Proses') {
            return null;
        }

        $estimasiDetik = $this->estimasi_menit * 60;
        $waktuBerlalu = Carbon::now()->diffInSeconds($this->waktu_mulai);
        $sisaDetik = $estimasiDetik - $waktuBerlalu;

        return max(0, $sisaDetik);
    }

    public function getPersentaseProgressAttribute()
    {
        if (!$this->waktu_mulai || $this->status !== 'Proses') {
            return 0;
        }

        $estimasiDetik = $this->estimasi_menit * 60;
        $waktuBerlalu = Carbon::now()->diffInSeconds($this->waktu_mulai);
        $persentase = ($waktuBerlalu / $estimasiDetik) * 100;

        return min(100, max(0, $persentase));
    }

    /**
     * Submit completion by karyawan (with note and image)
     */
    public function submitCompletion($note, $imagePath, $completedBy)
    {
        $this->update([
            'status' => 'Waiting',
            'completion_note' => $note,
            'completion_image' => $imagePath,
            'submitted_at' => Carbon::now(),
            'completed_by' => $completedBy,
        ]);
    }

    /**
     * Approve completion by admin
     */
    public function approveCompletion($reviewedBy)
    {
        $this->update([
            'status' => 'Approved',
            'reviewed_at' => Carbon::now(),
            'reviewed_by' => $reviewedBy,
        ]);
    }

    /**
     * Reject completion by admin
     */
    public function rejectCompletion($rejectReason, $reviewedBy)
    {
        $this->update([
            'status' => 'Rejected',
            'reject_reason' => $rejectReason,
            'reviewed_at' => Carbon::now(),
            'reviewed_by' => $reviewedBy,
        ]);
    }

    /**
     * Check if job can be submitted for completion by karyawan
     */
    public function canBeCompleted()
    {
        return $this->status === 'Proses';
    }

    /**
     * Check if job is waiting for approval
     */
    public function isWaitingApproval()
    {
        return $this->status === 'Waiting';
    }

    /**
     * Check if job can be resubmitted after rejection
     */
    public function canBeResubmitted()
    {
        return $this->status === 'Rejected';
    }
}
