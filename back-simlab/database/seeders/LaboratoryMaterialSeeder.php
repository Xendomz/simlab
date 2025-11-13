<?php

namespace Database\Seeders;

use App\Models\LaboratoryMaterial;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LaboratoryMaterialSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ambil satu laboratory_room untuk relasi
        LaboratoryMaterial::insert([
            [
                'code' => 'MAT-001',
                'laboratory_room_id' => 1,
                'material_name' => 'Natrium Klorida',
                'brand' => 'Merck',
                'stock' => 20,
                'unit' => 'gram',
                'purchase_date' => '2025-01-10',
                'expiry_date' => '2026-01-10',
                'description' => 'Garam dapur untuk praktikum kimia dasar',
                'refill_date' => '2025-09-01',
                'student_price' => 0,
                'lecturer_price' => 7000,
                'external_price' => 10000,
            ],
            [
                'code' => 'MAT-002',
                'laboratory_room_id' => 1,
                'material_name' => 'Aquadest',
                'brand' => 'Bratachem',
                'stock' => 50,
                'unit' => 'liter',
                'purchase_date' => '2025-02-15',
                'expiry_date' => null,
                'description' => 'Air murni untuk pelarut',
                'refill_date' => '2025-09-10',
                'student_price' => 0,
                'lecturer_price' => 5000,
                'external_price' => 8000,
            ],
            [
                'code' => 'MAT-003',
                'laboratory_room_id' => 2,
                'material_name' => 'Ethanol 96%',
                'brand' => 'Sigma',
                'stock' => 10,
                'unit' => 'liter',
                'purchase_date' => '2025-03-20',
                'expiry_date' => '2026-03-20',
                'description' => 'Pelarut organik untuk praktikum',
                'refill_date' => '2025-09-15',
                'student_price' => 0,
                'lecturer_price' => 10000,
                'external_price' => 15000,
            ],
        ]);
    }
}
