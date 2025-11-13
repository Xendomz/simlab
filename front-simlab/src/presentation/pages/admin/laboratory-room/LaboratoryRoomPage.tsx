import { useRef, useState } from "react"
import { gsap } from 'gsap';
import { useGSAP } from "@gsap/react"
import Table from "../../../components/Table";
import { LaboratoryRoomColumn } from "./LaboratoryRoomColumn";
import { ModalType } from "@/shared/Types";
import { LaboratoryRoomInputDTO } from "@/application/laboratory-room/LaboratoryRoomDTO";
import { toast } from "sonner";
import Header from "@/presentation/components/Header";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/presentation/components/ui/card";
import { Button } from "@/presentation/components/ui/button";
import { Plus } from "lucide-react";
import ConfirmationDialog from "@/presentation/components/custom/ConfirmationDialog";
import LaboratoryRoomFormDialog from "./components/LaboratoryRoomFormDialog";
import { useLaboratoryRoomDataTable } from "./hooks/useLaboratoryRoomDataTable";
import { useDepedencies } from "@/presentation/contexts/useDepedencies";
import { useUserSelect } from "../user/hooks/useUserSelect";
import { userRole } from "@/domain/User/UserRole";

const LaboratoryRoomPage = () => {
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

    const { laboratoryRoomService } =  useDepedencies()

    const {
        laboratoryRooms,
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
    } = useLaboratoryRoomDataTable()

    const { users } = useUserSelect({ role: userRole.Laboran })

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

    const handleSave = async (formData: LaboratoryRoomInputDTO): Promise<void> => {
        if (id) {
            const res = await laboratoryRoomService.updateData(id, formData)
            toast.success(res.message)
        } else {
            const res = await laboratoryRoomService.createData(formData)
            toast.success(res.message)
        }
        refresh()
        setId(null)
        setIsOpen(false)
    }

    const handleDelete = async () => {
        if (!id) return
        const res = await laboratoryRoomService.deleteData(id)
        toast.success(res.message)

        refresh()
        setConfirmOpen(false)
    }

    return (
        <>
            <Header title="Menu Ruangan Laboratorium" />
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0" ref={sectionRef}>
                <Card>
                    <CardHeader>
                        <CardTitle>Menu Ruangan Laboratorium</CardTitle>
                        <CardAction>
                            <Button variant={"default"} onClick={() => openModal('Add')}>
                                Tambah
                                <Plus />
                            </Button>
                        </CardAction>
                    </CardHeader>
                    <CardContent>
                        <Table
                            data={laboratoryRooms}
                            columns={LaboratoryRoomColumn({ openModal, openConfirm })}
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
            <LaboratoryRoomFormDialog
                open={isOpen}
                onOpenChange={setIsOpen}
                data={laboratoryRooms}
                laboran={users}
                dataId={id}
                handleSave={handleSave}
                title={type == 'Add' ? 'Tambah Ruangan Laboratorium' : 'Edit Ruangan Laboratorium'}
            />
        </>
    )
}

export default LaboratoryRoomPage