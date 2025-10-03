<?php

namespace Database\Seeders;

use App\Models\LaboratoryEquipment;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LaboratoryEquipmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        LaboratoryEquipment::insert([
            [
                'laboratory_room_id' => 1,
                'equipment_name' => 'Mikroskop Binokuler',
                'quantity' => 10,
                'unit' => 'unit',
                'function' => 'Mengamati objek mikroskopis',
                'photo' => null,
                'brand' => 'Olympus',
                'equipment_type' => 'Optik',
                'origin' => 'Jepang',
                'condition' => 'Baik',
                'condition_description' => 'Tidak ada kerusakan',
                'asset_code' => 'LAB-EQ-001',
                'student_price' => 10000,
                'lecturer_price' => 15000,
                'external_price' => 20000,
            ],
            [
                'laboratory_room_id' => 1,
                'equipment_name' => 'Centrifuge',
                'quantity' => 5,
                'unit' => 'unit',
                'function' => 'Memisahkan partikel dalam cairan',
                'photo' => null,
                'brand' => 'Eppendorf',
                'equipment_type' => 'Elektronik',
                'origin' => 'Jerman',
                'condition' => 'Baik',
                'condition_description' => 'Baru diservis',
                'asset_code' => 'LAB-EQ-002',
                'student_price' => 12000,
                'lecturer_price' => 17000,
                'external_price' => 22000,
            ],
            [
                'laboratory_room_id' => 2,
                'equipment_name' => 'Hot Plate',
                'quantity' => 8,
                'unit' => 'unit',
                'function' => 'Memanaskan larutan',
                'photo' => null,
                'brand' => 'Thermo',
                'equipment_type' => 'Elektronik',
                'origin' => 'Amerika',
                'condition' => 'Cukup',
                'condition_description' => 'Permukaan sedikit tergores',
                'asset_code' => 'LAB-EQ-003',
                'student_price' => 9000,
                'lecturer_price' => 14000,
                'external_price' => 18000,
            ],
        ]);
    }
}
