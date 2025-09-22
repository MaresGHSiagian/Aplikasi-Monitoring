<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\DamageReport;

class DamageReportSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $reports = [
            [
                'no' => 'DR001',
                'stasiun' => 'stasiun rebusan',
                'keterangan_kerusakan' => 'Kebocoran pipa uap utama',
                'catatan' => 'Pipa uap mengalami kebocoran di sambungan flange, menyebabkan penurunan tekanan dan efisiensi rebusan menurun drastis.',
                'gambar' => null,
            ],
            [
                'no' => 'DR002',
                'stasiun' => 'stasiun threser',
                'keterangan_kerusakan' => 'Kerusakan pada conveyor belt',
                'catatan' => 'Belt conveyor mengalami robekan sepanjang 2 meter, menyebabkan pemindahan TBS terganggu dan menumpuk di area feeding.',
                'gambar' => null,
            ],
            [
                'no' => 'DR003',
                'stasiun' => 'stasiun press',
                'keterangan_kerusakan' => 'Hydraulic cylinder bocor',
                'catatan' => 'Cylinder hydraulic press mengalami kebocoran oli, tekanan press tidak optimal sehingga extraction rate menurun 15%.',
                'gambar' => null,
            ],
            [
                'no' => 'DR004',
                'stasiun' => 'stasiun boiler',
                'keterangan_kerusakan' => 'Temperature sensor error',
                'catatan' => 'Sensor suhu boiler menunjukkan reading yang tidak akurat, berpotensi menyebabkan overheating atau underheating steam.',
                'gambar' => null,
            ],
            [
                'no' => 'DR005',
                'stasiun' => 'stasiun klarifikasi',
                'keterangan_kerusakan' => 'Pompa vakum rusak',
                'catatan' => 'Pompa vakum untuk continuous setttle tank tidak bekerja optimal, proses pemisahan minyak dengan air terganggu.',
                'gambar' => null,
            ]
        ];

        foreach ($reports as $report) {
            DamageReport::create($report);
        }
    }
}
