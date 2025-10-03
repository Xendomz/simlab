<?php

namespace Database\Seeders;

use App\Models\PracticumModule;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PracticumModuleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        PracticumModule::insert([
            [
                'practicum_id' => 1,
                'name' => 'Pengantar pemrogramman web',
                'status' => 'active',
            ],
            [
                'practicum_id' => 1,
                'name' => 'HTML & CSS',
                'status' => 'active',
            ],
            [
                'practicum_id' => 2,
                'name' => 'Pengantar pemrogramman berorientasi objek',
                'status' => 'active',
            ],
            [
                'practicum_id' => 2,
                'name' => 'Class & Attribute',
                'status' => 'active',
            ],
            [
                'practicum_id' => 3,
                'name' => 'Pengantar cloud computing',
                'status' => 'active',
            ],
            [
                'practicum_id' => 3,
                'name' => 'PAAS & SAAS',
                'status' => 'active',
            ],
        ]);
    }
}
