import { useEffect, useRef, useState } from "react"
import { gsap } from 'gsap';
import { useGSAP } from "@gsap/react"
import Table from "../../../components/Table";
import { MajorColumn } from "./MajorColumn";
import useTable from "../../../../application/hooks/useTable";
import { ModalType } from "../../../../shared/Types";
import Header from "@/presentation/components/Header";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/presentation/components/ui/card";
import { Button } from "@/presentation/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import ConfirmationDialog from "@/presentation/components/custom/ConfirmationDialog";
import MajorFormDialog from "./components/MajorFormDialog";
import { MajorInputDTO } from "@/application/major/dto/MajorDTO";
import { MajorView } from "@/application/major/MajorView";
import { MajorService } from "@/application/major/MajorService";
import { FacultyView } from "@/application/faculty/FacultyView";
import { FacultyService } from "@/application/faculty/FacultyService";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/presentation/components/ui/select";

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

    const facultyService = new FacultyService()
    const [faculties, setFaculties] = useState<FacultyView[]>([])
    const [selectedFaculty, setselectedFaculty] = useState<number>(0)
    const handleFilterFaculty = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setselectedFaculty(value ? Number(value) : 0);
        setCurrentPage(1);
    }

    useEffect(() => {
        const getFaculties = async () => {
            const response = await facultyService.getDataForSelect();
            setFaculties(response.data ?? [])
        }

        getFaculties()
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

    const majorService = new MajorService()
    const [major, setMajor] = useState<MajorView[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const getData = async () => {
        setIsLoading(true)
        const response = await majorService.getMajorData({
            page: currentPage,
            per_page: perPage,
            search: searchTerm,
            filter_faculty: selectedFaculty
        });
        setMajor(response.data ?? [])
        setTotalItems(response.total ?? 0)
        setTotalPages(response.last_page ?? 0)
        setIsLoading(false)
    }

    useEffect(() => {
        getData()
    }, [currentPage, perPage, selectedFaculty])

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
    const [id, setId] = useState<number | null>(null)
    const [type, setType] = useState<ModalType>('Add')
    const [confirmOpen, setConfirmOpen] = useState<boolean>(false)


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
        getData()
        setIsOpen(false)
    }

    const handleDelete = async () => {
        if (!id) return
        const res = await majorService.deleteData(id)
        toast.success(res.message)

        getData()
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
                                <Select name='faculty_id' onValueChange={(value) =>
                                    handleFilterFaculty({
                                        target: {
                                            name: 'faculty_id',
                                            value: value
                                        }
                                    } as React.ChangeEvent<HTMLSelectElement>)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih Fakultas" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Fakultas</SelectLabel>
                                            <SelectItem value={"0"}>Semua</SelectItem>
                                            {faculties?.map((option, index) => (
                                                <SelectItem key={index} value={option.id.toString()}>{option.name}</SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <Table
                            data={major}
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
                data={major}
                dataId={id}
                faculties={faculties}
                handleSave={handleSave}
                title={type == 'Add' ? 'Tambah tahun akademik' : 'Edit tahun akademik'}
            />
        </>
    )
}

export default MajorPage