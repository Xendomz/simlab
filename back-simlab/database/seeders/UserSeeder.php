<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::insert([
            [
                'name' => 'Admin (Erlina)',
                'email' => 'labterpadu@itk.ac.id',
                'password' => bcrypt('123123'),
                'role' => 'admin',
                'identity_num' => null,
                'study_program_id' => null,
            ],
            [
                'name' => 'Kepalalab',
                'email' => 'kepalalab@gmail.com',
                'password' => bcrypt('123123'),
                'role' => 'kepala_lab_terpadu',
                'identity_num' => '2313321',
                'study_program_id' => 10,
            ],
            [
                'name' => 'laboran',
                'email' => 'laboran@gmail.com',
                'password' => bcrypt('123123'),
                'role' => 'laboran',
                'identity_num' => null,
                'study_program_id' => null,
            ]
        ]);
    }
}
