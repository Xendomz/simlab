import { LaboratoryEquipmentView } from "@/application/laboratory-equipment/LaboratoryEquipmentView";
import { Button } from "@/presentation/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";

interface columnProps {
    handleSelectLaboratoryEquipment: (data: LaboratoryEquipmentView) => void,
    selectedIds?: number[]
}

export const LaboratoryEquipmentColumn = ({ handleSelectLaboratoryEquipment, selectedIds = [] }: columnProps): ColumnDef<LaboratoryEquipmentView>[] => [
    { header: 'Kode Asset', accessorKey: 'assetCode' as keyof LaboratoryEquipmentView},
    { header: 'Nama Alat', accessorKey: 'equipmentName' as keyof LaboratoryEquipmentView},
    { header: 'Jumlah', accessorKey: 'quantity' as keyof LaboratoryEquipmentView, cell: ({ row }) => ( <div>{row.original.quantity} {row.original.unit}</div> )},
    { header: 'Lokasi Alat', accessorKey: 'ruanganLaboratorium' as keyof LaboratoryEquipmentView, cell: ({ row }) => row.original.ruanganLaboratorium?.name },
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
                        onClick={() => !alreadySelected && handleSelectLaboratoryEquipment(row.original)}
                    >
                        {alreadySelected ? 'Dipilih' : 'Pilih'}
                    </Button>
                </div>
            )
        }
    },
];
