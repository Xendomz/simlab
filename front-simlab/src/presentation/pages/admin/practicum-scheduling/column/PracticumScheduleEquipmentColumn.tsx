import { PracticumSchedulingEquipmentView } from "@/application/practicum-scheduling/PracticumSchedulingEquipmentView";
import { ColumnDef } from "@tanstack/react-table";

export const PracticumScheduleEquipmentColumn = (): ColumnDef<PracticumSchedulingEquipmentView>[] => [
    {
      id: 'name',
      header: 'Alat',
      cell: ({ row }) => {
        const name = (row.original as any).name || '-';
        return name;
      },
    },
    {
      accessorKey: 'quantity',
      header: 'Qty',
      cell: ({ row }) => {
        const unit = (row.original as any).unit || '';
        return `${row.original.quantity}${unit ? ` ${unit}` : ''}`;
      }
    }
];
