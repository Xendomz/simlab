import { useEffect, useRef, useState } from "react"
import { gsap } from 'gsap';
import { useGSAP } from "@gsap/react"
import { AcademicYearColumn } from "./AcademicYearColumn";
import Table from "../../../components/Table";
import { ModalType } from "../../../../shared/Types";
import useTable from "../../../../application/hooks/useTable";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/presentation/components/ui/card";
import Header from "@/presentation/components/Header";
import { Plus } from "lucide-react";
import { Button } from "@/presentation/components/ui/button";
import { useAcademicYear } from "@/application/academic-year/hooks/useAcademicYear";
import ConfirmationDialog from "@/presentation/components/custom/ConfirmationDialog";
import { toast } from "sonner";
import { AcademicYearInputDTO } from "@/application/academic-year/dtos/AcademicYearDTO";
import AcademicYearFormDialog from "./components/AcademicYearFormDialog";

const AcademicYearPage = () => {
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
        academicYear,
        isLoading,
        getData,
        create,
        update,
        remove,
        toggleStatus,
    } = useAcademicYear({
        currentPage,
        perPage,
        searchTerm,
        setTotalPages,
        setTotalItems
    })

    const [isOpen, setIsOpen] = useState(false)
    const [id, setId] = useState<number | null>(null)
    const [type, setType] = useState<ModalType>('Add')

    const [confirmOpen, setConfirmOpen] = useState(false)
    const [confirmType, setConfirmType] = useState<"delete" | "status" | null>(null)

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

    const openModal = (modalType: ModalType, id: number | null = null) => {
        setId(null)
        setType(modalType)
        setId(id)
        setIsOpen(true)
    }

    const openConfirm = (type: "delete" | "status", id: number) => {
        setConfirmType(type)
        setId(id)
        setConfirmOpen(true)
    }

    const handleSave = async (formData: AcademicYearInputDTO): Promise<void> => {
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

    const handleConfirm = async() => {
        if (!id) return 
        if (confirmType == 'delete') {
            const res = await remove(id)
            toast.success(res.message)
        } else {
            const res = await toggleStatus(id)
            toast.success(res.message)
        }
        getData()
        setConfirmOpen(false)
    }


    return (
        <>
            <Header title='Menu Tahun Akademik' />
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0" ref={sectionRef}>
                <Card>
                    <CardHeader>
                        <CardTitle>Menu Tahun Akademik</CardTitle>
                        <CardAction>
                            <Button variant={"default"} onClick={() => openModal('Add')}>
                                Tambah
                                <Plus />
                            </Button>
                        </CardAction>
                    </CardHeader>
                    <CardContent>
                        <Table
                            data={academicYear}
                            columns={AcademicYearColumn({ openModal, openConfirm })}
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
            <ConfirmationDialog open={confirmOpen} onOpenChange={setConfirmOpen} onConfirm={handleConfirm} />
            <AcademicYearFormDialog
                open={isOpen}
                onOpenChange={setIsOpen}
                data={academicYear}
                dataId={id}
                handleSave={handleSave}
                title={type == 'Add' ? 'Tambah Tahun Akademik' : 'Edit Tahun Akademik'}
            />
        </>
    )
}

export default AcademicYearPage