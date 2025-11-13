import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useValidationErrors } from '@/presentation/hooks/useValidationError'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import { Skeleton } from '@/presentation/components/ui/skeleton'
import Table from '@/presentation/components/Table'
import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import { usePracticumScheduling } from '../context/PracticumSchedulingContext'
import { usePracticumSchedulingEquipmentMaterial } from '../hooks/usePracticumSchedulingEquipmentMaterial'
import { LaboratoryEquipmentSelectColumn } from '../../laboratory-equipment/LaboratoryEquipmentSelectColumn'
import { LaboratoryMaterialSelectColumn } from '../../laboratory-material/LaboratoryMaterialSelectColumn'
import { ArrowLeft, Info, Plus } from 'lucide-react'
import { Label } from '@/presentation/components/ui/label'
import Header from '@/presentation/components/Header'
import PracticumScheduleDetailDialog from './PracticumScheduleDetailDialog'
import { PracticumSchedulingView } from '@/application/practicum-scheduling/PracticumSchedulingView'
import { useLaboratoryEquipmentDataTable } from '../../laboratory-equipment/hooks/useLaboratoryEquipmentDataTable'
import { useLaboratoryMaterialDataTable } from '../../laboratory-material/hooks/useLaboratoryMaterialDataTable'
import { useDepedencies } from '@/presentation/contexts/useDepedencies'

interface PracticumScheduleEquipmentNMaterialFormProps {
    practicumScheduling: PracticumSchedulingView | undefined
}

