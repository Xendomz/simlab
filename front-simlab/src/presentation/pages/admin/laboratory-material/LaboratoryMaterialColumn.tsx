import { ColumnDef } from "@tanstack/react-table";
import { LaboratoryMaterialView } from "@/application/laboratory-material/LaboratoryMaterialView";
import { Button } from "@/presentation/components/ui/button";

interface ColumnProps {
    openModal: (type: 'Add' | 'Edit', id?: number) => void;
    openConfirm: (id: number) => void;
    openModalDetail: (id: number) => void;
}

export const LaboratoryMaterialColumn = ({ openModal, openConfirm, openModalDetail }: ColumnProps): ColumnDef<LaboratoryMaterialView>[] => [
    { header: 'Kode Asset', accessorKey: 'code' as keyof LaboratoryMaterialView },
    { header: 'Nama Bahan', accessorKey: 'materialName' as keyof LaboratoryMaterialView },
    { header: 'Jumlah', accessorKey: 'stock' as keyof LaboratoryMaterialView, cell: ({ row }) => (<span>{row.original.stock} - {row.original.unit}</span>)},
    { header: 'Lokasi', accessorKey: 'laboratorRoom' as keyof LaboratoryMaterialView, cell: ({ row }) => row.original.laboratoryRoom?.name },
    { header: 'Tanggal Kadaluarsa', accessorKey: 'expiryDate' as keyof LaboratoryMaterialView, cell: ({ row }) => {
        const date = new Date(row.original.expiryDate)
        const formatted = `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

        return formatted
    }},
    { header: 'Tanggal Restock Terakhir', accessorKey: 'refillDate' as keyof LaboratoryMaterialView, cell: ({ row }) => {
        const date = new Date(row.original.refillDate)
        const formatted = `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

        return formatted
    }},
    {
        header: 'Action',
        accessorKey: 'id' as keyof LaboratoryMaterialView,
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
