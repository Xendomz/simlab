import { BookingMaterialtView } from "@/application/booking/BookingMaterialView";
import { ColumnDef } from "@tanstack/react-table";

export const BookingMaterialColumn = (): ColumnDef<BookingMaterialtView>[] => [
    {
      accessorKey: 'materialName',
      header: 'Bahan',
    },
    {
      accessorKey: 'quantity',
      header: 'Qty',
      cell: ({ row }) => `${row.original.quantity} ${row.original.unit}`
    }
];
