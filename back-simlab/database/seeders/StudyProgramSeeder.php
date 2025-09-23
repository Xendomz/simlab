<?php

namespace Database\Seeders;

use App\Models\Prodi;
use App\Models\StudyProgram;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StudyProgramSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        StudyProgram::insert([
            [
                'code' => '01',
                'major_id' => 1,
                'name' => 'Fisika'
            ],
            [
                'code' => '02',
                'major_id' => 1,
                'name' => 'Matematika'
            ],
            [
                'code' => '03',
                'major_id' => 5,
                'name' => 'Teknik Mesin'
            ],
            [
                'code' => '04',
                'major_id' => 2,
                'name' => 'Teknik Elektro'
            ],
            [
                'code' => '05',
                'major_id' => 6,
                'name' => 'Teknik Kimia'
            ],
            [
                'code' => '06',
                'major_id' => 5,
                'name' => 'Teknik Material dan Metalurgi'
            ],
            [
                'code' => '07',
                'major_id' => 4,
                'name' => 'Teknik Sipil'
            ],
            [
                'code' => '08',
                'major_id' => 4,
                'name' => 'Perencanaan Wilayah Kota'
            ],
            [
                'code' => '09',
                'major_id' => 3,
                'name' => 'Teknik Perkapalan'
            ],
            [
                'code' => '10',
                'major_id' => 2,
                'name' => 'Sistem Informasi'
            ],
            [
                'code' => '11',
                'major_id' => 2,
                'name' => 'Informatika'
            ],
            [
                'code' => '12',
                'major_id' => 5,
                'name' => 'Teknik Industri'
            ],
            [
                'code' => '13',
                'major_id' => 3,
                'name' => 'Teknik Lingkungan'
            ],
            [
                'code' => '14',
                'major_id' => 3,
                'name' => 'Teknik Kelautan',
            ],
            [
                'code' => '15',
                'major_id' => 4,
                'name' => 'Arsitektur'
            ],
            [
                'code' => '16',
                'major_id' => 6,
                'name' => 'Teknologi Pangan'
            ],
            [
                'code' => '17',
                'major_id' => 1,
                'name' => 'Statistika'
            ],
            [
                'code' => '18',
                'major_id' => 1,
                'name' => 'Ilmu Aktuaria'
            ],
            [
                'code' => '19',
                'major_id' => 2,
                'name' => 'Bisnis Digital'
            ],
            [
                'code' => '20',
                'major_id' => 6,
                'name' => 'Rekayasa Keselamatan'
            ],
            [
                'code' => '21',
                'major_id' => 4,
                'name' => 'Desain Komunikasi Visual'
            ],
            [
                'code' => '22',
                'major_id' => 5,
                'name' => 'Teknik Logistik'
            ]
        ]);
    }
}
