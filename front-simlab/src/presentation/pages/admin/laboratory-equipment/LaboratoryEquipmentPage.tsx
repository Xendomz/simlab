import { useEffect, useRef, useState } from "react"
import { gsap } from 'gsap';
import { useGSAP } from "@gsap/react"
import Table from "../../../components/Table";
import { LaboratoryEquipmentColumn } from "./LaboratoryEquipmentColumn";
import Header from "@/presentation/components/Header";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/presentation/components/ui/card";
import { Button } from "@/presentation/components/ui/button";
import { Plus } from "lucide-react";
import useTable from "@/application/hooks/useTable";
import { ModalType } from "@/shared/Types";
import { LaboratoryEquipmentInputDTO } from "@/application/laboratory-equipment/LaboratoryEquipmentDTO";
import { toast } from "sonner";
import ConfirmationDialog from "@/presentation/components/custom/ConfirmationDialog";
import LaboratoryEquipmentFormDialog from "./components/LaboratoryEquipmentFormDialog";
import { Combobox } from "@/presentation/components/custom/combobox";
import { LaboratoryRoomService } from "@/application/laboratory-room/LaboratoryRoomService";
import { LaboratoryRoomSelectView } from "@/application/laboratory-room/LaboratoryRoomSelectView";
import LaboratoryEquipmentDetailDialog from "./components/LaboratoryEquipmentDetailDialog";
import { LaboratoryEquipmentService } from "@/application/laboratory-equipment/LaboratoryEquipmentService";
import { LaboratoryEquipmentView } from "@/application/laboratory-equipment/LaboratoryEquipmentView";

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

    const laboratoryRommService = new LaboratoryRoomService()
    const [laboratoryRooms, setLaboratoryRooms] = useState<LaboratoryRoomSelectView[]>([])
    const [selectedLaboratoryRoom, setSelectedLaboratoryRoom] = useState<number>(0)

    useEffect(() => {
        const getLaboratoryRooms = async () => {
            const response = await laboratoryRommService.getDataForSelect()
            setLaboratoryRooms(response.data ?? [])
        }

        getLaboratoryRooms()
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

    const laboratoryEquipmentService = new LaboratoryEquipmentService()
    const [laboratoryEquipments, setLaboratoryEquipments] = useState<LaboratoryEquipmentView[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const getData = async () => {
        setIsLoading(true)
        const response = await laboratoryEquipmentService.getLaboratoryEquipmentData({
            page: currentPage,
            per_page: perPage,
            search: searchTerm,
            filter_laboratory_room: selectedLaboratoryRoom
        })
        setLaboratoryEquipments(response.data ?? [])
        setTotalItems(response.total ?? 0)
        setTotalPages(response.last_page ?? 0)
        setIsLoading(false)
    }

    useEffect(() => {
        getData()
    }, [currentPage, perPage, selectedLaboratoryRoom])

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
    const [isModalDetailOpen, setIsModalDetailOpen] = useState<boolean>(false)
    const [id, setId] = useState<number | null>(null)
    const [type, setType] = useState<ModalType>('Add')
    const [confirmOpen, setConfirmOpen] = useState<boolean>(false)

    const openModal = (modalType: ModalType, id: number | null = null) => {
        setId(null)
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
        getData()
        setId(null)
        setIsOpen(false)
    }

    const handleDelete = async () => {
        if (!id) return
        const res = await laboratoryEquipmentService.deleteData(id)
        toast.success(res.message)

        getData()
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