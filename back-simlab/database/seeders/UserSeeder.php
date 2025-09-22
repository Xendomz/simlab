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
                'role' => 'Admin'
            ],
        ]);
    }
}
