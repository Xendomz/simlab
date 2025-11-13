import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react'
import React, { useRef, useState } from 'react'
import Header from '@/presentation/components/Header';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';
import { Plus } from 'lucide-react';
import { BookingColumn } from './column/BookingColumn';
import Table from '@/presentation/components/Table';
import { NavLink } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/presentation/components/ui/tooltip';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/presentation/components/ui/select'
import { useBookingDataTable } from './hooks/useBookingDataTable';
import { useBooking } from './context/BookingContext';

const BookingPage = () => {
    const sectionRef = useRef<HTMLDivElement | null>(null)

    useGSAP(() => {
        if (!sectionRef.current) return

        const tl = gsap.timeline()
        tl.fromTo(sectionRef.current,
            {
                opacity: 0,
                y: 100
            },
            {
                opacity: 1,
                y: 0,
                duration: 1
            },
        )
    }, [])

    const [selectedStatus, setSelectedStatus] = useState<string>('')
    const handleFilterStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;

        setSelectedStatus(value);
        setCurrentPage(1);
    }

    const { isHasDraftBooking } = useBooking()

    const {
        bookings,
        isLoading,
        searchTerm,

        // TableHandler
        perPage,
        handleSearch,
        handlePageChange,
        handlePerPageChange,
        totalItems,
        totalPages,
        currentPage,
        setCurrentPage,
        refresh
    } = useBookingDataTable({ status: selectedStatus })

    return (
        <>
            <Header title="Menu Peminjaman" />
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0" ref={sectionRef}>
                <Card>
                    <CardHeader>
                        <CardTitle>Menu Peminjaman</CardTitle>
                        <CardAction>
                            {isHasDraftBooking ? (
                                <>
                                    <Tooltip>
                                        <TooltipTrigger className='cursor-not-allowed' asChild>
                                            <Button className={'opacity-50'}>
                                                Tambah
                                                <Plus />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Harap Selesaikan Peminjaman Sebelumnya</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </>
                            ) : (
                                <>
                                    <NavLink to={'/panel/peminjaman/create'}>
                                        <Button>
                                            Tambah
                                            <Plus />
                                        </Button>
                                    </NavLink>
                                </>
                            )}

                        </CardAction>
                    </CardHeader>
                    <CardContent>
                        <div className="w-full mb-3 md:w-1/3">
                            <div className="relative">
                                <Select name='filter_status' onValueChange={(value) =>
                                    handleFilterStatus({
                                        target: {
                                            name: 'filter_status',
                                            value: value
                                        }
                                    } as React.ChangeEvent<HTMLSelectElement>)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Status</SelectLabel>
                                            <SelectItem value=" ">All</SelectItem>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="rejected">Rejected</SelectItem>
                                            <SelectItem value="approved">Approved</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <Table
                            data={bookings}
                            columns={BookingColumn()}
                            loading={isLoading}
                            searchTerm={searchTerm}
                            handleSearch={(e) => handleSearch(e)}
                            perPage={perPage}
                            handlePerPageChange={(e) => handlePerPageChange(e)}
                            totalPages={totalPages}
                            totalItems={totalItems}
                            currentPage={currentPage}
                            handlePageChange={handlePageChange}
                            handleRefresh={refresh} />
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

export default BookingPage
