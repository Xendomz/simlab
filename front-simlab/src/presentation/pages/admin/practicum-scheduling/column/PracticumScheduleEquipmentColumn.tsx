import { PracticumSchedulingEquipmentView } from "@/application/practicum-scheduling/PracticumSchedulingEquipmentView";
import { ColumnDef } from "@tanstack/react-table";

export const PracticumScheduleEquipmentColumn = (): ColumnDef<PracticumSchedulingEquipmentView>[] => [
    {
      id: 'name',
      header: 'Alat',
      cell: ({ row }) => row.original.laboratoryEquipment?.equipmentName|| '-',
    },
    {
      accessorKey: 'quantity',
      header: 'Qty',
      cell: ({ row }) => `${row.original.quantity} ${row.original.laboratoryEquipment?.unit}`
    }
];
