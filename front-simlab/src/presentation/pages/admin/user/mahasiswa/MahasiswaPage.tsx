import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import Table from '../../../../components/Table'
import { MahasiswaColumn } from './MahasiswaColumn'
import useTable from '@/application/hooks/useTable'
import { useUser } from '@/application/user/hooks/useUser'
// import { useStudyProgram } from '@/application/study-program/hooks/useStudyProgram'
import { toast } from 'sonner'
import Header from '@/presentation/components/Header'
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/presentation/components/ui/select'
import ConfirmationDialog from '@/presentation/components/custom/ConfirmationDialog'
import { StudyProgramService } from '@/application/study-program/StudyProgramService'
import { StudyProgramSelectView } from '@/application/study-program/StudyProgramSelectView'

const MahasiswaPage = () => {
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

    const studyProgramService = new StudyProgramService()
    const [studyPrograms, setStudyPrograms] = useState<StudyProgramSelectView[]>([])
    const [selectedStudyProgram, setSelectedStudyProgram] = useState<number>(0)

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

    const handleFilterStudyProgram = (e: ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;

        setSelectedStudyProgram(value ? Number(value) : 0);
        setCurrentPage(1);
    }

    const {
        user,
        isLoading,
        getData,
        remove
    } = useUser({
        currentPage,
        perPage,
        role: 'Mahasiswa',
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

    const handleDelete = async () => {
        if (!id) return
        const res = await remove(id)
        toast.success(res.message)

        getData()
        setConfirmOpen(false)
    }

    return (
        <>
            <Header title='Menu Mahasiswa' />
            <div className="flex flex-col gap-4 p-4 pt-0" ref={sectionRef}>
                <Card>
                    <CardHeader>
                        <CardTitle>Menu Mahasiswa</CardTitle>
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
                            columns={MahasiswaColumn({ openConfirm })}
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
            </div>
        </>
    )
}

export default MahasiswaPage
