import { PracticumSchedulingMaterialView } from "@/application/practicum-scheduling/PracticumSchedulingMaterialView";
import { ColumnDef } from "@tanstack/react-table";

export const PracticumScheduleMaterialColumn = (): ColumnDef<PracticumSchedulingMaterialView>[] => [
    {
      id: 'name',
      header: 'Bahan',
      cell: ({ row }) => row.original.laboratoryMaterial?.materialName|| '-',
    },
    {
      accessorKey: 'quantity',
      header: 'Qty',
      cell: ({ row }) => `${row.original.quantity} ${row.original.laboratoryMaterial?.unit}`
    }
];
