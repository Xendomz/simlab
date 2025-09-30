import { useEffect, useRef, useState } from "react"
import { gsap } from 'gsap';
import { useGSAP } from "@gsap/react"
import Table from "../../../components/Table";
import { StudyProgramColumn } from "./StudyProgramColumn";
import useTable from "../../../../application/hooks/useTable";
import { ModalType } from "../../../../shared/Types";
import Header from "@/presentation/components/Header";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/presentation/components/ui/card";
import { Button } from "@/presentation/components/ui/button";
import { Plus } from "lucide-react";
import ConfirmationDialog from "@/presentation/components/custom/ConfirmationDialog";
import { toast } from "sonner";
import { StudyProgramInputDTO } from "@/application/study-program/StudyProgramDTO";
import StudyProgramFormDialog from "./components/StudyProgramFormDialog";
import { MajorService } from "@/application/major/MajorService";
import { MajorSelectView } from "@/application/major/MajorSelectView";
import { StudyProgramView } from "@/application/study-program/StudyProgramView";
import { StudyProgramService } from "@/application/study-program/StudyProgramService";
import { Combobox } from "@/presentation/components/custom/combobox";

const StudyProgramPage = () => {
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

    const majorService = new MajorService()
    const [majors, setMajors] = useState<MajorSelectView[]>([])
    const [selectedMajor, setSelectedMajor] = useState<number>(0)

    useEffect(() => {
        const getMajors = async () => {
            const response = await majorService.getDataForSelect()
            setMajors(response.data ?? [])
        }

        getMajors()
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

    const studyProgramService = new StudyProgramService()
    const [studyPrograms, setStudyPrograms] = useState<StudyProgramView[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const getData = async () => {
        setIsLoading(true)
        const response = await studyProgramService.getStudyProgramData({
            page: currentPage,
            per_page: perPage,
            search: searchTerm,
            filter_major: selectedMajor
        })
        setStudyPrograms(response.data ?? [])
        setTotalItems(response.total ?? 0)
        setTotalPages(response.last_page ?? 0)
        setIsLoading(false)
    }

    useEffect(() => {
        getData()
    }, [currentPage, perPage, selectedMajor])

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
    }, [currentPage, perPage, selectedMajor])

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

    const handleSave = async (formData: StudyProgramInputDTO): Promise<void> => {
        if (id) {
            const res = await studyProgramService.updateData(id, formData)
            toast.success(res.message)
        } else {
            const res = await studyProgramService.createData(formData)
            toast.success(res.message)
        }
        getData()
        setId(null)
        setIsOpen(false)
    }

    const handleDelete = async () => {
        if (!id) return
        const res = await studyProgramService.deleteData(id)
        toast.success(res.message)

        getData()
        setConfirmOpen(false)
    }

    return (
        <>
            <Header title="Menu Program Studi" />
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0" ref={sectionRef}>
                <Card>
                    <CardHeader>
                        <CardTitle>Menu Program Studi</CardTitle>
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
                                    options={majors}
                                    value={selectedMajor?.toString() || ''}
                                    onChange={(val) => {
                                        setSelectedMajor(val ? Number(val) : 0)
                                        setCurrentPage(1)
                                    }}
                                    placeholder="Pilih Jurusan"
                                    optionLabelKey='name'
                                    optionValueKey='id'
                                    isFilter
                                />
                            </div>
                        </div>
                        <Table
                            data={studyPrograms}
                            columns={StudyProgramColumn({ openModal, openConfirm })}
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
            <StudyProgramFormDialog
                open={isOpen}
                onOpenChange={setIsOpen}
                data={studyPrograms}
                majors={majors}
                dataId={id}
                handleSave={handleSave}
                title={type == 'Add' ? 'Tambah program studi' : 'Edit program studi'}
            />
        </>
    )
}

export default StudyProgramPage