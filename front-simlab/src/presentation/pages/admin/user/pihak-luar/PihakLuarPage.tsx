// import { useGSAP } from '@gsap/react'
// import { gsap } from 'gsap'
// import { useEffect, useRef, useState } from 'react'
// import Table from '../../../../components/Table'
// import { PihakLuarColumn } from './PihakLuarColumn'
// import useTable from '@/application/hooks/useTable'
// import { useUser } from '@/application/user/hooks/useUser'
// import { toast } from 'sonner'
// import Header from '@/presentation/components/Header'
// import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card'
// import ConfirmationDialog from '@/presentation/components/custom/ConfirmationDialog'

const PihakLuarPage = () => {
    // const sectionRef = useRef<HTMLDivElement | null>(null)

    // useGSAP(() => {
    //     if (!sectionRef.current) return

    //     const tl = gsap.timeline()
    //     tl.fromTo(sectionRef.current,
    //         {
    //             opacity: 0,
    //             y: 100
    //         },
    //         {
    //             opacity: 1,
    //             y: 0,
    //             duration: 1
    //         },
    //     )
    // }, [])

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
    // } = useTable()

    // const {
    //     user,
    //     isLoading,
    //     getData,
    //     remove
    // } = useUser({
    //     currentPage,
    //     perPage,
    //     role: 'Pihak Luar',
    //     filter_study_program: 0,
    //     searchTerm,
    //     setTotalPages,
    //     setTotalItems
    // })

    // const [id, setId] = useState<number | null>(null)
    // const [confirmOpen, setConfirmOpen] = useState<boolean>(false)

    // useEffect(() => {
    //     getData()
    // }, [currentPage, perPage])

    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         if (currentPage === 1) {
    //             getData()
    //         } else {
    //             setCurrentPage(1)
    //         }
    //     }, 500)

    //     return () => clearTimeout(timer)
    // }, [searchTerm])

    // const openConfirm = (id: number) => {
    //     setId(id)
    //     setConfirmOpen(true)
    // }

    // const handleDelete = async () => {
    //     if (!id) return
    //     const res = await remove(id)
    //     toast.success(res.message)

    //     getData()
    //     setConfirmOpen(false)
    // }

    return (
        <>
            {/* <Header title='Menu Pihak Luar' />
            <div className="flex flex-col gap-4 p-4 pt-0" ref={sectionRef}>
                <Card>
                    <CardHeader>
                        <CardTitle>Menu Pihak Luar</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table
                            data={user}
                            columns={PihakLuarColumn({ openConfirm })}
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
                <ConfirmationDialog open={confirmOpen} onOpenChange={setConfirmOpen} onConfirm={handleDelete} />
            </div> */}
        </>
    )
}

export default PihakLuarPage
