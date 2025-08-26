import { ChangeEvent, useEffect, useRef, useState } from "react"
import { gsap } from 'gsap';
import { useGSAP } from "@gsap/react"
import Table from "../../../components/Table";
import { PracticalWorkColumn } from "./PracticalWorkColumn";
import useTable from "@/application/hooks/useTable";
import { useStudyProgram } from "@/application/study-program/hooks/useStudyProgram";
import { usePracticalWork } from "@/application/practical-work/hooks/usePracticalWork";
import Header from "@/presentation/components/Header";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/presentation/components/ui/card";
import { Button } from "@/presentation/components/ui/button";
import { Plus } from "lucide-react";
import { ModalType } from "@/shared/Types";
import { PracticalWorkInputDTO } from "@/application/practical-work/dto/PracticalWorkDTO";
import { toast } from "sonner";
import ConfirmationDialog from "@/presentation/components/custom/ConfirmationDialog";
import PracticalWorkFormDialog from "./components/PracticalWorkFormDialog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/presentation/components/ui/select";

const PracticalWorkPage = () => {
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
        studyProgram,
        getData: getStudyProgramData
    } = useStudyProgram({
        currentPage: 1,
        perPage: 9999,
        searchTerm: '',
        setTotalPages() { },
        setTotalItems() { },
    })

    const [selectedStudyProgram, setSelectedStudyProgram] = useState<number>(0)

    const handleFilterStudyProgram = (e: ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSelectedStudyProgram(value ? Number(value) : 0);
        setCurrentPage(1);
    }

    const {
        practicalWork,
        isLoading,
        getData,
        create,
        update,
        remove,
    } = usePracticalWork({
        currentPage,
        perPage,
        searchTerm,
        filter_study_program: selectedStudyProgram,
        setTotalPages,
        setTotalItems
    })

    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [id, setId] = useState<number | null>(null)
    const [type, setType] = useState<ModalType>('Add')

    const [confirmOpen, setConfirmOpen] = useState<boolean>(false)

    useEffect(() => {
        getStudyProgramData()
    }, [])

    useEffect(() => {
        getData()
    }, [currentPage, perPage, selectedStudyProgram])

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

    const handleSave = async (formData: PracticalWorkInputDTO): Promise<void> => {
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
            <Header title="Menu Data Praktikum" />
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0" ref={sectionRef}>
                <Card>
                    <CardHeader>
                        <CardTitle>Menu Data Praktikum</CardTitle>
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
                                <Select name='prodi_id' onValueChange={(value) =>
                                    handleFilterStudyProgram({
                                        target: {
                                            name: 'prodi_id',
                                            value: value
                                        }
                                    } as React.ChangeEvent<HTMLSelectElement>)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih Prodi" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Prodi</SelectLabel>
                                            <SelectItem value={"0"}>Semua</SelectItem>
                                            {studyProgram?.map((option) => (
                                                <SelectItem key={option.id} value={option.id.toString()}>{option.name}</SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <Table
                            data={practicalWork}
                            columns={PracticalWorkColumn({ openModal, openConfirm })}
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
            <PracticalWorkFormDialog
                open={isOpen}
                onOpenChange={setIsOpen}
                data={practicalWork}
                studyProgram={studyProgram}
                dataId={id}
                handleSave={handleSave}
                title={type == 'Add' ? 'Tambah data praktikum' : 'Edit data praktikum'}
            />
        </>
    )
}

export default PracticalWorkPage