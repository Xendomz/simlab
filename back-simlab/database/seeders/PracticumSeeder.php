<?php

namespace Database\Seeders;

use App\Models\Practicum;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PracticumSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Practicum::insert([
            [
                'code' => 'IS23123',
                'name' => 'Pemrogramman Web',
                'study_program_id' => 10,
                'type' => 'compulsory',
                'sks' => 3
            ],
            [
                'code' => 'IS31231',
                'name' => 'Pemrogramman Beroriantasi Objek',
                'study_program_id' => 10,
                'type' => 'compulsory',
                'sks' => 3
            ],
            [
                'code' => 'IS33123',
                'name' => 'Cloud Computing',
                'study_program_id' => 10,
                'type' => 'compulsory',
                'sks' => 2
            ],
        ]);
    }
}
