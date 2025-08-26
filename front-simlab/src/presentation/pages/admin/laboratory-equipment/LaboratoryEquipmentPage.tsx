import { ChangeEvent, useEffect, useRef, useState } from "react"
import { gsap } from 'gsap';
import { useGSAP } from "@gsap/react"
import Table from "../../../components/Table";
import { LaboratoryEquipmentColumn } from "./LaboratoryEquipmentColumn";
import Header from "@/presentation/components/Header";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/presentation/components/ui/card";
import { Button } from "@/presentation/components/ui/button";
import { Plus } from "lucide-react";
import useTable from "@/application/hooks/useTable";
import { useLaboratoryRoom } from "@/application/laboratory-room/hooks/useLaboratoryRoom";
import { useLaboratoryEquipment } from "@/application/laboratory-equipment/hooks/useLaboratoryEquipment";
import { ModalType } from "@/shared/Types";
import { LaboratoryEquipmentInputDTO } from "@/application/laboratory-equipment/dto/LaboratoryEquipmentDTO";
import { toast } from "sonner";
import ConfirmationDialog from "@/presentation/components/custom/ConfirmationDialog";
import LaboratoryEquipmentFormDialog from "./components/LaboratoryEquipmentFormDialog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/presentation/components/ui/select";
import LaboratoryEquipmentDetail from "./components/LaboratoryEquipmentDetail";

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

    const {
        laboratoryRoom,
        getData: getLaboratoryRoomData,
    } = useLaboratoryRoom({
        currentPage: 1,
        perPage: 9999,
        searchTerm: '',
        setTotalPages() { },
        setTotalItems() { }
    })

    const [selectedLaboratoryRoom, setSelectedLaboratoryRoom] = useState<number>(0)

    const handleFilterLaboratoryRoom = (e: ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;

        setSelectedLaboratoryRoom(value ? Number(value) : 0);
        setCurrentPage(1);
    }

    const {
        laboratoryEquipment,
        isLoading,
        getData,
        create,
        update,
        remove,
    } = useLaboratoryEquipment({
        currentPage,
        perPage,
        searchTerm,
        filter_laboratory_room: selectedLaboratoryRoom,
        setTotalPages,
        setTotalItems
    })

    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [isModalDetailOpen, setIsModalDetailOpen] = useState<boolean>(false)
    const [id, setId] = useState<number | null>(null)
    const [type, setType] = useState<ModalType>('Add')

    const [confirmOpen, setConfirmOpen] = useState<boolean>(false)

    useEffect(() => {
        getLaboratoryRoomData()
    }, [])

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
            const res = await update(id, formData)
            toast.success(res.message)
        } else {
            const res = await create(formData)
            toast.success(res.message)
        }
        getData()
        setId(null)
        setIsOpen(false)
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
                                <Select name='ruangan_laboratorium_id' onValueChange={(value) =>
                                    handleFilterLaboratoryRoom({
                                        target: {
                                            name: 'ruangan_laboratorium_id',
                                            value: value
                                        }
                                    } as React.ChangeEvent<HTMLSelectElement>)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih Ruangan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Ruangan</SelectLabel>
                                            <SelectItem value=" ">All</SelectItem>
                                            {laboratoryRoom?.map((option) => (
                                                <SelectItem key={option.id} value={option.id.toString()}>{option.name}</SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <Table
                            data={laboratoryEquipment}
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
                data={laboratoryEquipment}
                laboratoryRoom={laboratoryRoom}
                dataId={id}
                handleSave={handleSave}
                title={type == 'Add' ? 'Tambah Alat Laboratorium' : 'Edit Alat Laboratorium'}
            />
            <LaboratoryEquipmentDetail laboratoryEquipment={laboratoryEquipment} laboratoryEquipmentId={id} open={isModalDetailOpen} onOpenChange={setIsModalDetailOpen} />
        </>
    )
}

export default LaboratoryEquipmentPage