const PracticumScheduleEquipmentNMaterialForm: React.FC<PracticumScheduleEquipmentNMaterialFormProps> = ({
    practicumScheduling
}) => {
    const sectionRef = useRef<HTMLDivElement | null>(null)
    useGSAP(() => {
        if (!sectionRef.current) return
        gsap.fromTo(sectionRef.current, { opacity: 0, y: 100 }, { opacity: 1, y: 0, duration: 1 })
    }, [])

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const navigate = useNavigate();
    const [loading] = useState(practicumScheduling ? true : false);
    const [isOpenDetail, setIsOpenDetail] = useState<boolean>(false)
    const { refreshIsHasDraftPracticum } = usePracticumScheduling()

    const {
        formData,
        handleChangeItem,
        handleRemoveItem,
        handleSelectItem,
        handleAddProposedItem,
        handleRemoveProposedItem,
        handleChangeProposedItem
    } = usePracticumSchedulingEquipmentMaterial()

    const { errors, processErrors } = useValidationErrors()

    // Table states
    const {
        laboratoryEquipments,
        isLoading: isEquipmentLoading,
        ...equipmentTable
    } = useLaboratoryEquipmentDataTable({ filter_laboratory_room: 0 })

    const {
        laboratoryMaterials,
        isLoading: isMaterialLoading,
        ...materialTable
    } = useLaboratoryMaterialDataTable({ filter_laboratory_room: 0 })

    const {practicumSchedulingService} = useDepedencies()
    const handleSubmit = async () => {
        if (!practicumScheduling) return;
        setIsSubmitting(true);
        try {
            const res = await practicumSchedulingService.storePracticumSchedulingEquipmentMaterial(practicumScheduling.id, formData);
            toast.success(res.message);
            navigate('/panel/penjadwalan-praktikum');
            refreshIsHasDraftPracticum()
        } catch (e: any) {
            toast.error(e?.message || 'Gagal submit');
            processErrors(e.errors);
        } finally {
            setIsSubmitting(false);
        }
    }

    // Helpers to collect group errors
    const hasEquipmentErrors = Object.keys(errors).some(k => k.startsWith('practicumSchedulingEquipments'));
    const hasProposedEquipmentErrors = Object.keys(errors).some(k => k.startsWith('proposedEquipments'));
    const hasMaterialErrors = Object.keys(errors).some(k => k.startsWith('practicumSchedulingMaterials'));
    const getQuantityError = (type: 'practicumSchedulingEquipments' | 'practicumSchedulingMaterials' | 'proposedEquipments', index: number) =>
        errors[`${type}.${index}.quantity`] || errors[`${type}.${index}.id`] || errors[`${type}.${index}`];

    return (
        <>
            <Header title="Menu Penjadwalan Praktikum" />
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0" ref={sectionRef}>
                <div className='flex flex-col sm:flex-row justify-between gap-2'>
                    <Button onClick={() => setIsOpenDetail((prev) => !prev)} disabled={loading} className='order-2 sm:order-1'>
                        <Info />
                        {loading ? 'Loading...' : 'Informasi Penjadwalan'}
                    </Button>
                    <PracticumScheduleDetailDialog open={isOpenDetail} onOpenChange={setIsOpenDetail} practicumScheduling={practicumScheduling} />
                    <NavLink to={'/panel/penjadwalan-praktikum'} className='order-1 sm:order-2 ml-auto sm:ml-0'>
                        <Button>
                            Kembali
                            <ArrowLeft />
                        </Button>
                    </NavLink>
                </div>
                <div className='flex flex-col gap-6'>
                    {/* === Equipment Section === */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Ajukan Peminjaman Alat Laboratorium</CardTitle>
                            <CardDescription>Harap disesuaikan dengan kebutuhan seluruh kelas yang diajukan</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className='grid lg:grid-cols-2 2xl:grid-cols-3 gap-5'>
                                <div className='2xl:col-span-2 overflow-x-auto'>
                                    <div className='font-semibold text-sm mb-2'>List Alat Laboratorium</div>
                                    {isEquipmentLoading ? (
                                        <div className='flex flex-col gap-3'>
                                            {[...Array(5)].map((_, i) => <Skeleton key={i} className='w-full h-9 rounded-md' />)}
                                        </div>
                                    ) : (
                                        <Table
                                            data={laboratoryEquipments}
                                            columns={LaboratoryEquipmentSelectColumn({ handleSelectItem, selectedIds: formData.practicumSchedulingEquipments.map(e => e.id) })}
                                            loading={false}
                                            searchTerm={equipmentTable.searchTerm}
                                            handleSearch={equipmentTable.handleSearch}
                                            perPage={equipmentTable.perPage}
                                            handlePerPageChange={equipmentTable.handlePerPageChange}
                                            totalPages={equipmentTable.totalPages}
                                            totalItems={equipmentTable.totalItems}
                                            currentPage={equipmentTable.currentPage}
                                            handlePageChange={equipmentTable.handlePageChange}
                                        />
                                    )}
                                </div>
                                <div className='flex flex-col gap-5'>
                                    <div>
                                        <div className='font-semibold text-sm'>Daftar alat yang dibutuhkan</div>
                                        {errors['practicumSchedulingEquipments'] && (
                                            <p className='mb-2 text-xs italic text-red-500'>{errors['practicumSchedulingEquipments']}</p>
                                        )}
                                        {!errors['practicumSchedulingEquipments'] && hasEquipmentErrors && (
                                            <p className='mb-2 text-xs italic text-red-500'>Periksa kembali input alat yang dipilih.</p>
                                        )}
                                        <div className='flex flex-col gap-3'>
                                            {formData.practicumSchedulingEquipments.length === 0 && <p className='text-sm text-muted-foreground'>Belum ada alat yang dipilih. Klik tombol Pilih pada tabel.</p>}
                                            {formData.practicumSchedulingEquipments.map((eq, index) => {
                                                return (
                                                    <div key={eq.id} className='flex flex-col gap-1 border rounded-md px-5 py-3 bg-background'>
                                                        <div className='grid grid-cols-1 sm:grid-cols-4 items-center gap-5'>
                                                            <p className='md:max-w-40 w-full text-sm font-medium break-words'>{eq.name}</p>
                                                            <div className='flex gap-2 w-full items-center sm:col-span-2'>
                                                                <Input type='number' min={0} value={eq.quantity || ''} placeholder='Jumlah' onChange={(e) => {
                                                                    handleChangeItem('laboratory_equipment', eq.id, Number(e.target.value))
                                                                }} />
                                                                <span className='text-sm font-medium w-fit text-nowrap'>{eq.unit}</span>
                                                            </div>
                                                            <Button type='button' variant='destructive' size='sm' className='w-full md:w-fit sm:ml-auto' onClick={() => handleRemoveItem('laboratory_equipment', eq.id)}>Hapus</Button>
                                                        </div>
                                                        {hasEquipmentErrors && (
                                                            <p className='text-xs italic text-red-500'>{errors[`practicumSchedulingEquipments.${index}.quantity`]}</p>
                                                        )}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                    <div>
                                        <div className='font-semibold text-sm'>Daftar alat yang diajukan</div>
                                        {errors['proposedEquipments'] && (
                                            <p className='mb-2 text-xs italic text-red-500'>{errors['proposedEquipments']}</p>
                                        )}
                                        {!errors['proposedEquipments'] && hasProposedEquipmentErrors && (
                                            <p className='mb-2 text-xs italic text-red-500'>Periksa kembali input alat yang dipilih.</p>
                                        )}
                                        <div className='flex flex-col gap-3'>
                                            {formData.proposedEquipments.length === 0 && <p className='text-sm text-muted-foreground'>Ajukan apabila terdapat alat yang tidak terdaftar pada sistem SIMLAB</p>}
                                            {formData.proposedEquipments.map((eq, index) => {
                                                const rowError = getQuantityError('proposedEquipments', index)
                                                return (
                                                    <div key={index} className='flex flex-col gap-1 border rounded-md px-5 py-3 bg-background'>
                                                        <div className='flex flex-col gap-5'>
                                                            <div className='grid grid-cols-3 gap-5'>
                                                                <div className='flex flex-col gap-2 col-span-2'>
                                                                    <Label>Nama Alat <span className="text-red-500">*</span></Label>
                                                                    <Input type='text' name='name' min={0} value={eq.name || ''} placeholder='Masukkan nama alat' onChange={(e) => {
                                                                        handleChangeProposedItem(index, e)
                                                                    }} />
                                                                </div>
                                                                <div className='flex flex-col gap-2'>
                                                                    <Label>Jumlah Alat <span className="text-red-500">*</span></Label>
                                                                    <Input type='number' name='quantity' min={0} value={eq.quantity || ''} placeholder='Jumlah' onChange={(e) => {
                                                                        handleChangeProposedItem(index, e)
                                                                    }} />
                                                                </div>
                                                            </div>
                                                            <Button type='button' variant='destructive' size='sm' className='w-full sm:ml-auto' onClick={() => handleRemoveProposedItem(index)}>Hapus</Button>
                                                        </div>
                                                        {rowError && <p className='text-xs italic text-red-500'>{rowError}</p>}
                                                    </div>
                                                )
                                            })}
                                            <Button type='button' variant='secondary' size='sm' className='w-fit ml-auto' onClick={handleAddProposedItem}><Plus /> Ajukan Alat</Button>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* === Material Section === */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Ajukan Peminjaman Bahan Laboratorium</CardTitle>
                            <CardDescription>Harap disesuaikan dengan kebutuhan total kelompok dari kelas yang diajukan</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className='grid lg:grid-cols-2 2xl:grid-cols-3 gap-5'>
                                <div className='2xl:col-span-2 w-full overflow-x-auto'>
                                    <div className='font-semibold text-sm mb-2'>List Bahan Laboratorium</div>
                                    {isMaterialLoading ? (
                                        <div className='flex flex-col gap-3'>
                                            {[...Array(5)].map((_, i) => <Skeleton key={i} className='w-full h-9 rounded-md' />)}
                                        </div>
                                    ) : (
                                        <Table
                                            data={laboratoryMaterials}
                                            columns={LaboratoryMaterialSelectColumn({ handleSelectItem, selectedIds: formData.practicumSchedulingMaterials.map(m => m.id) })}
                                            loading={false}
                                            searchTerm={materialTable.searchTerm}
                                            handleSearch={materialTable.handleSearch}
                                            perPage={materialTable.perPage}
                                            handlePerPageChange={materialTable.handlePerPageChange}
                                            totalPages={materialTable.totalPages}
                                            totalItems={materialTable.totalItems}
                                            currentPage={materialTable.currentPage}
                                            handlePageChange={materialTable.handlePageChange}
                                        />
                                    )}
                                </div>
                                <div>
                                    <div className='font-semibold text-sm mb-2'>Daftar Bahan yang dibutuhkan / Kelompok</div>
                                    {errors['practicumSchedulingMaterials'] && (
                                        <p className='mb-2 text-xs italic text-red-500'>{errors['practicumSchedulingMaterials']}</p>
                                    )}
                                    {!errors['practicumSchedulingMaterials'] && hasMaterialErrors && (
                                        <p className='mb-2 text-xs italic text-red-500'>Periksa kembali input bahan yang dipilih.</p>
                                    )}
                                    <div className='flex flex-col gap-3'>
                                        {formData.practicumSchedulingMaterials.length === 0 && <p className='text-sm text-muted-foreground'>Belum ada bahan yang dipilih. Klik tombol Pilih pada tabel.</p>}
                                        {formData.practicumSchedulingMaterials.map((mt, index) => {
                                            return (
                                                <div key={mt.id} className='flex flex-col gap-1 border rounded-md px-5 py-3 bg-background'>
                                                    <div className='grid grid-cols-1 sm:grid-cols-4 items-center gap-5'>
                                                        <p className='md:max-w-40 w-full text-sm font-medium break-words'>{mt.name}</p>
                                                        <div className='flex gap-2 w-full items-center sm:col-span-2'>
                                                            <Input type='number' min={0} value={mt.quantity || ''} placeholder='Jumlah' onChange={(e) => handleChangeItem('laboratory_material', mt.id, Number(e.target.value))} />
                                                            <span className='text-sm font-medium w-fit text-nowrap'>{mt.unit}</span>
                                                        </div>
                                                        <Button type='button' variant='destructive' className='w-full md:w-fit sm:ml-auto' size='sm' onClick={() => handleRemoveItem('laboratory_material', mt.id)}>Hapus</Button>
                                                    </div>
                                                    {hasMaterialErrors && (
                                                        <p className='text-xs italic text-red-500'>{errors[`practicumSchedulingMaterials.${index}.quantity`]}</p>
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* === Submit Button === */}
                    <div className='flex justify-end'>
                        <Button
                            type='button'
                            disabled={isSubmitting || !practicumScheduling?.id}
                            onClick={handleSubmit}
                        >{isSubmitting ? 'Menyimpan...' : 'Simpan'}</Button>
                    </div>
                </div>
            </div >
        </>
    )
}

export default PracticumScheduleEquipmentNMaterialForm
