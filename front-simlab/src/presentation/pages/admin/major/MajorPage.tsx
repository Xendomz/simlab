import { useRef, useState } from "react"
import { gsap } from 'gsap';
import { useGSAP } from "@gsap/react"
import Table from "../../../components/Table";
import { MajorColumn } from "./MajorColumn";
import { ModalType } from "../../../../shared/Types";
import Header from "@/presentation/components/Header";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/presentation/components/ui/card";
import { Button } from "@/presentation/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import ConfirmationDialog from "@/presentation/components/custom/ConfirmationDialog";
import MajorFormDialog from "./components/MajorFormDialog";
import { MajorInputDTO } from "@/application/major/MajorDTO";
import { Combobox } from "@/presentation/components/custom/combobox";
import { useFacultySelect } from "../faculty/hooks/useFacultySelect";
import { useDepedencies } from "@/presentation/contexts/useDepedencies";
import { useMajorDataTable } from "./hooks/useMajorDataTable";

const MajorPage = () => {
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

    const { faculties, selectedFaculty, setSelectedFaculty } = useFacultySelect()

    const { majorService } = useDepedencies()
    const {
        majors,
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
    } = useMajorDataTable({ filter_faculty: selectedFaculty })

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

    const handleSave = async (formData: MajorInputDTO): Promise<void> => {
        if (id) {
            const res = await majorService.updateData(id, formData)
            toast.success(res.message)
        } else {
            const res = await majorService.createData(formData)
            toast.success(res.message)
        }
        refresh()
        setIsOpen(false)
    }

    const handleDelete = async () => {
        if (!id) return
        const res = await majorService.deleteData(id)
        toast.success(res.message)

        refresh()
        setConfirmOpen(false)
    }

    return (
        <>
            <Header title="Menu Jurusan" />
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0" ref={sectionRef}>
                <Card>
                    <CardHeader>
                        <CardTitle>Menu Jurusan</CardTitle>
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
                                    options={faculties}
                                    value={selectedFaculty?.toString() || ''}
                                    onChange={(val) => {
                                        setSelectedFaculty(val ? Number(val) : 0)
                                        setCurrentPage(1)
                                    }}
                                    placeholder="Pilih Fakultas"
                                    optionLabelKey='name'
                                    optionValueKey='id'
                                    isFilter
                                />
                            </div>
                        </div>
                        <Table
                            data={majors}
                            columns={MajorColumn({ openModal, openConfirm })}
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
            <MajorFormDialog
                open={isOpen}
                onOpenChange={setIsOpen}
                data={majors}
                dataId={id}
                faculties={faculties}
                handleSave={handleSave}
                title={type == 'Add' ? 'Tambah Jurusan' : 'Edit Jurusan'}
            />
        </>
    )
}

export default MajorPage