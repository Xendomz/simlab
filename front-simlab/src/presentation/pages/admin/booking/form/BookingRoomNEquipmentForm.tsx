import React, { useState } from 'react'
import { useValidationErrors } from '@/presentation/hooks/useValidationError'
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import { Skeleton } from '@/presentation/components/ui/skeleton'
import { Input } from '@/presentation/components/ui/input'
import { Button } from '@/presentation/components/ui/button'
import Table from '@/presentation/components/Table'
// import { useLaboratoryEquipment } from '@/application/laboratory-equipment/hooks/useLaboratoryEquipment'
import { LaboratoryEquipmentColumn } from '../column/LaboratoryEquipmentColumn'
import { LaboratoryMaterialColumn } from '../column/LaboratoryMaterialColumn'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useBookingEquipmentMaterialForm } from '../hooks/useBookingEquipmentMaterialForm'
import { useLaboratoryEquipmentDataTable } from '../../laboratory-equipment/hooks/useLaboratoryEquipmentDataTable'
import { useLaboratoryMaterialDataTable } from '../../laboratory-material/hooks/useLaboratoryMaterialDataTable'
import { useDepedencies } from '@/presentation/contexts/useDepedencies'
import ConfirmationDialog from '@/presentation/components/custom/ConfirmationDialog'
// import { useLaboratoryMaterial } from '@/application/laboratory-material/hooks/useLaboratoryMaterial'

const BookingRoomNEquipmentForm: React.FC = () => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { id } = useParams()
    const navigate = useNavigate();
    const bookingId = id ? Number(id) : undefined
    const { bookingService } = useDepedencies()

    const {
        formData,
        handleChangeItem,
        handleRemoveItem,
        handleSelectItem,
    } = useBookingEquipmentMaterialForm()

    const { errors, processErrors } = useValidationErrors()

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

    const [isConfirmationOpen, setIsConfirmationOpen] = useState<boolean>(false)
    const handleSubmit = async () => {
        if (!bookingId) return
        setIsSubmitting(true)
        try {
            const res = await bookingService.storeBookingEquipmentMaterial(bookingId, formData)
            toast.success(res.message)
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

    return (
        <div className='flex flex-col gap-6'>
            {/* Equipment Section */}
            <Card>
                <CardHeader><CardTitle>Ajukan Peminjaman Alat Laboratorium</CardTitle></CardHeader>
                <CardContent>
                    <div className='grid lg:grid-cols-2 xl:grid-cols-3 gap-5'>
                        <div className='xl:col-span-2 overflow-x-auto'>
                            <div className='font-semibold text-sm mb-2'>List Alat Laboratorium</div>
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
                                    return (
                                        <div key={eq.id} className='flex flex-col gap-1 border rounded-md px-5 py-3 bg-background'>
                                            <div className='flex flex-col md:flex-row items-center gap-5'>
                                                <p className='md:max-w-40 w-full text-sm font-medium'>{eq.name}</p>
                                                <div className='flex gap-2 w-full items-center'>
                                                    <Input type='number' min={0} value={eq.quantity || ''} placeholder='Jumlah' onChange={(e) => handleChangeItem('laboratory_equipment', eq.id, Number(e.target.value))} />
                                                    <span className='text-sm font-medium w-fit text-nowrap'>{eq.unit}</span>
                                                </div>
                                                <Button type='button' variant='destructive' size='sm' className='w-full md:w-fit' onClick={() => handleRemoveItem('laboratory_equipment', eq.id)}>Hapus</Button>
                                            </div>
                                            {hasEquipmentErrors && (
                                                <p className='text-xs italic text-red-500'>{errors[`laboratoryEquipments.${index}.quantity`]}</p>
                                            )}
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
                            <div className='font-semibold text-sm mb-2'>List Bahan Laboratorium</div>
                            <Table
                                data={laboratoryMaterials}
                                columns={LaboratoryMaterialColumn({ handleSelectItem, selectedIds: formData.laboratoryMaterials.map(m => m.id) })}
                                loading={isMaterialLoading}
                                searchTerm={materialTable.searchTerm}
                                handleSearch={materialTable.handleSearch}
                                perPage={materialTable.perPage}
                                handlePerPageChange={materialTable.handlePerPageChange}
                                totalPages={materialTable.totalPages}
                                totalItems={materialTable.totalItems}
                                currentPage={materialTable.currentPage}
                                handlePageChange={materialTable.handlePageChange}
                            />
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
                                    return (
                                        <div key={mt.id} className='flex flex-col gap-1 border rounded-md px-5 py-3 bg-background'>
                                            <div className='flex flex-col md:flex-row items-center gap-5'>
                                                <p className='md:max-w-40 w-full text-sm font-medium'>{mt.name}</p>
                                                <div className='flex gap-2 w-full items-center'>
                                                    <Input type='number' min={0} value={mt.quantity || ''} placeholder='Jumlah' onChange={(e) => handleChangeItem('laboratory_material', mt.id, Number(e.target.value))} />
                                                    <span className='text-sm font-medium w-fit text-nowrap'>{mt.unit}</span>
                                                </div>
                                                <Button type='button' variant='destructive' className='w-full md:w-fit' size='sm' onClick={() => handleRemoveItem('laboratory_material', mt.id)}>Hapus</Button>
                                            </div>
                                            {hasMaterialErrors && (
                                                <p className='text-xs italic text-red-500'>{errors[`laboratoryMaterials.${index}.quantity`]}</p>
                                            )}
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
                    onClick={() => setIsConfirmationOpen(true)}
                >Simpan</Button>
                <ConfirmationDialog open={isConfirmationOpen} onOpenChange={setIsConfirmationOpen} onConfirm={handleSubmit} />
            </div>
        </div>
    )
}

export default BookingRoomNEquipmentForm
