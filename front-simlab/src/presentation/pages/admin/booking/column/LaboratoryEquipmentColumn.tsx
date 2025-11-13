import { LaboratoryEquipmentView } from "@/application/laboratory-equipment/LaboratoryEquipmentView";
import { Button } from "@/presentation/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";

interface columnProps {
    handleSelectItem: (type: 'laboratory_equipment' | 'laboratory_material', data: LaboratoryEquipmentView) => void,
    selectedIds?: number[]
}

export const LaboratoryEquipmentColumn = ({ handleSelectItem, selectedIds = [] }: columnProps): ColumnDef<LaboratoryEquipmentView>[] => [
    { header: 'Kode Asset', accessorKey: 'assetCode' as keyof LaboratoryEquipmentView},
    { header: 'Nama Alat', accessorKey: 'equipmentName' as keyof LaboratoryEquipmentView},
    { header: 'Jumlah', accessorKey: 'quantity' as keyof LaboratoryEquipmentView, cell: ({ row }) => ( <div>{row.original.quantity} {row.original.unit}</div> )},
    { header: 'Lokasi Alat', accessorKey: 'laboratoryRoom' as keyof LaboratoryEquipmentView, cell: ({ row }) => row.original.laboratoryRoom?.name },
    {
        header: 'Action',
        accessorKey: 'id' as keyof LaboratoryEquipmentView,
        cell: ({ row }) => {
            const alreadySelected = selectedIds.includes(row.original.id)
            return (
                <div className="flex gap-2">
                    <Button
                        size={'sm'}
                        variant={alreadySelected ? 'secondary' : 'default'}
                        disabled={alreadySelected}
                        onClick={() => !alreadySelected && handleSelectItem('laboratory_equipment', row.original)}
                    >
                        {alreadySelected ? 'Dipilih' : 'Pilih'}
                    </Button>
                </div>
            )
        }
    },
];
