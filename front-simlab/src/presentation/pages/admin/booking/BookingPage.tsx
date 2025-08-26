import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react'
import React, { useEffect, useRef } from 'react'
import useTable from '@/application/hooks/useTable';
import { useBooking } from '@/application/booking/hooks/useBooking';
import Header from '@/presentation/components/Header';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';
import { Plus } from 'lucide-react';
import { BookingColumn } from './column/BookingColumn';
import Table from '@/presentation/components/Table';
import { NavLink } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/presentation/components/ui/tooltip';

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

    const {
        currentPage,
        perPage,
        totalPages,
        totalItems,
        searchTerm,

        setTotalPages,
        setTotalItems,
        setCurrentPage,

        handleSearch,
        handlePerPageChange,
        handlePageChange,
    } = useTable()

    const {
        booking,
        isLoading,
        getData,
        isStillHaveDraftBooking,
        isHasDraftBooking
    } = useBooking({
        currentPage,
        perPage,
        searchTerm,
        setTotalPages,
        setTotalItems
    })

    useEffect(() => {
        getData()
    }, [currentPage, perPage])

    useEffect(() => {
        isStillHaveDraftBooking()
    }, [])

    useEffect(() => {
        const timer = setTimeout(() => {
            if (currentPage === 1) {
                getData()
            } else {
                setCurrentPage(1)
            }
        }, 500)

        return () => clearTimeout(timer)
    }, [searchTerm])

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
                        <Table
                            data={booking}
                            columns={BookingColumn()}
                            loading={isLoading}
                            searchTerm={searchTerm}
                            handleSearch={(e) => handleSearch(e)}
                            perPage={perPage}
                            handlePerPageChange={(e) => handlePerPageChange(e)}
                            totalPages={totalPages}
                            totalItems={totalItems}
                            currentPage={currentPage}
                            handlePageChange={handlePageChange} />
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

export default BookingPage
