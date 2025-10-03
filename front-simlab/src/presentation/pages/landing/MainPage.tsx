import { NavLink } from 'react-router-dom'
import Header from './components/Header'

const MainPage = () => {
    return (
        <div className='min-h-screen' style={{ fontFamily: 'Montserrat, sans-serif' }}>
            <Header className='fixed top-0 left-0 w-full z-50' />
            <div className='flex flex-col gap-32'>
                <div className='mt-[82px] py-10 relative min-h-[calc(100vh-82px)] px-10 xl:px-32 grid grid-cols-1 md:grid-cols-2 gap-20 bg-cover bg-[url("https://i0.wp.com/mahasiswaupdate.com/wp-content/uploads/2024/04/akreditasi-jurusan-itk.webp?fit=980%2C551&ssl=1")]'>
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black opacity-50 z-0"></div>

                    <div className='order-1 md:order-2 relative z-10 md:py-36 flex items-center justify-center w-full'>
                        <img
                            src="https://itk.ac.id/assets/image/Logo_ITK.webp"
                            className="w-[80%]"
                            alt="ITK Logo"
                        />
                    </div>

                    <div className="order-2 md:order-1 relative z-10 flex flex-col col-span-2 md:col-span-1 md:py-36 gap-10 justify-center">
                        <div className='flex flex-col gap-1'>
                            <h1 className='text-white text-4xl md:text-6xl font-bold leading-tight text-shadow-2xs'>Laboratorium Terpadu <br /> ITK</h1>
                            <h2 className='text-white text-xl font-semibold'>Institut Teknologi Kalimantan</h2>
                        </div>

                        <p className='text-sm text-white leading-7'>Pusat Laboratorium Terpadu ITK adalah unit pusat yang mengelola seluruh fasilitas laboratorium di Institut Teknologi Kalimantan. Fungsinya adalah untuk mendukung kegiatan praktikum mahasiswa, penelitian dosen, serta menyediakan jasa pengujian dan riset bagi industri dan masyarakat umum.</p>
                    </div>

                </div>
                <div className='px-10 xl:px-32'>
                    <div className='text-white px-5 py-10 md:p-20 grid grid-cols-1 md:grid-cols-2 gap-20 bg-gradient-to-b md:bg-gradient-to-r from-warning via-secondary to-secondary rounded-2xl shadow-lg hover:scale-105 transition-all  duration-200 ease-linear'>
                        <div className='flex flex-col gap-5'>
                            <span className='text-5xl font-bold'>
                                Visi
                            </span>
                            <span className='text-sm leading-7'>
                                Menjadi pusat layanan laboratorium di Kalimantan yang unggul dan profesional dalam mendukung penyelenggaraan tridharma perguruan tinggi dan layanan pengujian berstandar ISO 17025:2017
                            </span>
                        </div>
                        <div className='flex flex-col gap-5'>
                            <span className='text-5xl font-bold'>
                                Misi
                            </span>
                            <ul className='flex flex-col gap-3 text-sm leading-7 list-disc'>
                                <li>
                                    Menyediakan layanan laboratorium yang profesional untuk kegiatan pendidikan, termasuk praktikum dan peminjaman ruang/alat laboratorium untuk penelitian dan pengabdian kepada masyarakat.
                                </li>
                                <li>
                                    Menyediakan layanan pengujian berstandar ISO17025:2017 untuk universitas dan industri sekitar.
                                </li>
                                <li>
                                    Mengedepankan kesehatan dan keselamatan kerja dalam pelaksanaan layanan laboratorium.
                                </li>
                                <li>
                                    Memanfaatkan teknologi informasi untuk pengendalian data dan pelayanan laboratorium yang modern.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className='min-h-[420px] px-10 xl:px-32 flex flex-col gap-20'>
                    <div className='flex flex-col gap-1 w-fit mx-auto'>
                        <span className='text-4xl font-semibold'>Layanan Kami</span>
                        <div className='w-full h-2 bg-gradient-to-r from-warning to-[#0a61aa] rounded-lg'></div>
                    </div>
                    <div className="flex flex-wrap justify-center rounded-lg gap-10">
                        <div className="min-h-32 w-full md:basis-1/3 lg:basis-1/4 p-8 bg-white border border-gray-100 rounded-lg text-warning text-center font-medium shadow-xl flex flex-col items-center justify-center gap-8 hover:scale-105 transition-all">
                            <div className='size-20 rounded-full bg-warning'>

                            </div>
                            Layanan Peminjaman Laboratorium
                        </div>
                        <div className="min-h-32 w-full md:basis-1/3 lg:basis-1/4 p-8 bg-white border border-gray-100 rounded-lg text-warning text-center font-medium shadow-xl flex flex-col items-center justify-center gap-8 hover:scale-105 transition-all">
                            <div className='size-20 rounded-full bg-warning'>

                            </div>
                            Layanan Penelitian
                        </div>
                        <div className="min-h-32 w-full md:basis-1/3 lg:basis-1/4 p-8 bg-white border border-gray-100 rounded-lg text-warning text-center font-medium shadow-xl flex flex-col items-center justify-center gap-8 hover:scale-105 transition-all">
                            <div className='size-20 rounded-full bg-warning'>

                            </div>
                            Layanan Pengujian
                        </div>
                        <div className="min-h-32 w-full md:basis-1/3 lg:basis-1/4 p-8 bg-white border border-gray-100 rounded-lg text-warning text-center font-medium shadow-xl flex flex-col items-center justify-center gap-8 hover:scale-105 transition-all">
                            <div className='size-20 rounded-full bg-warning'>

                            </div>
                            Pengabdian Masyarakat
                        </div>
                    </div>
                </div>
                <div className='min-h-[400px] px-10 xl:px-32 flex flex-col gap-20 py-20 bg-secondary'>
                    <div className='flex flex-col gap-1 w-fit mx-auto'>
                        <span className='text-4xl font-semibold text-white'>Layanan Kami</span>
                        <div className='w-full h-2 bg-white rounded-lg'></div>
                    </div>
                    <div className="flex flex-wrap justify-center rounded-lg gap-10">
                        {[...Array(6)].map((_, idx) => (
                            <div key={idx} className="min-h-32 w-full md:basis-1/3 lg:basis-1/4 bg-white  rounded-lg text-warning text-center font-medium shadow-xl flex flex-col items-center hover:scale-105 transition-all">
                                <div className='relative w-full rounded-t-lg'>
                                    <div className="absolute inset-0 bg-black opacity-10 z-0"></div>
                                    <img src="https://labterpadu.itk.ac.id/Alat%20Laboratorium/gambar_alat.jpg" className='aspect-[4/3] object-cover rounded-t-lg' alt="" />
                                </div>
                                <div className='flex flex-col gap-2 p-5'>
                                    <span className='font-semibold text-lg line-clamp-2 text-primary'>
                                        Oven pengeringan
                                    </span>
                                    <span className='text-warning line-clamp-3 text-sm text-ellipsis overflow-hidden whitespace-nowraptruncate'>Labter 1 - Lab. Termal (R109)</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <NavLink to={'/'} className="mx-auto bg-white rounded-lg px-5 py-2 text-secondary font-semibold hover:bg-warning hover:text-secondary transition-colors duration-300 shadow-lg w-fit">
                        Selengkapnya
                    </NavLink>
                </div>

                <div className='min-h-[400px] px-10 xl:px-32 flex flex-col gap-20 py-20'>
                    <div className='flex flex-col gap-1 w-fit mx-auto'>
                        <span className='text-4xl font-semibold'>Berita Terkini</span>
                        <div className='w-full h-2 bg-warning rounded-lg'></div>
                    </div>
                    <NavLink to={'/berita/test'} className="flex flex-wrap justify-center rounded-lg gap-10">
                        {[...Array(6)].map((_, idx) => (
                            <div key={idx} className="min-h-32 w-full md:basis-1/3 lg:basis-1/4 bg-white rounded-lg text-secondary font-medium shadow-xl flex flex-col items-center gap-3 hover:scale-105 transition-all">
                                <div className='relative w-full rounded-t-lg'>
                                    <div className="absolute inset-0 bg-black opacity-10 z-0 rounded-t-lg"></div>
                                    <img src="https://labterpadu.itk.ac.id/images/news/1618455634new3.jpg" className='aspect-[4/3] object-cover rounded-t-lg' alt="" />
                                </div>
                                <div className='flex flex-col gap-2 p-5'>
                                    <span className='text-xs'>Friday, 17 May 2024</span>
                                    <span className='font-semibold text-lg line-clamp-2 text-black'>
                                        Menteri Keuangan Tandatangani Prasasti Aset (SBSN) Proyek Kalimantan Timur di Gedung Pusat Laboratorirum Terpadu Institut Teknologi Kalimantan
                                    </span>
                                    <span className='line-clamp-3 text-sm text-ellipsis overflow-hidden whitespace-nowraptruncate'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Esse doloribus vel incidunt dolor quo corporis fugiat impedit corrupti, adipisci similique in necessitatibus quae aut cupiditate reprehenderit excepturi possimus nihil voluptatem!</span>
                                </div>
                            </div>
                        ))}
                    </NavLink>
                    <NavLink to={'/'} className="mx-auto bg-secondary rounded-lg px-5 py-2 text-warning font-semibold hover:bg-warning hover:text-white transition-colors duration-300 shadow-lg w-fit">
                        Selengkapnya
                    </NavLink>
                </div>
                <div className='min-h-[420px] bg-warning px-10 xl:px-24 flex flex-col md:flex-row justify-between py-20 gap-10 md:gap-0 md:py-0'>
                    <img src="https://itk.ac.id/assets/image/Logo_ITK_White.webp" className='w-64 object-contain h-auto' />
                    <div className='flex flex-col gap-10 text-white py-0 md:py-20'>
                        <span className='font-semibold text-3xl'>Kontak</span>
                        <div className=' text-sm flex flex-col gap-2'>
                            <div className='flex gap-2'>
                                <span className='font-semibold'>Email: </span>
                                labterpadu@itk.ac.id
                            </div>
                            <div className='flex gap-2'>
                                <span className='font-semibold'>Alamat: </span>
                                Soekarno-Hatta Km.15, Karang Joang, Balikpapan 76127.
                            </div>
                            <div className='flex gap-2'>
                                <span className='font-semibold'>Telepon: </span>
                                0542-8530800
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-10 text-white py-0 md:py-20">
                        <span className='font-semibold text-3xl'>Alamat</span>
                        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.0141114578028!2d116.85934571475377!3d-1.15041039916087!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2df149298f826ab5%3A0x8489d5309f45c0db!2sKalimantan%20Institute%20of%20Technology!5e0!3m2!1sen!2sid!4v1618368109530!5m2!1sen!2sid" width="100%" height="200px" loading="lazy"></iframe>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MainPage