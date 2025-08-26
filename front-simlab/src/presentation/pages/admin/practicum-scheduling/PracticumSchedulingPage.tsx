import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react'
import useTable from '@/application/hooks/useTable';
import Header from '@/presentation/components/Header';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';
import { Plus } from 'lucide-react';
import Table from '@/presentation/components/Table';
import { NavLink } from 'react-router-dom';
import { usePracticumScheduling } from '@/application/practicum-scheduling/hooks/usePracticumScheduling';
import { PracticumSchedulingColumn } from './column/PracticumSchedulingColumn';
import { useEffect, useRef } from 'react';

const PracticumSchedulingPage = () => {
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
        practicumScheduling,
        isLoading,
        getData,
    } = usePracticumScheduling({
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
            <Header title="Menu Penjadwalan Praktikum" />
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0" ref={sectionRef}>
                <Card>
                    <CardHeader>
                        <CardTitle>Menu Penjadwalan Praktikum</CardTitle>
                        <CardAction>
                            <>
                                <NavLink to={'/panel/penjadwalan-praktikum/create'}>
                                    <Button>
                                        Tambah
                                        <Plus />
                                    </Button>
                                </NavLink>
                            </>

                        </CardAction>
                    </CardHeader>
                    <CardContent>
                        <Table
                            data={practicumScheduling}
                            columns={PracticumSchedulingColumn()}
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

export default PracticumSchedulingPage
