import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { useEffect, useRef, useState, useCallback } from 'react'
import { PracticumSchedulingEquipmentNMaterialInputDTO } from '@/application/practicum-scheduling/dto/PracticumSchedulingDTO'
import { useNavigate, useParams } from 'react-router-dom'
import { usePracticumScheduling } from '@/application/practicum-scheduling/hooks/usePracticumScheduling'
import { toast } from 'sonner'
import { useValidationErrors } from '@/presentation/hooks/useValidationError'
import useTable from '@/application/hooks/useTable'
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import { Skeleton } from '@/presentation/components/ui/skeleton'
import Table from '@/presentation/components/Table'
import { LaboratoryEquipmentColumn } from '@/presentation/pages/admin/booking/column/LaboratoryEquipmentColumn'
import { LaboratoryMaterialColumn } from '@/presentation/pages/admin/booking/column/LaboratoryMaterialColumn'
import { Button } from '@/presentation/components/ui/button'

// import { useLaboratoryEquipment } from '@/application/laboratory-equipment/hooks/useLaboratoryEquipment'
// import { useLaboratoryMaterial } from '@/application/laboratory-material/hooks/useLaboratoryMaterial'
import { Input } from '@/presentation/components/ui/input'
import { LaboratoryEquipmentView } from '@/application/laboratory-equipment/LaboratoryEquipmentView'
import { LaboratoryMaterialView } from '@/application/laboratory-material/LaboratoryMaterialView'

