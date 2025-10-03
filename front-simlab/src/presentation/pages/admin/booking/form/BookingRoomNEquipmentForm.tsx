import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import React, { useEffect, useRef, useState } from 'react'
import { BookingRoomNEquipmentInputDTO } from '@/application/booking/dto/BookingDTO'
import { useValidationErrors } from '@/presentation/hooks/useValidationError'
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import { Skeleton } from '@/presentation/components/ui/skeleton'
import { Input } from '@/presentation/components/ui/input'
import { Button } from '@/presentation/components/ui/button'
import Table from '@/presentation/components/Table'
// import { useLaboratoryEquipment } from '@/application/laboratory-equipment/hooks/useLaboratoryEquipment'
import useTable from '@/application/hooks/useTable'
import { LaboratoryEquipmentColumn } from '../column/LaboratoryEquipmentColumn'
import { LaboratoryMaterialColumn } from '../column/LaboratoryMaterialColumn'
import { LaboratoryEquipmentView } from '@/application/laboratory-equipment/LaboratoryEquipmentView'
import { LaboratoryMaterialView } from '@/application/laboratory-material/LaboratoryMaterialView'
import { useBooking } from '@/application/booking/hooks/useBooking'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
// import { useLaboratoryMaterial } from '@/application/laboratory-material/hooks/useLaboratoryMaterial'

