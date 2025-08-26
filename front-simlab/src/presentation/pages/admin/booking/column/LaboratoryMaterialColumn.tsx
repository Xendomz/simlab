import { LaboratoryMaterialView } from "@/application/laboratory-material/LaboratoryMaterialView";
import { Button } from "@/presentation/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";

interface ColumnProps {
	handleSelectLaboratoryMaterial: (data: LaboratoryMaterialView) => void,
	selectedIds?: number[]
}

export const LaboratoryMaterialColumn = ({ handleSelectLaboratoryMaterial, selectedIds = [] }: ColumnProps): ColumnDef<LaboratoryMaterialView>[] => [
	{ header: 'Kode Asset', accessorKey: 'code' as keyof LaboratoryMaterialView },
	{ header: 'Nama Bahan', accessorKey: 'materialName' as keyof LaboratoryMaterialView },
	{ header: 'Merek', accessorKey: 'brand' as keyof LaboratoryMaterialView },
	{ header: 'Jumlah', accessorKey: 'stock' as keyof LaboratoryMaterialView, cell: ({ row }) => (<span>{row.original.stock} {row.original.unit}</span>) },
	{ header: 'Lokasi Bahan', accessorKey: 'laboratoryRoom' as keyof LaboratoryMaterialView, cell: ({ row }) => row.original.laboratoryRoom?.name },
	{
		header: 'Action',
		accessorKey: 'id' as keyof LaboratoryMaterialView,
		cell: ({ row }) => {
			const alreadySelected = selectedIds.includes(row.original.id)
			return (
				<div className="flex gap-2">
					<Button
						size={'sm'}
						variant={alreadySelected ? 'secondary' : 'default'}
						disabled={alreadySelected}
						onClick={() => !alreadySelected && handleSelectLaboratoryMaterial(row.original)}
					>
						{alreadySelected ? 'Dipilih' : 'Pilih'}
					</Button>
				</div>
			)
		}
	}
];

