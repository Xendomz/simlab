import { useEffect, useRef, useState } from "react"
import { gsap } from 'gsap';
import { useGSAP } from "@gsap/react"
import Table from "../../../components/Table";
import { LaboratoryRoomColumn } from "./LaboratoryRoomColumn";
import useTable from "@/application/hooks/useTable";
import { ModalType } from "@/shared/Types";
import { LaboratoryRoomInputDTO } from "@/application/laboratory-room/LaboratoryRoomDTO";
import { toast } from "sonner";
import Header from "@/presentation/components/Header";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/presentation/components/ui/card";
import { Button } from "@/presentation/components/ui/button";
import { Plus } from "lucide-react";
import ConfirmationDialog from "@/presentation/components/custom/ConfirmationDialog";
import LaboratoryRoomFormDialog from "./components/LaboratoryRoomFormDialog";
import { useUser } from "@/application/user/hooks/useUser";
import { LaboratoryRoomView } from "@/application/laboratory-room/LaboratoryRoomView";
import { LaboratoryRoomService } from "@/application/laboratory-room/LaboratoryRoomService";

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

    const laboratoryRoomService = new LaboratoryRoomService()
    const [laboratoryRooms, setLaboratoryRooms] = useState<LaboratoryRoomView[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const getData = async () => {
        setIsLoading(true)
        const response = await laboratoryRoomService.getLaboratoryRoomData({
            page: currentPage,
            per_page: perPage,
            search: searchTerm,
        })
        setLaboratoryRooms(response.data ?? [])
        setTotalItems(response.total ?? 0)
        setTotalPages(response.last_page ?? 0)
        setIsLoading(false)
    }

    useEffect(() => {
        getData()
    }, [currentPage, perPage])

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

    const {
        user,
        getData: getUserData
    } = useUser({
        currentPage: 1,
        perPage: 9999,
        searchTerm: '',
        filter_study_program: 0,
        setTotalPages() { },
        setTotalItems() { },
        role: 'Laboran',
    })

    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [id, setId] = useState<number | null>(null)
    const [type, setType] = useState<ModalType>('Add')

    const [confirmOpen, setConfirmOpen] = useState<boolean>(false)

    useEffect(() => {
        getUserData()
    }, [])

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
        getData()
        setId(null)
        setIsOpen(false)
    }

    const handleDelete = async () => {
        if (!id) return
        const res = await laboratoryRoomService.deleteData(id)
        toast.success(res.message)

        getData()
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
                laboran={user}
                dataId={id}
                handleSave={handleSave}
                title={type == 'Add' ? 'Tambah Ruangan Laboratorium' : 'Edit Ruangan Laboratorium'}
            />
        </>
    )
}

export default LaboratoryRoomPage