import { useState, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { useNavigate, useParams } from 'react-router-dom'
// import { useLaboratoryEquipment } from '@/application/laboratory-equipment/hooks/useLaboratoryEquipment'
import Table from '@/presentation/components/Table'
import { LaboratoryEquipmentColumn } from '../column/LaboratoryEquipmentColumn'
import { Input } from '@/presentation/components/ui/input'
import { Button } from '@/presentation/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import { toast } from 'sonner'
import { useBooking } from '@/application/booking/hooks/useBooking'
import { useValidationErrors } from '@/presentation/hooks/useValidationError'
import { Skeleton } from '@/presentation/components/ui/skeleton'
import { useLaboratoryEquipmentDataTable } from '../../laboratory-equipment/hooks/useLaboratoryEquipmentDataTable'
import { useBookingEquipmentMaterialForm } from '../hooks/useBookingEquipmentMaterialForm'

const BookingEquipmentForm = () => {
    const sectionRef = useRef<HTMLDivElement | null>(null)
    useGSAP(() => {
        if (!sectionRef.current) return
        gsap.fromTo(sectionRef.current, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.6 })
    }, [])

    const { id } = useParams()
    const navigate = useNavigate();
    const bookingId = id ? Number(id) : undefined
    const { storeBookingEquipment } = useBooking({})
    const { errors, processErrors } = useValidationErrors()

    const [isSubmitting, setIsSubmitting] = useState(false)

    const {
        formData,
        handleChangeItem,
        handleRemoveItem,
        handleSelectItem,
    } = useBookingEquipmentMaterialForm()

    const {
        laboratoryEquipments,
        isLoading: isEquipmentLoading,
        ...equipmentTable
    } = useLaboratoryEquipmentDataTable({ filter_laboratory_room: 0 })

    const handleSubmit = async () => {
        if (!bookingId) return
        if (formData.laboratoryEquipments.length === 0) {
            toast.error('Minimal satu alat dipilih')
            return
        }
        setIsSubmitting(true)
        try {
            await storeBookingEquipment(bookingId, formData.laboratoryEquipments.map(e => ({ id: e.id, quantity: e.quantity })))
            toast.success('Alat berhasil diajukan')
            navigate('/panel/peminjaman')
        } catch (e: any) {
            toast.error(e?.message || 'Gagal submit')
            processErrors(e.errors)
        } finally {
            setIsSubmitting(false)
        }
    }

    // Helpers for validation errors
    const hasNestedEquipmentErrors = Object.keys(errors).some(k => k.startsWith('laboratoryEquipments.'))
    const getRowError = (index: number) => {
        return errors[`laboratoryEquipments.${index}.quantity`] || errors[`laboratoryEquipments.${index}.id`] || undefined
    }

    return (
        <div ref={sectionRef} className='flex flex-col gap-6'>
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
                                    data={laboratoryEquipments}
                                    columns={LaboratoryEquipmentColumn({ handleSelectItem, selectedIds: formData.laboratoryEquipments.map(e => e.id) })}
                                    loading={isEquipmentLoading}
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
                            <div className='font-semibold text-sm mb-2'>Daftar Alat Dipilih <span className='text-red-500'>*</span></div>
                            {errors['laboratoryEquipments'] && <p className='text-xs italic text-red-500 mb-2'>{errors['laboratoryEquipments']}</p>}
                            {!errors['laboratoryEquipments'] && hasNestedEquipmentErrors && (
                                <p className='text-xs italic text-red-500 mb-2'>Periksa kembali input alat yang dipilih.</p>
                            )}
                            <div className='flex flex-col gap-3'>
                                {formData.laboratoryEquipments.length === 0 && <p className='text-sm text-muted-foreground'>Belum ada alat dipilih.</p>}
                                {formData.laboratoryEquipments.map((eq, index) => {
                                    const rowError = getRowError(index)
                                    return (
                                        <div key={eq.id} className='flex flex-col gap-1 border rounded-md px-4 py-3 bg-background'>
                                            <div className='flex flex-col md:flex-row items-center gap-5'>
                                                <p className='md:max-w-40 w-full text-sm font-medium'>{eq.name}</p>
                                                <div className='flex gap-2 w-full items-center'>
                                                    <Input
                                                        type='number'
                                                        min={0}
                                                        value={eq.quantity  || ''}
                                                        placeholder='Jumlah'
                                                        onChange={(e) => handleChangeItem('laboratory_equipment', eq.id, Number(e.target.value))}
                                                        className={rowError ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                                    />
                                                    <span className='text-sm font-medium w-fit text-nowrap'>{eq.unit}</span>
                                                </div>
                                                <Button type='button' variant='destructive' size='sm' className='w-full md:w-fit' onClick={() => handleRemoveItem('laboratory_equipment', eq.id)}>Hapus</Button>
                                            </div>
                                            {rowError && <p className='text-[10px] italic text-red-500'>{rowError}</p>}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-end mt-6'>
                        <Button type='button' disabled={isSubmitting || !bookingId} onClick={handleSubmit}>
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default BookingEquipmentForm
