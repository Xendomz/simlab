import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { useRef, useState, useEffect, ChangeEvent } from 'react'
import Header from '@/presentation/components/Header'
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import useTable from '@/application/hooks/useTable'
import { useUser } from '@/application/user/hooks/useUser'
import Table from '@/presentation/components/Table'
import { KoorprodiColumn } from './KoorprodiColumn'
import ConfirmationDialog from '@/presentation/components/custom/ConfirmationDialog'
import { toast } from 'sonner'
// import { useStudyProgram } from '@/application/study-program/hooks/useStudyProgram'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/presentation/components/ui/select'
import { StudyProgramService } from '@/application/study-program/StudyProgramService'
import { StudyProgramSelectView } from '@/application/study-program/StudyProgramSelectView'

const KoorprodiPage = () => {
    const sectionRef = useRef(null)

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

        const studyProgramService = new StudyProgramService()
        const [studyPrograms, setStudyPrograms] = useState<StudyProgramSelectView[]>([])
    
        useEffect(() => {
            const getStudyPrograms = async () => {
                const response = await studyProgramService.getDataForSelect()
                setStudyPrograms(response.data ?? [])
            }
    
            getStudyPrograms()
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

    const [selectedStudyProgram, setSelectedStudyProgram] = useState<number>(0)

    const handleFilterStudyProgram = (e: ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;

        setSelectedStudyProgram(value ? Number(value) : 0);
        setCurrentPage(1);
    }

    const {
        user,
        isLoading,
        getData,
        restoreToDosen
    } = useUser({
        currentPage,
        perPage,
        role: 'Koorprodi',
        filter_study_program: selectedStudyProgram,
        searchTerm,
        setTotalPages,
        setTotalItems
    })

    const [id, setId] = useState<number | null>(null)
    const [confirmOpen, setConfirmOpen] = useState<boolean>(false)

    useEffect(() => {
        getData()
    }, [currentPage, perPage, selectedStudyProgram])

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

    const openConfirm = (id: number) => {
        setId(id)
        setConfirmOpen(true)
    }

    const handleRestoreDosen = async () => {
        if (!id) return
        const res = await restoreToDosen(id)
        toast.success(res.message)

        getData()
        setConfirmOpen(false)
        setId(null)
    }

    return (
        <>
            <Header title='Menu Admin' />
            <div className="flex flex-col gap-4 p-4 pt-0" ref={sectionRef}>
                <Card>
                    <CardHeader>
                        <CardTitle>Menu Admin</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="w-full mb-3 md:w-1/3">
                            <div className="relative">
                                <Select name='filter_prodi' onValueChange={(value) =>
                                    handleFilterStudyProgram({
                                        target: {
                                            name: 'filter_prodi',
                                            value: value
                                        }
                                    } as React.ChangeEvent<HTMLSelectElement>)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih Program Studi" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Program Studi</SelectLabel>
                                            <SelectItem value=" ">All</SelectItem>
                                            {studyPrograms?.map((option) => (
                                                <SelectItem key={option.id} value={option.id.toString()}>{option.name}</SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <Table
                            data={user}
                            columns={KoorprodiColumn({ openConfirm })}
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
                <ConfirmationDialog open={confirmOpen} onOpenChange={setConfirmOpen} onConfirm={handleRestoreDosen} />
            </div>

            {/* <AdminFormDialog
                open={isOpen}
                onOpenChange={setIsOpen}
                data={user}
                dataId={id}
                handleSave={handleSave}
                title={type == 'Add' ? 'Tambah Petugas Laboran' : 'Edit Petugas Laboran'}
            /> */}
        </>
    )
}

export default KoorprodiPage