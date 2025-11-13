// import { gsap } from 'gsap';
// import { useGSAP } from '@gsap/react';
// import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
// import Header from '@/presentation/components/Header';
// import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
// import Table from '@/presentation/components/Table';
// import useTable from '@/application/hooks/useTable';
// import { useBooking } from '@/application/booking/hooks/useBooking';
// import { ReportBookingColumn } from './column/ReportBookingColumn';
// import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/presentation/components/ui/select';
// import { BookingType } from '@/domain/booking/BookingType';
// import { ReportBookingRoomColumn } from './column/ReportBookingRoomColumn';
// import ConfirmationDialog from '@/presentation/components/custom/ConfirmationDialog';

const BookingReportPage: React.FC = () => {
    // const sectionRef = useRef<HTMLDivElement | null>(null);

    // useGSAP(() => {
    //     if (!sectionRef.current) return;
    //     gsap.fromTo(sectionRef.current, { opacity: 0, y: 100 }, { opacity: 1, y: 0, duration: 0.75 });
    // }, []);

    // const {
    //     currentPage,
    //     perPage,
    //     totalPages,
    //     totalItems,
    //     searchTerm,
    //     setTotalPages,
    //     setTotalItems,
    //     setCurrentPage,
    //     handleSearch,
    //     handlePerPageChange,
    //     handlePageChange,
    // } = useTable();

    // const [selectedBookingType, setSelectedBookingType] = useState<BookingType>(BookingType.Room)
    // const handleFilterBooking = (e: ChangeEvent<HTMLSelectElement>) => {
    //     const value = e.target.value;

    //     setSelectedBookingType(value as BookingType);
    //     setCurrentPage(1);
    // }

    // const { booking, isLoading, getReportData } = useBooking({
    //     currentPage,
    //     perPage,
    //     searchTerm,
    //     setTotalPages,
    //     setTotalItems,
    //     bookingType: selectedBookingType
    // });

    // const [confirmOpen, setConfirmOpen] = useState(false)

    // // const handleConrfirm = () {

    // // }
    // useEffect(() => {
    //     getReportData();
    // }, [currentPage, perPage, selectedBookingType]);

    // useEffect(() => {
    //     const t = setTimeout(() => {
    //         if (currentPage === 1) getReportData(); else setCurrentPage(1);
    //     }, 400);
    //     return () => clearTimeout(t);
    // }, [searchTerm]);

    return (
        <>
            {/* <Header title="Laporan Peminjaman" />
            <div ref={sectionRef} className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Peminjaman</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="w-full mb-3 md:w-1/3">
                            <div className="relative">
                                <Select name='booking_type' onValueChange={(value) =>
                                    handleFilterBooking({
                                        target: {
                                            name: 'booking_type',
                                            value: value
                                        }
                                    } as React.ChangeEvent<HTMLSelectElement>)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Jenis Peminjaman" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Jenis Peminjaman</SelectLabel>
                                            <SelectItem value={BookingType.Room}>Peminjaman Ruangan</SelectItem>
                                            <SelectItem value={BookingType.RoomNEquipment}>Peminjaman Ruangan dan Alat</SelectItem>
                                            <SelectItem value={BookingType.Equipment}>Peminjamana Alat</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <ConfirmationDialog open={confirmOpen} onOpenChange={setConfirmOpen} onConfirm={handleConfirm} />
                        {selectedBookingType == BookingType.Room && (
                            <>
                            <Table 
                                    data={booking}
                                    columns={ReportBookingRoomColumn()}
                                    loading={isLoading}
                                    searchTerm={searchTerm}
                                    handleSearch={(e) => handleSearch(e)}
                                    perPage={perPage}
                                    handlePerPageChange={(e) => handlePerPageChange(e)}
                                    totalPages={totalPages}
                                    totalItems={totalItems}
                                    currentPage={currentPage}
                                    handlePageChange={handlePageChange}
                                />
                            </>
                        )}
                        {selectedBookingType == BookingType.RoomNEquipment && (
                            <>
                                <Table 
                                    data={booking}
                                    columns={ReportBookingColumn()}
                                    loading={isLoading}
                                    searchTerm={searchTerm}
                                    handleSearch={(e) => handleSearch(e)}
                                    perPage={perPage}
                                    handlePerPageChange={(e) => handlePerPageChange(e)}
                                    totalPages={totalPages}
                                    totalItems={totalItems}
                                    currentPage={currentPage}
                                    handlePageChange={handlePageChange}
                                />
                            </>
                        )}

                        {selectedBookingType == BookingType.Equipment && (
                            <>
                                <Table 
                                    data={booking}
                                    columns={ReportBookingColumn()}
                                    loading={isLoading}
                                    searchTerm={searchTerm}
                                    handleSearch={(e) => handleSearch(e)}
                                    perPage={perPage}
                                    handlePerPageChange={(e) => handlePerPageChange(e)}
                                    totalPages={totalPages}
                                    totalItems={totalItems}
                                    currentPage={currentPage}
                                    handlePageChange={handlePageChange}
                                />
                            </>
                        )}

                    </CardContent>
                </Card>
            </div> */}
        </>
    );
};

export default BookingReportPage;
