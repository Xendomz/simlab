import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react'
import useTable from '@/application/hooks/useTable';
import Header from '@/presentation/components/Header';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';
import { Plus } from 'lucide-react';
import Table from '@/presentation/components/Table';
import { NavLink } from 'react-router-dom';
import { PracticumSchedulingColumn } from './column/PracticumSchedulingColumn';
import { useEffect, useRef, useState } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/presentation/components/ui/tooltip';
import { PracticumSchedulingView } from '@/application/practicum-scheduling/PracticumSchedulingView';
import { usePracticumScheduling } from './context/PracticumSchedulingContext';
import { useDebounce } from '@/presentation/hooks/useDebounce';
import { useDepedencies } from '@/presentation/contexts/useDepedencies';

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

    const { isHasDraftPracticum } = usePracticumScheduling()

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

    const { practicumSchedulingService } = useDepedencies()
    const [practicumSchedulings, setPracticumScheduling] = useState<PracticumSchedulingView[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const getData = async () => {
        setIsLoading(true)
        const response = await practicumSchedulingService.getPracticumSchedulingData({
            page: currentPage ?? 1,
            per_page: perPage ?? 10,
            search: searchTerm ?? ""
        })

        setPracticumScheduling(response.data ?? [])
        setTotalPages(response.last_page ?? 0)
        setTotalItems(response.total ?? 0)
        setIsLoading(false)
    }

    const debounceSearchTerm = useDebounce(searchTerm, 500)
    useEffect(() => {
        getData();
    }, [currentPage, perPage, debounceSearchTerm]);

    useEffect(() => {
        setCurrentPage(1);
    }, [debounceSearchTerm]);

    return (
        <>
            <Header title="Menu Penjadwalan Praktikum" />
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0" ref={sectionRef}>
                <Card>
                    <CardHeader>
                        <CardTitle>Menu Penjadwalan Praktikum</CardTitle>
                        <CardAction>
                            {isHasDraftPracticum ? (
                                <Tooltip>
                                    <TooltipTrigger className='cursor-not-allowed' asChild>
                                        <Button className={'opacity-50'}>
                                            Tambah
                                            <Plus />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Harap Selesaikan Pengajuan Sebelumnya</p>
                                    </TooltipContent>
                                </Tooltip>
                            ) : (
                                <>
                                    <NavLink to={'/panel/penjadwalan-praktikum/create'}>
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
                            data={practicumSchedulings}
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
