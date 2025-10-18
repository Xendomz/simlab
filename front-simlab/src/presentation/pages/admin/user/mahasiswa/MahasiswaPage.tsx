import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { useEffect, useRef, useState } from 'react'
import Table from '../../../../components/Table'
import { MahasiswaColumn } from './MahasiswaColumn'
import useTable from '@/application/hooks/useTable'
import { toast } from 'sonner'
import Header from '@/presentation/components/Header'
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import ConfirmationDialog from '@/presentation/components/custom/ConfirmationDialog'
import { StudyProgramService } from '@/application/study-program/StudyProgramService'
import { StudyProgramSelectView } from '@/application/study-program/StudyProgramSelectView'
import { Combobox } from '@/presentation/components/custom/combobox'
import { useDebounce } from '@/presentation/hooks/useDebounce'
import { UserService } from '@/application/user/UserService'
import { UserView } from '@/application/user/UserView'
import { userRole } from '@/domain/User/UserRole'

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

    const userService = new UserService()
    const [users, setUsers] = useState<UserView[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const getData = async () => {
        setIsLoading(true)
        const response = await userService.getUserData({
            page: currentPage,
            per_page: perPage,
            search: searchTerm,
            filter_study_program: selectedStudyProgram,
            role: userRole.Mahasiswa
        })
        setUsers(response.data ?? [])
        setTotalPages(response.last_page ?? 0)
        setTotalItems(response.total ?? 0)
        setIsLoading(false)
    }

    const debounceSearchTerm = useDebounce(searchTerm, 500)
    useEffect(() => {
        getData();
    }, [currentPage, perPage, selectedStudyProgram, debounceSearchTerm]);

    useEffect(() => {
        setCurrentPage(1);
    }, [debounceSearchTerm]);

    const [id, setId] = useState<number | null>(null)
    const [confirmOpen, setConfirmOpen] = useState<boolean>(false)

    const openConfirm = (id: number) => {
        setId(id)
        setConfirmOpen(true)
    }

    const handleDelete = async () => {
        if (!id) return
        const res = await userService.deleteData(id)
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
                                <Combobox
                                    options={studyPrograms}
                                    value={selectedStudyProgram?.toString() || ''}
                                    onChange={(val) => {
                                        setSelectedStudyProgram(val ? Number(val) : 0)
                                        setCurrentPage(1)
                                    }}
                                    placeholder="Pilih Prodi"
                                    optionLabelKey='name'
                                    optionValueKey='id'
                                    isFilter
                                />
                            </div>
                        </div>
                        <Table
                            data={users}
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
