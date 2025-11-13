import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react'
import Header from '@/presentation/components/Header'
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { useRef } from 'react'
import { usePracticumSchedulingByLecturerDataTable } from './hooks/usePracticumSchedulingByLecturerDataTable';
import Table from '@/presentation/components/Table';
import { PracticumSchedulingByLecturerColumn } from './column/PracticumSchedulingByLecturerColumn';

const PracticumSchedulingTeachingListPage = () => {
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
        practicumSchedulings,
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
    } = usePracticumSchedulingByLecturerDataTable()

    return (
        <>
            <Header title="Menu Penjadwalan Praktikum" />
            <div className="flex flex-1 flex-col gap-4 p-4" ref={sectionRef}>
                <Card>
                    <CardHeader>
                        <CardTitle>Menu Penjadwalan Praktikum</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table
                            data={practicumSchedulings}
                            columns={PracticumSchedulingByLecturerColumn()}
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

export default PracticumSchedulingTeachingListPage