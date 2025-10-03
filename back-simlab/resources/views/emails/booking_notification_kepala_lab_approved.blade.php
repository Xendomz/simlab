@component('mail::message')
# Yth. Laboran {{$laboran->name}}

Anda diminta untuk menjadi penanggung jawab dan membantu mengawasi peminjaman ruangan di Laboratorium Terpadu ITK oleh:

Nama Mahasiswa :  {{$booking->user->name ?? '-' }} <br>
NIM : {{$booking->user->identity_num ?? '-' }} <br>
Email Mahasiswa: {{$booking->user->email ?? '-' }} <br>
Program Studi: {{$booking->user->studyProgram->name ?? '-' }} <br>
Tujuan Penggunaan: {{$booking->purpose}} <br>
Judul Proyek / Penelitian: {{$booking->activity_name}} <br>
Tanggal Penggunaan : {{$booking->formatted_range['start_date']}} s/d {{$booking->formatted_range['end_date']}} <br>
Jam Penggunaan: {{$booking->formatted_range['start_time']}} s/d {{$booking->formatted_range['end_time']}} WITA

Mohon petugas laboran terkait untuk segera melakukan verifikasi ataupun penolakan terhadap permohonan pengajuan peminjaman ruangan tersebut di <a href="https://labterpadu.itk.ac.id/">https://labterpadu.itk.ac.id/</a>

Terima Kasih, <br> <br><br> <br>
Laboratorium Terpadu <br>
Institut Teknologi Kalimantan.
@endcomponent
