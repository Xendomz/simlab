import { useRef, useState } from "react"
import { gsap } from 'gsap';
import { useGSAP } from "@gsap/react"
import Table from "../../../components/Table";
import { StudyProgramColumn } from "./StudyProgramColumn";
import { ModalType } from "../../../../shared/Types";
import Header from "@/presentation/components/Header";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/presentation/components/ui/card";
import { Button } from "@/presentation/components/ui/button";
import { Plus } from "lucide-react";
import ConfirmationDialog from "@/presentation/components/custom/ConfirmationDialog";
import { toast } from "sonner";
import { StudyProgramInputDTO } from "@/application/study-program/StudyProgramDTO";
import StudyProgramFormDialog from "./components/StudyProgramFormDialog";
import { Combobox } from "@/presentation/components/custom/combobox";
import { useDepedencies } from "@/presentation/contexts/useDepedencies";
import { useStudyProgramDataTable } from "./hooks/useStudyProgramDataTable";
import { useMajorSelect } from "../major/hooks/useMajorSelect";

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

    const { majors, selectedMajor,  setSelectedMajor}  = useMajorSelect()

    const { studyProgramService } = useDepedencies()
    const {
        studyPrograms,
        isLoading,
        searchTerm,
        refresh,

        // TableHandler
        perPage,
        handleSearch,
        handlePageChange,
        handlePerPageChange,
        totalItems,
        totalPages,
        currentPage,
        setCurrentPage
    } = useStudyProgramDataTable({ filter_major: selectedMajor })

    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [id, setId] = useState<number | null>(null)
    const [type, setType] = useState<ModalType>('Add')
    const [confirmOpen, setConfirmOpen] = useState<boolean>(false)

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
        refresh()
        setId(null)
        setIsOpen(false)
    }

    const handleDelete = async () => {
        if (!id) return
        const res = await studyProgramService.deleteData(id)
        toast.success(res.message)

        refresh()
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