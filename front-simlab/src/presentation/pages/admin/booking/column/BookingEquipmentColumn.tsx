import { BookingEquipmentView } from "@/application/booking/BookingEquipmentView";
import { ColumnDef } from "@tanstack/react-table";

export const BookingEquipmentColumn = (): ColumnDef<BookingEquipmentView>[] => [
    {
      accessorKey: 'equipmentName',
      header: 'Alat',
    },
    {
      accessorKey: 'quantity',
      header: 'Qty',
      cell: ({ row }) => `${row.original.quantity} ${row.original.unit}`
    }
];
