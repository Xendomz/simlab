<?php

namespace Database\Seeders;

use App\Models\Major;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MajorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Major::insert([
            [
                'code' => null,
                'name' => 'Jurusan Sains dan Analitika Data',
                'faculty_id' => 1
            ],
            [
                'code' => null,
                'name' => 'Jurusan Teknik Elektro, Informatika, dan Bisnis',
                'faculty_id' => 1
            ],
            [
                'code' => null,
                'name' => 'Jurusan Teknologi Kemaritiman',
                'faculty_id' => 2
            ],
            [
                'code' => null,
                'name' => 'Jurusan Teknik Sipil dan Perencanaan',
                'faculty_id' => 2
            ],
            [
                'code' => null,
                'name' => 'Jurusan Teknologi Industri',
                'faculty_id' => 3
            ],
            [
                'code' => null,
                'name' => 'Jurusan Rekayasa Industri',
                'faculty_id' => 3
            ]
        ]);
    }
}
