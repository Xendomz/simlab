import { ChangeEvent, useEffect, useRef, useState } from "react"
import { gsap } from 'gsap';
import { useGSAP } from "@gsap/react"
import Table from "../../../components/Table";
import { StudyProgramColumn } from "./StudyProgramColumn";
import useTable from "../../../../application/hooks/useTable";
import { ModalType } from "../../../../shared/Types";
import { useStudyProgram } from "@/application/study-program/hooks/useStudyProgram";
import Header from "@/presentation/components/Header";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/presentation/components/ui/card";
import { Button } from "@/presentation/components/ui/button";
import { Plus } from "lucide-react";
import ConfirmationDialog from "@/presentation/components/custom/ConfirmationDialog";
import { toast } from "sonner";
import { StudyProgramInputDTO } from "@/application/study-program/dto/StudyProgramDTO";
import StudyProgramFormDialog from "./components/StudyProgramFormDialog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/presentation/components/ui/select";
import { MajorService } from "@/application/major/MajorService";
import { MajorView } from "@/application/major/MajorView";
import { MajorSelectView } from "@/application/major/MajorSelectView";

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

    const majorService = new MajorService()
    const [majors, setMajors] = useState<MajorSelectView[]>([])
    const [selectedMajor, setSelectedMajor] = useState<number>(0)
    const handleFilterMajor = (e: ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSelectedMajor(value ? Number(value) : 0);
        setCurrentPage(1);
    }

    useEffect(() => {
        const getMajors = async () => {
            const response = await majorService.getDataForSelect()
            setMajors(response.data ?? [])
        }

        getMajors()
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

    // const {
    //     major,
    //     getData: getMajorData
    // } = useMajor({
    //     currentPage: 1,
    //     perPage: 9999,
    //     searchTerm: '',
    //     setTotalPages() { },
    //     setTotalItems() { },
    // })

    // const [selectedMajor, setSelectedMajor] = useState<number>()

    const {
        studyProgram,
        isLoading,
        getData,
        create,
        update,
        remove,
    } = useStudyProgram({
        currentPage,
        perPage,
        searchTerm,
        filter_major: selectedMajor,
        setTotalPages,
        setTotalItems
    })

    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [id, setId] = useState<number | null>(null)
    const [type, setType] = useState<ModalType>('Add')

    const [confirmOpen, setConfirmOpen] = useState<boolean>(false)

    useEffect(() => {
        getData()
    }, [currentPage, perPage, selectedMajor])

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
                                <Select name='jurusan_id' onValueChange={(value) =>
                                    handleFilterMajor({
                                        target: {
                                            name: 'jurusan_id',
                                            value: value
                                        }
                                    } as React.ChangeEvent<HTMLSelectElement>)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih Jurusan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Jurusan</SelectLabel>
                                            <SelectItem value={"0"}>Semua</SelectItem>
                                            {majors?.map((option, index) => (
                                                <SelectItem key={index} value={option.id.toString()}>{option.name}</SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <Table
                            data={studyProgram}
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
                data={studyProgram}
                majors={majors}
                dataId={id}
                handleSave={handleSave}
                title={type == 'Add' ? 'Tambah program studi' : 'Edit program studi'}
            />
        </>
    )
}

export default StudyProgramPage