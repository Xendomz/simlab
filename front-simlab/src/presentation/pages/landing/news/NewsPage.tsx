import { useEffect, useRef } from 'react'
import Header from '../components/Header';

const NewsPage = () => {
    const contentRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "auto" });

        if (!contentRef.current) return;
    }, []);
    return (
        <>
            <div className='min-h-screen' style={{ fontFamily: 'Montserrat, sans-serif' }}>
                <Header className='fixed top-0 left-0 w-full z-50' />
                <div className='flex flex-col gap-5'>
                    <div className='mt-[82px] flex items-center py-10 relative min-h-[400px] px-10 xl:px-32 gap-20 bg-cover bg-[url("https://i0.wp.com/mahasiswaupdate.com/wp-content/uploads/2024/04/akreditasi-jurusan-itk.webp?fit=980%2C551&ssl=1")]'>
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black opacity-30 z-0"></div>


                        <div className="relative z-10 flex flex-col col-span-2 md:col-span-1 md:py-24 gap-10 justify-center mx-auto">
                            <div className='flex flex-col gap-2 text-center'>
                                <h1 className='text-white text-6xl font-bold leading-tight text-shadow-2xs'>Berita</h1>
                            </div>
                        </div>

                    </div>
                    <div className='px-10 xl:px-32 grid grid-cols-1 lg:grid-cols-8 gap-20 py-14'>
                        <div className='grid grid-cols-3 mx-auto lg:col-span-6 gap-10'>
                            {[...Array(6)].map((_, idx) => (
                                <div key={idx} className="min-h-32 w-full md:basis-1/3 lg:basis-1/4 bg-white rounded-lg text-secondary font-medium shadow-xl flex flex-col items-center gap-3">
                                    <div className='relative w-full rounded-t-lg'>
                                        <div className="absolute inset-0 bg-black opacity-10 z-0 rounded-t-lg"></div>
                                        <img src="https://labterpadu.itk.ac.id/images/news/1618455634new3.jpg" className='object-cover rounded-t-lg w-full' alt="" />
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
                        </div>
                        <div className='flex flex-col gap-5 lg:col-span-2'>
                            <div className='p-5 bg-[#e8ad38] rounded-lg'>
                                <span className='text-white font-bold text-xl'>Berita Terkini</span>
                            </div>
                            <div className='flex flex-col gap-10'>
                                {[...Array(3)].map((_, idx) => (
                                    <div key={idx} className='text-secondary flex flex-col lg:grid lg:grid-cols-3 gap-2'>
                                        <img src="https://labterpadu.itk.ac.id/images/news/1618455634new3.jpg" className='w-full h-full object-cover rounded-lg' alt="" />
                                        <div className='col-span-2'>
                                            <span className='text-xs'>Friday, 17 May 2024</span>
                                            <span className='font-semibold text-lg line-clamp-2 text-black'>
                                                Menteri Keuangan Tandatangani Prasasti Aset (SBSN) Proyek Kalimantan Timur di Gedung Pusat Laboratorirum Terpadu Institut Teknologi Kalimantan
                                            </span>
                                            <span className='line-clamp-2 text-sm text-ellipsis overflow-hidden whitespace-nowraptruncate'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Esse doloribus vel incidunt dolor quo corporis fugiat impedit corrupti, adipisci similique in necessitatibus quae aut cupiditate reprehenderit excepturi possimus nihil voluptatem!</span>
                                        </div>
                                    </div>
                                ))}

                            </div>
                        </div>
                    </div>
                    <div className='min-h-[420px] bg-[#e8ad38] px-10 xl:px-32 flex flex-col md:flex-row justify-between py-20 gap-10 md:gap-0 md:py-0'>
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
        </>
    )
}

export default NewsPage