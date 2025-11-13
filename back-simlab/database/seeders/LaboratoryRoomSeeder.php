<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\LaboratoryRoom;

class LaboratoryRoomSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        LaboratoryRoom::insert([
            [
                'name' => 'Lab A',
                'floor' => 'Lantai 1',
                'user_id' => 3,
                'student_price' => 50000,
                'lecturer_price' => 75000,
                'external_price' => 100000,
            ],
            [
                'name' => 'Lab B',
                'floor' => 'Lantai 2',
                'user_id' => 3,
                'student_price' => 60000,
                'lecturer_price' => 80000,
                'external_price' => 110000,
            ],
            [
                'name' => 'Lab C',
                'floor' => 'Lantai 3',
                'user_id' => 3,
                'student_price' => 55000,
                'lecturer_price' => 78000,
                'external_price' => 105000,
            ],
        ]);
    }
}
