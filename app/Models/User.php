<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get all jobs for the user.
     */
    public function jobs()
    {
        return $this->hasMany(BengkelJob::class);
    }

    /**
     * Check if user is manager.
     */
    public function isManager()
    {
        return $this->role === 'manager';
    }

    /**
     * Check if user is askep.
     */
    public function isAskep()
    {
        return $this->role === 'askep';
    }

    /**
     * Check if user is asisten bengkel.
     */
    public function isAsistenBengkel()
    {
        return $this->role === 'asisten_bengkel';
    }

    /**
     * Check if user is asisten proses.
     */
    public function isAsistenProses()
    {
        return $this->role === 'asisten_proses';
    }

    /**
     * Check if user is karyawan.
     */
    public function isKaryawan()
    {
        return $this->role === 'karyawan';
    }

    /**
     * Check if user can add damage reports.
     * Manager, Askep, Asisten Bengkel, and Asisten Proses can add damage reports.
     */
    public function canAddDamageReports()
    {
        return in_array($this->role, ['manager', 'askep', 'asisten_bengkel', 'asisten_proses']);
    }

    /**
     * Check if user can approve jobs.
     * Manager, Askep, and Asisten Bengkel can approve jobs.
     */
    public function canApproveJobs()
    {
        return in_array($this->role, ['manager', 'askep', 'asisten_bengkel']);
    }

    /**
     * Check if user is admin (for user management).
     * All roles except karyawan can manage users.
     */
    public function isAdmin()
    {
        return !$this->isKaryawan();
    }

    /**
     * Check if user can create jobs for karyawan.
     * Only Asisten Bengkel can create and start jobs for karyawan.
     */
    public function canManageKaryawanJobs()
    {
        return $this->role === 'asisten_bengkel';
    }

    /**
     * Check if user has management level access.
     * Manager and Askep have full management access.
     */
    public function isManagement()
    {
        return in_array($this->role, ['manager', 'askep']);
    }

    /**
     * Get all users that can be assigned as mechanics.
     */
    public static function getMechanics()
    {
        return self::select('id', 'name', 'role')
                   ->orderBy('name')
                   ->get();
    }
}