const PracticumScheduleEquipmentNMaterialForm = () => {
    const sectionRef = useRef<HTMLDivElement | null>(null)
    useGSAP(() => {
        if (!sectionRef.current) return
        gsap.fromTo(sectionRef.current, { opacity: 0, y: 100 }, { opacity: 1, y: 0, duration: 1 })
    }, [])

    const [formData, setFormData] = useState<PracticumSchedulingEquipmentNMaterialInputDTO>({
        practicumSchedulingEquipments: [],
        practicumSchedulingMaterials: []
    })

    const [isSubmitting, setIsSubmitting] = useState(false)
    const { id } = useParams()
    const navigate = useNavigate();
    const practicumSchedulingId = id ? Number(id) : undefined
    const { storePracticumSchedulingEquipmentMaterial } = usePracticumScheduling({})

    // Handlers Equipment & Material (grouped, useCallback for perf)
    const handleSelectLaboratoryEquipment = useCallback((data: LaboratoryEquipmentView) => {
        setFormData(prev => {
            const exists = prev.practicumSchedulingEquipments.some(eq => eq.id === data.id);
            return {
                ...prev,
                practicumSchedulingEquipments: exists
                    ? prev.practicumSchedulingEquipments.filter(eq => eq.id !== data.id)
                    : [...prev.practicumSchedulingEquipments, { id: data.id, name: data.equipmentName, quantity: 0, unit: data.unit }]
            };
        });
    }, []);

    const handleChangeEquipmentQuantity = useCallback((id: number, quantity: number) => {
        setFormData(prev => ({
            ...prev,
            practicumSchedulingEquipments: prev.practicumSchedulingEquipments.map(eq => eq.id === id ? { ...eq, quantity } : eq)
        }));
    }, []);

    const removeEquipment = useCallback((id: number) => {
        setFormData(prev => ({
            ...prev,
            practicumSchedulingEquipments: prev.practicumSchedulingEquipments.filter(eq => eq.id !== id)
        }));
    }, []);

    const handleSelectLaboratoryMaterial = useCallback((data: LaboratoryMaterialView) => {
        setFormData(prev => {
            const exists = prev.practicumSchedulingMaterials.some(mt => mt.id === data.id);
            return {
                ...prev,
                practicumSchedulingMaterials: exists
                    ? prev.practicumSchedulingMaterials.filter(mt => mt.id !== data.id)
                    : [...prev.practicumSchedulingMaterials, { id: data.id, name: data.materialName, quantity: 0, unit: data.unit }]
            };
        });
    }, []);

    const handleChangeMaterialQuantity = useCallback((id: number, quantity: number) => {
        setFormData(prev => ({
            ...prev,
            practicumSchedulingMaterials: prev.practicumSchedulingMaterials.map(mt => mt.id === id ? { ...mt, quantity } : mt)
        }));
    }, []);

    const removeMaterial = useCallback((id: number) => {
        setFormData(prev => ({
            ...prev,
            practicumSchedulingMaterials: prev.practicumSchedulingMaterials.filter(mt => mt.id !== id)
        }));
    }, []);

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
        if (!practicumSchedulingId) return;
        setIsSubmitting(true);
        try {
            const res = await storePracticumSchedulingEquipmentMaterial(practicumSchedulingId, formData);
            toast.success(res.message);
            navigate('/panel/penjadwalan-praktikum');
        } catch (e: any) {
            toast.error(e?.message || 'Gagal submit');
            processErrors(e.errors);
        } finally {
            setIsSubmitting(false);
        }
    }

    // Helpers to collect group errors
    const hasEquipmentErrors = Object.keys(errors).some(k => k.startsWith('practicumSchedulingEquipments'));
    const hasMaterialErrors = Object.keys(errors).some(k => k.startsWith('practicumSchedulingMaterials'));
    const getQuantityError = (type: 'practicumSchedulingEquipments' | 'practicumSchedulingMaterials', index: number) =>
        errors[`${type}.${index}.quantity`] || errors[`${type}.${index}.id`] || errors[`${type}.${index}`];

    return (
        <div ref={sectionRef} className='flex flex-col gap-6'>
            {/* === Equipment Section === */}
            <Card>
                <CardHeader><CardTitle>Ajukan Peminjaman Alat Laboratorium</CardTitle></CardHeader>
                <CardContent>
                    <div className='grid lg:grid-cols-2 xl:grid-cols-3 gap-5'>
                        <div className='xl:col-span-2 overflow-x-auto'>
                            <div className='font-semibold text-sm mb-5'>List Alat Laboratorium</div>
                            {isEquipmentLoading ? (
                                <div className='flex flex-col gap-3'>
                                    {[...Array(5)].map((_, i) => <Skeleton key={i} className='w-full h-9 rounded-md' />)}
                                </div>
                            ) : (
                                <Table
                                    data={laboratoryEquipment}
                                    columns={LaboratoryEquipmentColumn({ handleSelectLaboratoryEquipment, selectedIds: formData.practicumSchedulingEquipments.map(e => e.id) })}
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
                            <div className='font-semibold text-sm mb-2'>Daftar Alat yang dibutuhkan</div>
                            {errors['practicumSchedulingEquipments'] && (
                                <p className='mb-2 text-xs italic text-red-500'>{errors['practicumSchedulingEquipments']}</p>
                            )}
                            {!errors['practicumSchedulingEquipments'] && hasEquipmentErrors && (
                                <p className='mb-2 text-xs italic text-red-500'>Periksa kembali input alat yang dipilih.</p>
                            )}
                            <div className='flex flex-col gap-3'>
                                {formData.practicumSchedulingEquipments.length === 0 && <p className='text-sm text-muted-foreground'>Belum ada alat yang dipilih. Klik tombol Pilih pada tabel.</p>}
                                {formData.practicumSchedulingEquipments.map((eq, index) => {
                                    const rowError = getQuantityError('practicumSchedulingEquipments', index)
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

            {/* === Material Section === */}
            <Card>
                <CardHeader><CardTitle>Ajukan Peminjaman Bahan Laboratorium</CardTitle></CardHeader>
                <CardContent>
                    <div className='grid lg:grid-cols-2 xl:grid-cols-3 gap-5'>
                        <div className='xl:col-span-2 w-full overflow-x-auto'>
                            <div className='font-semibold text-sm mb-5'>List Bahan Laboratorium</div>
                            {isMaterialLoading ? (
                                <div className='flex flex-col gap-3'>
                                    {[...Array(5)].map((_, i) => <Skeleton key={i} className='w-full h-9 rounded-md' />)}
                                </div>
                            ) : (
                                <Table
                                    data={laboratoryMaterial}
                                    columns={LaboratoryMaterialColumn({ handleSelectLaboratoryMaterial, selectedIds: formData.practicumSchedulingMaterials.map(m => m.id) })}
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
                            <div className='font-semibold text-sm mb-2'>Daftar Bahan yang dibutuhkan</div>
                            {errors['practicumSchedulingMaterials'] && (
                                <p className='mb-2 text-xs italic text-red-500'>{errors['practicumSchedulingMaterials']}</p>
                            )}
                            {!errors['practicumSchedulingMaterials'] && hasMaterialErrors && (
                                <p className='mb-2 text-xs italic text-red-500'>Periksa kembali input bahan yang dipilih.</p>
                            )}
                            <div className='flex flex-col gap-3'>
                                {formData.practicumSchedulingMaterials.length === 0 && <p className='text-sm text-muted-foreground'>Belum ada bahan yang dipilih. Klik tombol Pilih pada tabel.</p>}
                                {formData.practicumSchedulingMaterials.map((mt, index) => {
                                    const rowError = getQuantityError('practicumSchedulingMaterials', index)
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

            {/* === Submit Button === */}
            <div className='flex justify-end'>
                <Button
                    type='button'
                    disabled={isSubmitting || !practicumSchedulingId}
                    onClick={handleSubmit}
                >{isSubmitting ? 'Submitting...' : 'Submit'}</Button>
            </div>
        </div>
    )
}

export default PracticumScheduleEquipmentNMaterialForm
