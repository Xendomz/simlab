import { LaboratoryEquipmentView } from '@/application/laboratory-equipment/LaboratoryEquipmentView'
import Item from '@/presentation/components/Item'
import { Button } from '@/presentation/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/presentation/components/ui/dialog'
import { ScrollArea } from '@/presentation/components/ui/scroll-area'
import React, { useEffect, useState } from 'react'

interface LaboratoryEquipmentDetailDialogProps {
    laboratoryEquipments: LaboratoryEquipmentView[],
    laboratoryEquipmentId: number | null
    open: boolean,
    onOpenChange: (open: boolean) => void,
}

const LaboratoryEquipmentDetailDialog: React.FC<LaboratoryEquipmentDetailDialogProps> = ({
    laboratoryEquipments,
    laboratoryEquipmentId,
    open,
    onOpenChange
}) => {
    const [laboratoryEquipment, setLaboratoryEqupment] = useState<LaboratoryEquipmentView>();
    const [imageError, setImageError] = useState<boolean>(false);

    useEffect(() => {
        if (laboratoryEquipmentId) {
            const selectedLaboratoryEquipment = laboratoryEquipments.find((laboratoryEquipment) => laboratoryEquipment.id == laboratoryEquipmentId)
            setLaboratoryEqupment(selectedLaboratoryEquipment)
            setImageError(false)
        } else {
            setLaboratoryEqupment(undefined)
            setImageError(false);
        }
    }, [open])

    const handleImageError = () => {
        setImageError(true);
    };

    const hasValidPhoto = laboratoryEquipment &&
        laboratoryEquipment.photo &&
        laboratoryEquipment.photo.trim() !== '';

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Detail Alat Laboratorium</DialogTitle>
                </DialogHeader>
                <ScrollArea className='h-full max-h-[70vh] 2xl:max-h-[80vh]'>
                    <div className='flex flex-col gap-5 p-1'>
                        <div className="w-full grid sm:grid-cols-5 gap-5">
                            <div className='sm:col-span-2'>
                                {!imageError && hasValidPhoto ? (
                                    <img
                                        className='rounded-lg object-cover aspect-[4/3] sm:aspect-square w-full shadow-lg'
                                        src={`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/${laboratoryEquipment.photo}`}
                                        onError={handleImageError}
                                    />
                                ) : (
                                    <img
                                        className='rounded-lg object-cover aspect-[4/3] sm:aspect-square w-full shadow-lg'
                                        src={'/error-image.png'}
                                    />
                                )}
                            </div>
                            <div className='flex flex-col gap-5 sm:col-span-3'>
                                <div className='flex flex-col gap-1'>
                                    <h1 className="text-2xl sm:text-xl font-bold">{laboratoryEquipment?.equipmentName}</h1>
                                    <p className="text-muted-foreground text-sm">{laboratoryEquipment?.equipmentFunction ?? 'Deskripsi tidak tersedia'}</p>
                                </div>
                                <div className='grid gap-x-5 gap-y-2 sm:grid-cols-2'>
                                    <Item title='Kode Asset' value={laboratoryEquipment?.assetCode} />
                                    <Item title='Merek' value={laboratoryEquipment?.brand} />
                                    <Item title='Tipe Alat' value={laboratoryEquipment?.equipmentType} />
                                    <Item title='Jumlah Alat' value={`${laboratoryEquipment?.quantity} ${laboratoryEquipment?.unit}`} />
                                    <Item title='Lokasi Alat' value={laboratoryEquipment?.laboratoryRoom?.name} />
                                    <Item title='Kondisi Alat' value={laboratoryEquipment?.condition} />
                                    <Item title='Harga Mahasiswa' value={laboratoryEquipment?.studentPrice.formatToIDR()} />
                                    <Item title='Harga Dosen' value={laboratoryEquipment?.lecturerPrice.formatToIDR()} />
                                    <Item className='sm:col-span-2' title='Harga External' value={laboratoryEquipment?.externalPrice.formatToIDR()} />
                                    <Item className='sm:col-span-2' title='Keterangan' value={laboratoryEquipment?.conditionDescription} />
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollArea>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Tutup
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default LaboratoryEquipmentDetailDialog
