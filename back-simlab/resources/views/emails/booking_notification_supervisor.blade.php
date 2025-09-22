@component('mail::message')
# Yth. Pemilik e-mail : {{$booking->supervisor_name}}

Anda diminta untuk menjadi Dosen penanggung jawab dari :

Nama Mahasiswa :  {{$booking->user->name ?? '-' }}
NIM : {{$booking->user->identity_num ?? '-' }}
Email Mahasiswa: {{$booking->user->email ?? '-' }}
Program Studi: {{$booking->user->studyProgram->name ?? '-' }}
Tujuan Penggunaan: {{$booking->purpose}}
Judul Proyek / Penelitian: {{$booking->activity_name}}

Email ini adalah hanya berupa notifikasi yang menyatakan bahwa ada mahasiswa yang sedang ingin meminjam ruangan di Laboratorium Terpadu ITK dan mahasiswa tersebut adalah salah satu anak didik dari Dosen Pembimbing / Penanggung Jawab Saudara. Apabila anda merasa tidak memiliki atau menaungi mahasiswa diatas silahkan lapor kepada Laboratorium Terpadu ITK melalui chat WhatsApp yang ada pada <a href="https://labterpadu.itk.ac.id/">https://labterpadu.itk.ac.id/</a> atau dapat menghubungi email lab terpadu di: labterpadu@itk.ac.id agar selanjutnya peminjaman ruangan dari mahasiswa tersebut akan kami tolak.

Terima Kasih, <br> <br><br> <br>
Laboratorium Terpadu <br>
Institut Teknologi Kalimantan.
@endcomponent
