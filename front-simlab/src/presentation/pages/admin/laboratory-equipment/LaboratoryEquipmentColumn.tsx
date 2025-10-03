import { LaboratoryEquipmentView } from "@/application/laboratory-equipment/LaboratoryEquipmentView";
import { Button } from "@/presentation/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";

interface ColumnProps {
    openModal: (type: 'Add' | 'Edit', id?: number) => void;
    openConfirm: (id: number) => void;
    openModalDetail: (id: number) => void;
}

export const LaboratoryEquipmentColumn = ({ openModal, openConfirm, openModalDetail }: ColumnProps): ColumnDef<LaboratoryEquipmentView>[] => [
    { header: 'Kode Asset', accessorKey: 'assetCode' as keyof LaboratoryEquipmentView},
    { header: 'Nama Alat', accessorKey: 'equipmentName' as keyof LaboratoryEquipmentView},
    { header: 'Jumlah', accessorKey: 'quantity' as keyof LaboratoryEquipmentView, cell: ({ row }) => (<span>{row.original.quantity} {row.original.unit}</span>)},
    { header: 'Lokasi', accessorKey: 'laboratoryRoom' as keyof LaboratoryEquipmentView, cell: ({ row }) => row.original.laboratoryRoom?.name },
    { header: 'Jenis Alat', accessorKey: 'equipmentType' as keyof LaboratoryEquipmentView},
    { header: 'Asal Alat', accessorKey: 'origin' as keyof LaboratoryEquipmentView},
    {
        header: 'Action',
        accessorKey: 'id' as keyof LaboratoryEquipmentView,
        cell: ({ row }) => (
            <div className="flex gap-2">
                <Button size={'sm'} variant={'outline'} onClick={() => openModalDetail(row.original.id)}>
                    Detail
                </Button>
                <Button size={'sm'} onClick={() => openModal('Edit', row.original.id)}>
                    Edit
                </Button>
                <Button size={"sm"} variant={'destructive'} onClick={() => openConfirm(row.original.id)}>
                    Delete
                </Button>
            </div>
        )
    },
];