const BookingRoomNEquipmentForm: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement | null>(null)
    useGSAP(() => {
        if (!sectionRef.current) return
        gsap.fromTo(sectionRef.current, { opacity: 0, y: 100 }, { opacity: 1, y: 0, duration: 1 })
    }, [])

    const [formData, setFormData] = useState<BookingRoomNEquipmentInputDTO>({
        laboratoryEquipments: [],
        laboratoryMaterials: []
    })

    const [isSubmitting, setIsSubmitting] = useState(false)
    const { id } = useParams()
    const navigate = useNavigate();
    const bookingId = id ? Number(id) : undefined
    const { storeBookingRoomNEquipment } = useBooking({})

    // Handlers Equipment
    const handleSelectLaboratoryEquipment = (data: LaboratoryEquipmentView) => {
        setFormData(prev => {
            const exists = prev.laboratoryEquipments.find(eq => eq.id === data.id)
            if (exists) {
                return { ...prev, laboratoryEquipments: prev.laboratoryEquipments.filter(eq => eq.id !== data.id) }
            }
            return {
                ...prev,
                laboratoryEquipments: [...prev.laboratoryEquipments, { id: data.id, name: data.equipmentName, quantity: 0, unit: data.unit }]
            }
        })
    }
    const handleChangeEquipmentQuantity = (id: number, quantity: number) => setFormData(prev => ({
        ...prev,
        laboratoryEquipments: prev.laboratoryEquipments.map(eq => eq.id === id ? { ...eq, quantity } : eq)
    }))
    const removeEquipment = (id: number) => setFormData(prev => ({
        ...prev,
        laboratoryEquipments: prev.laboratoryEquipments.filter(eq => eq.id !== id)
    }))

    // Handlers Material
    const handleSelectLaboratoryMaterial = (data: LaboratoryMaterialView) => {
        setFormData(prev => {
            const exists = prev.laboratoryMaterials.find(mt => mt.id === data.id)
            if (exists) return { ...prev, laboratoryMaterials: prev.laboratoryMaterials.filter(mt => mt.id !== data.id) }
            return { ...prev, laboratoryMaterials: [...prev.laboratoryMaterials, { id: data.id, name: data.materialName, quantity: 0, unit: data.unit }] }
        })
    }
    const handleChangeMaterialQuantity = (id: number, quantity: number) => setFormData(prev => ({
        ...prev,
        laboratoryMaterials: prev.laboratoryMaterials.map(mt => mt.id === id ? { ...mt, quantity } : mt)
    }))
    const removeMaterial = (id: number) => setFormData(prev => ({
        ...prev,
        laboratoryMaterials: prev.laboratoryMaterials.filter(mt => mt.id !== id)
    }))

    const { errors, processErrors } = useValidationErrors()

    // Table states
    const equipmentTable = useTable()
    const materialTable = useTable()

    // Data hooks
    const { laboratoryEquipment, isLoading: isEquipmentLoading, getData: getEquipments } = useLaboratoryEquipment({
        currentPage: equipmentTable.currentPage,
        perPage: equipmentTable.perPage,
        searchTerm: equipmentTable.searchTerm,
        filter_laboratory_room: 0,
        setTotalPages: equipmentTable.setTotalPages,
        setTotalItems: equipmentTable.setTotalItems
    })
    const { laboratoryMaterial, isLoading: isMaterialLoading, getData: getMaterials } = useLaboratoryMaterial({
        currentPage: materialTable.currentPage,
        perPage: materialTable.perPage,
        searchTerm: materialTable.searchTerm,
        setTotalPages: materialTable.setTotalPages,
        setTotalItems: materialTable.setTotalItems
    })

    // Effects
    useEffect(() => { getEquipments() }, [getEquipments])
    useEffect(() => { getMaterials() }, [getMaterials])

    const handleSubmit = async () => {
        if (!bookingId) return
        setIsSubmitting(true)
        try {
            await storeBookingRoomNEquipment(bookingId, formData)
            toast.success('Berhasil mengajukan ruangan, alat & bahan')
            navigate('/panel/peminjaman')
        } catch (e: any) {
            toast.error(e?.message || 'Gagal submit')
            processErrors(e.errors)
        } finally {
            setIsSubmitting(false)
        }
    }

    // Helpers to collect group errors
    const hasEquipmentErrors = Object.keys(errors).some(k => k.startsWith('laboratoryEquipments'))
    const hasMaterialErrors = Object.keys(errors).some(k => k.startsWith('laboratoryMaterials'))
    const getQuantityError = (type: 'laboratoryEquipments' | 'laboratoryMaterials', index: number) => {
        return errors[`${type}.${index}.quantity`]
            || errors[`${type}.${index}.id`]
            || errors[`${type}.${index}`]
    }

    return (
        <div ref={sectionRef} className='flex flex-col gap-6'>
            {/* Equipment Section */}
            <Card>
                <CardHeader><CardTitle>Ajukan Peminjaman Alat Laboratorium</CardTitle></CardHeader>
                <CardContent>
                    <div className='grid lg:grid-cols-2 xl:grid-cols-3 gap-5'>
                        <div className='xl:col-span-2 overflow-x-auto'>
                            <div className='font-semibold text-sm mb-5'>List Alat Laboratorium</div>
                            {isEquipmentLoading ? (
                                <div className='flex flex-col gap-3'>
                                    <Skeleton className='w-full h-9 rounded-md' />
                                    <Skeleton className='w-full h-9 rounded-md' />
                                    <Skeleton className='w-full h-9 rounded-md' />
                                    <Skeleton className='w-full h-9 rounded-md' />
                                    <Skeleton className='w-full h-9 rounded-md' />
                                </div>
                            ) : (
                                <Table
                                    data={laboratoryEquipment}
                                    columns={LaboratoryEquipmentColumn({ handleSelectLaboratoryEquipment, selectedIds: formData.laboratoryEquipments.map(e => e.id) })}
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
                        <div>
                            <div className='font-semibold text-sm mb-2'>Daftar Alat yang dibutuhkan <span className='text-red-500'>*</span></div>
                            {errors['laboratoryEquipments'] && (
                                <p className='mb-2 text-xs italic text-red-500'>{errors['laboratoryEquipments']}</p>
                            )}
                            {!errors['laboratoryEquipments'] && hasEquipmentErrors && (
                                <p className='mb-2 text-xs italic text-red-500'>Periksa kembali input alat yang dipilih.</p>
                            )}
                            <div className='flex flex-col gap-3'>
                                {formData.laboratoryEquipments.length === 0 && <p className='text-sm text-muted-foreground'>Belum ada alat yang dipilih. Klik tombol Pilih pada tabel.</p>}
                                {formData.laboratoryEquipments.map((eq, index) => {
                                    const rowError = getQuantityError('laboratoryEquipments', index)
                                    return (
                                        <div key={eq.id} className='flex flex-col gap-1 border rounded-md px-5 py-3 bg-background'>
                                            <div className='flex flex-col md:flex-row items-center gap-5'>
                                                <p className='md:max-w-40 w-full text-sm font-medium'>{eq.name}</p>
                                                <div className='flex gap-2 w-full items-center'>
                                                    <Input type='number' min={0} value={eq.quantity} onChange={(e) => handleChangeEquipmentQuantity(eq.id, Number(e.target.value))} />
                                                    <span className='text-sm font-medium w-fit text-nowrap'>{eq.unit}</span>
                                                </div>
                                                <Button type='button' variant='destructive' size='sm' className='w-full md:w-fit' onClick={() => removeEquipment(eq.id)}>Hapus</Button>
                                            </div>
                                            {rowError && <p className='text-xs italic text-red-500'>{rowError}</p>}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Material Section */}
            <Card>
                <CardHeader><CardTitle>Ajukan Peminjaman Bahan Laboratorium</CardTitle></CardHeader>
                <CardContent>
                    <div className='grid lg:grid-cols-2 xl:grid-cols-3 gap-5'>
                        <div className='xl:col-span-2 w-full overflow-x-auto'>
                            <div className='font-semibold text-sm mb-5'>List Bahan Laboratorium</div>
                            {isMaterialLoading ? (
                                <div className='flex flex-col gap-3'>
                                    <Skeleton className='w-full h-9 rounded-md' />
                                    <Skeleton className='w-full h-9 rounded-md' />
                                    <Skeleton className='w-full h-9 rounded-md' />
                                    <Skeleton className='w-full h-9 rounded-md' />
                                    <Skeleton className='w-full h-9 rounded-md' />
                                </div>
                            ) : (
                                <Table
                                    data={laboratoryMaterial}
                                    columns={LaboratoryMaterialColumn({ handleSelectLaboratoryMaterial, selectedIds: formData.laboratoryMaterials.map(m => m.id) })}
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
                            <div className='font-semibold text-sm mb-2'>Daftar Bahan yang dibutuhkan <span className='text-red-500'>*</span></div>
                            {errors['laboratoryMaterials'] && (
                                <p className='mb-2 text-xs italic text-red-500'>{errors['laboratoryMaterials']}</p>
                            )}
                            {!errors['laboratoryMaterials'] && hasMaterialErrors && (
                                <p className='mb-2 text-xs italic text-red-500'>Periksa kembali input bahan yang dipilih.</p>
                            )}
                            <div className='flex flex-col gap-3'>
                                {formData.laboratoryMaterials.length === 0 && <p className='text-sm text-muted-foreground'>Belum ada bahan yang dipilih. Klik tombol Pilih pada tabel.</p>}
                                {formData.laboratoryMaterials.map((mt, index) => {
                                    const rowError = getQuantityError('laboratoryMaterials', index)
                                    return (
                                        <div key={mt.id} className='flex flex-col gap-1 border rounded-md px-5 py-3 bg-background'>
                                            <div className='flex flex-col md:flex-row items-center gap-5'>
                                                <p className='md:max-w-40 w-full text-sm font-medium'>{mt.name}</p>
                                                <div className='flex gap-2 w-full items-center'>
                                                    <Input type='number' min={0} value={mt.quantity} onChange={(e) => handleChangeMaterialQuantity(mt.id, Number(e.target.value))} />
                                                    <span className='text-sm font-medium w-fit text-nowrap'>{mt.unit}</span>
                                                </div>
                                                <Button type='button' variant='destructive' className='w-full md:w-fit' size='sm' onClick={() => removeMaterial(mt.id)}>Hapus</Button>
                                            </div>
                                            {rowError && <p className='text-xs italic text-red-500'>{rowError}</p>}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className='flex justify-end'>
                <Button
                    type='button'
                    disabled={isSubmitting || !bookingId}
                    onClick={handleSubmit}
                >{isSubmitting ? 'Submitting...' : 'Submit'}</Button>
            </div>
        </div>
    )
}

export default BookingRoomNEquipmentForm
