@component('mail::message')
# Yth. Pemohon {{$requestor->name}}
<br>
Menanggapi permohonan Peminjaman Ruangan Laboratorium anda yang diajukan pada {{ $booking->created_at->format('Y-m-d H:i') }} WITA, kami memutuskan bahwa: <br> <br>
<i>Permohonan Pengajuan Peminjaman Ruangan Laboratorium anda kami "<b> <i>TERIMA / DISETUJUI</i></b>"</i><br> <br>
Anda dapat mendownload Kartu Peminjaman Ruangan Laboratorium pada tombol dibawah ini, Kartu ini digunakan pada saat akan memakai ruangan laboratorium cukup memperlihatkan / menampilkan kartu tersebut kepada Petugas Laboran yang bertugas.

@component('mail::button', ['url' => 'https://labterpadu.itk.ac.id/cetakKartuPeminjamanRuangan/'.$booking->id])
Download Kartu Peminjaman Laboratorium
@endcomponent

Terima Kasih,<br> <br><br> <br>
Laboratorium Terpadu <br>
Institut Teknologi Kalimantan.
@endcomponent
