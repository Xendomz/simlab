import { BookingMaterialtView } from "@/application/booking/BookingMaterialView";
import { ColumnDef } from "@tanstack/react-table";

export const BookingMaterialColumn = (): ColumnDef<BookingMaterialtView>[] => [
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
