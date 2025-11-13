import { useRef, useState } from "react"
import { gsap } from 'gsap';
import { useGSAP } from "@gsap/react"
import Table from "../../../components/Table";
import { LaboratoryMaterialColumn } from "./LaboratoryMaterialColumn";
import { ModalType } from "@/shared/Types";
import { toast } from "sonner";
import { LaboratoryMaterialInputDTO } from "@/application/laboratory-material/LaboratoryMaterialDTO";
import Header from "@/presentation/components/Header";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/presentation/components/ui/card";
import { Button } from "@/presentation/components/ui/button";
import { Plus } from "lucide-react";
import ConfirmationDialog from "@/presentation/components/custom/ConfirmationDialog";
import LaboratoryMaterialFormDialog from "./components/LaboratoryMaterialFormDialog";
import { Combobox } from "@/presentation/components/custom/combobox";
import LaboratoryMaterialDetailDialog from "./components/LaboratoryMaterialDetailDialog";
import { useLaboratoryRoomSelect } from "../laboratory-room/hooks/useLaboratoryRoomSelect";
import { useDepedencies } from "@/presentation/contexts/useDepedencies";
import { useLaboratoryMaterialDataTable } from "./hooks/useLaboratoryMaterialDataTable";

const LaboratoryMaterialPage = () => {
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

    const { laboratoryRooms, selectedLaboratoryRoom, setSelectedLaboratoryRoom } = useLaboratoryRoomSelect()

    const { laboratoryMaterialService } = useDepedencies()
    const {
        laboratoryMaterials,
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
    } = useLaboratoryMaterialDataTable({ filter_laboratory_room: selectedLaboratoryRoom })

    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false)
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

    const openModalDetail = (id: number) => {
        setId(id)
        setIsDetailOpen(true)
    }

    const handleSave = async (formData: LaboratoryMaterialInputDTO): Promise<void> => {
        if (id) {
            const res = await laboratoryMaterialService.updateData(id, formData)
            toast.success(res.message)
        } else {
            const res = await laboratoryMaterialService.createData(formData)
            toast.success(res.message)
        }
        refresh()
        setId(null)
        setIsOpen(false)
    }

    const handleDelete = async () => {
        if (!id) return
        const res = await laboratoryMaterialService.deleteData(id)
        toast.success(res.message)

        refresh()
        setConfirmOpen(false)
    }

    return (
        <>
            <Header title="Menu Ruangan Laboratorium" />
            <div className="flex flex-1 w-full flex-col gap-4 p-4 pt-0" ref={sectionRef}>
                <Card>
                    <CardHeader>
                        <CardTitle>Menu Bahan Laboratorium</CardTitle>
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
                                    options={laboratoryRooms}
                                    value={selectedLaboratoryRoom?.toString() || ''}
                                    onChange={(val) => {
                                        setSelectedLaboratoryRoom(val ? Number(val) : 0)
                                        setCurrentPage(1)
                                    }}
                                    placeholder="Pilih Ruangan Laboratorium"
                                    optionLabelKey='name'
                                    optionValueKey='id'
                                    isFilter
                                />
                            </div>
                        </div>
                        <Table
                            data={laboratoryMaterials}
                            columns={LaboratoryMaterialColumn({ openModal, openConfirm, openModalDetail })}
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
            <LaboratoryMaterialFormDialog
                open={isOpen}
                onOpenChange={setIsOpen}
                data={laboratoryMaterials}
                laboratoryRooms={laboratoryRooms}
                dataId={id}
                handleSave={handleSave}
                title={type == 'Add' ? 'Tambah Bahan Laboratorium' : 'Edit Bahan Laboratorium'}
            />
            <LaboratoryMaterialDetailDialog
                laboratoryMaterials={laboratoryMaterials}
                laboratoryMaterialId={id}
                open={isDetailOpen}
                onOpenChange={setIsDetailOpen} />
        </>
    )
}

export default LaboratoryMaterialPage