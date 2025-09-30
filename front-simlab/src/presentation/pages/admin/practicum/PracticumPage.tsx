import { useEffect, useRef, useState } from "react"
import { gsap } from 'gsap';
import { useGSAP } from "@gsap/react"
import Table from "../../../components/Table";
import useTable from "@/application/hooks/useTable";
// import { useStudyProgram } from "@/application/study-program/hooks/useStudyProgram";
import Header from "@/presentation/components/Header";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/presentation/components/ui/card";
import { Button } from "@/presentation/components/ui/button";
import { Plus } from "lucide-react";
import { ModalType } from "@/shared/Types";
import { toast } from "sonner";
import ConfirmationDialog from "@/presentation/components/custom/ConfirmationDialog";
import { PracticumInputDTO } from "@/application/practicum/PracticumDTO";
import { PracticumColumn } from "./PracticumColumn";
import { StudyProgramService } from "@/application/study-program/StudyProgramService";
import { StudyProgramSelectView } from "@/application/study-program/StudyProgramSelectView";
import { PracticumService } from "@/application/practicum/PracticumService";
import { PracticumView } from "@/application/practicum/PracticumView";
import { Combobox } from "@/presentation/components/custom/combobox";
import PracticumFormDialog from "./components/PracticumFormDialog";

const PracticumPage = () => {
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

    const practicumService = new PracticumService()
    const [practicums, setPracticums] = useState<PracticumView[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const getData = async () => {
        setIsLoading(true)
        const response = await practicumService.getPracticalWorkData({
            page: currentPage,
            per_page: perPage,
            search: searchTerm,
            filter_study_program: selectedStudyProgram
        })
        setPracticums(response.data ?? [])
        setTotalItems(response.total ?? 0)
        setTotalPages(response.last_page ?? 0)
        setIsLoading(false)
    }

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

    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [id, setId] = useState<number | null>(null)
    const [type, setType] = useState<ModalType>('Add')
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

    const openModal = (modalType: ModalType, id: number | null = null) => {
        setType(modalType)
        setId(id)
        setIsOpen(true)
    }

    const openConfirm = (id: number) => {
        setId(id)
        setConfirmOpen(true)
    }

    const handleSave = async (formData: PracticumInputDTO): Promise<void> => {
        if (id) {
            const res = await practicumService.updateData(id, formData)
            toast.success(res.message)
        } else {
            const res = await practicumService.createData(formData)
            toast.success(res.message)
        }
        getData()
        setId(null)
        setIsOpen(false)
    }

    const handleDelete = async () => {
        if (!id) return
        const res = await practicumService.deleteData(id)
        toast.success(res.message)

        getData()
        setConfirmOpen(false)
    }

    return (
        <>
            <Header title="Menu Data Praktikum" />
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0" ref={sectionRef}>
                <Card>
                    <CardHeader>
                        <CardTitle>Menu Data Praktikum</CardTitle>
                        <CardAction>
                            <Button variant={"default"} onClick={() => openModal('Add')}>
                                Tambah
                                <Plus />
                            </Button>
                        </CardAction>
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
                            data={practicums}
                            columns={PracticumColumn({ openModal, openConfirm })}
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
            <ConfirmationDialog open={confirmOpen} onOpenChange={setConfirmOpen} onConfirm={handleDelete} />
            <PracticumFormDialog
                open={isOpen}
                onOpenChange={setIsOpen}
                data={practicums}
                studyProgram={studyPrograms}
                dataId={id}
                handleSave={handleSave}
                title={type == 'Add' ? 'Tambah data praktikum' : 'Edit data praktikum'}
            />
        </>
    )
}

export default PracticumPage