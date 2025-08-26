import { BookingEquipmentView } from "@/application/booking/BookingEquipmentView";
import { ColumnDef } from "@tanstack/react-table";

export const BookingEquipmentColumn = (): ColumnDef<BookingEquipmentView>[] => [
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
