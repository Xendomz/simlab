@component('mail::message')
# Yth. Pemohon {{$requestor->name}}

Menanggapi permohonan anda yang diajukan pada {{$booking->created_at->format('Y-m-d H:i')}} WITA yang berkaitan dengan Peminjaman Ruangan di Laboratorium Terpadu, kami memutuskan bahwa: <br>
<i>Permohonan Pengajuan Peminjaman Ruangan Laboratorium anda kami "<b>TOLAK</b>" dengan alasan: "<b><i>{{$information}}</i></b>"</i> <br> <br>

Terima Kasih,<br> <br><br> <br>
Laboratorium Terpadu <br>
Institut Teknologi Kalimantan.
@endcomponent
