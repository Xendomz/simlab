import { useRef, useState } from "react"
import { gsap } from 'gsap';
import { useGSAP } from "@gsap/react"
import Table from "../../../components/Table";
import { LaboratoryEquipmentColumn } from "./LaboratoryEquipmentColumn";
import Header from "@/presentation/components/Header";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/presentation/components/ui/card";
import { Button } from "@/presentation/components/ui/button";
import { Plus } from "lucide-react";
import { ModalType } from "@/shared/Types";
import { LaboratoryEquipmentInputDTO } from "@/application/laboratory-equipment/LaboratoryEquipmentDTO";
import { toast } from "sonner";
import ConfirmationDialog from "@/presentation/components/custom/ConfirmationDialog";
import LaboratoryEquipmentFormDialog from "./components/LaboratoryEquipmentFormDialog";
import { Combobox } from "@/presentation/components/custom/combobox";
import LaboratoryEquipmentDetailDialog from "./components/LaboratoryEquipmentDetailDialog";
import { useLaboratoryRoomSelect } from "../laboratory-room/hooks/useLaboratoryRoomSelect";
import { useDepedencies } from "@/presentation/contexts/useDepedencies";
import { useLaboratoryEquipmentDataTable } from "./hooks/useLaboratoryEquipmentDataTable";

const LaboratoryEquipmentPage = () => {
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

    const { laboratoryEquipmentService } = useDepedencies()
    const {
        laboratoryEquipments,
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
    } = useLaboratoryEquipmentDataTable({ filter_laboratory_room: selectedLaboratoryRoom })

    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [isModalDetailOpen, setIsModalDetailOpen] = useState<boolean>(false)
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
        setIsModalDetailOpen(true)
    }

    const handleSave = async (formData: LaboratoryEquipmentInputDTO): Promise<void> => {
        if (id) {
            const res = await laboratoryEquipmentService.updateData(id, formData)
            toast.success(res.message)
        } else {
            const res = await laboratoryEquipmentService.createData(formData)
            toast.success(res.message)
        }
        refresh()
        setId(null)
        setIsOpen(false)
    }

    const handleDelete = async () => {
        if (!id) return
        const res = await laboratoryEquipmentService.deleteData(id)
        toast.success(res.message)

        refresh()
        setConfirmOpen(false)
    }

    return (
        <>
            <Header title="Menu Alat Laboratorium" />
            <div className="flex flex-1 w-full flex-col gap-4 p-4 pt-0" ref={sectionRef}>
                <Card>
                    <CardHeader>
                        <CardTitle>Menu Alat Laboratorium</CardTitle>
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
                            data={laboratoryEquipments}
                            columns={LaboratoryEquipmentColumn({ openModal, openConfirm, openModalDetail })}
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
            <LaboratoryEquipmentFormDialog
                open={isOpen}
                onOpenChange={setIsOpen}
                data={laboratoryEquipments}
                laboratoryRooms={laboratoryRooms}
                dataId={id}
                handleSave={handleSave}
                title={type == 'Add' ? 'Tambah Alat Laboratorium' : 'Edit Alat Laboratorium'}
            />
            <LaboratoryEquipmentDetailDialog laboratoryEquipments={laboratoryEquipments} laboratoryEquipmentId={id} open={isModalDetailOpen} onOpenChange={setIsModalDetailOpen} />
        </>
    )
}

export default LaboratoryEquipmentPage