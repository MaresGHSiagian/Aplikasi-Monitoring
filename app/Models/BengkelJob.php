<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class BengkelJob extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama_pekerjaan',
        'mekanik',
        'estimasi_menit',
        'waktu_mulai',
        'status',
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
        'estimasi_menit' => 'integer',
        'submitted_at' => 'datetime',
        'reviewed_at' => 'datetime',
    ];

    /**
     * Get the estimated end time based on start time and estimation
     */
    public function getEstimatedEndTimeAttribute()
    {
        if (!$this->waktu_mulai) {
            return null;
        }
        
        return $this->waktu_mulai->addMinutes($this->estimasi_menit);
    }

    /**
     * Get remaining time in minutes
     */
    public function getRemainingTimeAttribute()
    {
        if (!$this->waktu_mulai || $this->status === 'Selesai') {
            return 0;
        }

        $endTime = $this->waktu_mulai->addMinutes($this->estimasi_menit);
        $now = Carbon::now();
        
        if ($now->greaterThan($endTime)) {
            return 0; // Time's up
        }
        
        return $now->diffInMinutes($endTime, false);
    }

    /**
     * Get progress percentage
     */
    public function getProgressPercentageAttribute()
    {
        if (!$this->waktu_mulai || $this->estimasi_menit <= 0) {
            return 0;
        }

        $now = Carbon::now();
        $elapsedMinutes = $this->waktu_mulai->diffInMinutes($now);
        $progress = ($elapsedMinutes / $this->estimasi_menit) * 100;
        
        return min(100, max(0, $progress));
    }

    /**
     * Check if job is overdue
     */
    public function getIsOverdueAttribute()
    {
        if (!$this->waktu_mulai || $this->status === 'Selesai') {
            return false;
        }

        $endTime = $this->waktu_mulai->addMinutes($this->estimasi_menit);
        return Carbon::now()->greaterThan($endTime);
    }

    /**
     * Start the job
     */
    public function start()
    {
        $this->update([
            'waktu_mulai' => Carbon::now(),
            'status' => 'Proses'
        ]);
    }

    /**
     * Complete the job
     */
    public function complete()
    {
        $this->update([
            'status' => 'Selesai'
        ]);
    }

    /**
     * Mark job as overdue
     */
    public function markAsOverdue()
    {
        $this->update([
            'status' => 'Lewat Waktu'
        ]);
    }

    /**
     * Relations
     */
    public function completedBy()
    {
        return $this->belongsTo(User::class, 'completed_by');
    }

    public function reviewedBy()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
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
            'status' => 'Selesai',
            'reviewed_at' => Carbon::now(),
            'reviewed_by' => $reviewedBy,
        ]);
    }

    /**
     * Complete job directly by admin (auto-approved)
     */
    public function completeByAdmin($completedBy, $note = null)
    {
        $this->update([
            'status' => 'Selesai',
            'completion_note' => $note ?? 'Diselesaikan langsung oleh admin',
            'submitted_at' => Carbon::now(),
            'completed_by' => $completedBy,
            'reviewed_at' => Carbon::now(),
            'reviewed_by' => $completedBy,
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
        return in_array($this->status, ['Proses', 'Lewat Waktu']);
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

    /**
     * Check if karyawan can access this job (only their own jobs)
     */
    public function canBeAccessedByKaryawan($userName)
    {
        return $this->mekanik === $userName;
    }
}