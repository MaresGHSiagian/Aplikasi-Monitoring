<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DamageReport extends Model
{
    protected $fillable = [
        'no',
        'stasiun',
        'keterangan_kerusakan',
        'catatan',
        'gambar'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get available stations
     */
    public static function getStations()
    {
        return [
            'stasiun rebusan' => 'Stasiun Rebusan',
            'stasiun threser' => 'Stasiun Threser', 
            'stasiun empty bunch press' => 'Stasiun Empty Bunch Press',
            'stasiun press' => 'Stasiun Press',
            'stasiun kernel' => 'Stasiun Kernel',
            'stasiun klarifikasi' => 'Stasiun Klarifikasi',
            'stasiun boiler' => 'Stasiun Boiler',
            'stasiun water treatment' => 'Stasiun Water Treatment',
            'lainnya' => 'Lainnya'
        ];
    }

    /**
     * Get formatted station name
     */
    public function getFormattedStasiunAttribute()
    {
        $stations = self::getStations();
        return $stations[$this->stasiun] ?? ucwords($this->stasiun);
    }
}
