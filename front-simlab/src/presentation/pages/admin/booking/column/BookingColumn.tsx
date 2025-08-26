import { BookingView } from "@/application/booking/BookingView";
import { BookingStatus } from "@/domain/booking/BookingStatus";
import { BookingType } from "@/domain/booking/BookingType";
import { Badge } from "@/presentation/components/ui/badge";
import { Button } from "@/presentation/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { NavLink } from "react-router-dom";

export const BookingColumn = (): ColumnDef<BookingView>[] => [
    {
        header: 'Kebutuhan Peminjaman',
        accessorKey: 'purpose',
    },
    {
        header: "Judul Proyek / Penelitian",
        accessorKey: 'activityName',
    },
    {
        header: "Tanggal Pengajuan",
        accessorKey: 'startTime',
        cell: ({ row }) => (
            <Badge variant={"secondary"}>{row.original.startTime.formatForInformation()} | {row.original.endTime.formatForInformation()}</Badge>
        )
    },
    {
        header: "Jenis Peminjaman",
        accessorKey: 'bookingType',
        cell: ({ row }) => {
            let type: string = ''
            switch (row.original.bookingType) {
                case BookingType.Room:
                    type = 'Peminjaman Ruangan'
                    break;

                case BookingType.RoomNEquipment:
                    type = 'Peminjaman Ruangan dan Alat'
                    break;

                case BookingType.Equipment:
                    type = 'Peminjaman Alat'
                    break;

                default:
                    break;
            }
            return (
                <Badge variant={"default"}>{type}</Badge>
            )
        }
    },
    // {
    //     header: "Status Peminjaman",
    //     accessorKey: 'BookingStatus',
    //     cell: ({ row }) => {
    //         switch (row.original.status) {
    //             case BookingStatus.Draft:
    //                 return (
    //                     <div className="bg-slate-100 inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden">
    //                         Draft
    //                     </div>
    //                 )
    //             case BookingStatus.Pending:
    //                 return (
    //                     <div className="bg-sky-100 inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden">
    //                         Pending
    //                     </div>
    //                 )

    //             case BookingStatus.Approved:
    //                 return (
    //                     <div className="bg-emerald-100 inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden">
    //                         Draft
    //                     </div>
    //                 )

    //             case BookingStatus.Rejected:
    //                 return (
    //                     <div className="bg-red-100 inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden">
    //                         Draft
    //                     </div>
    //                 )
    //         }
    //     }
    // },
    {
        header: "Action",
        accessorKey: 'id',
        cell: ({ row }) => {
            if (row.original.status === BookingStatus.Draft) {
                return (
                    <NavLink to={`/panel/peminjaman/${row.original.id}/manage`}>
                        <Button size="sm">Lanjutkan</Button>
                    </NavLink>
                );
            }
            return (
                <NavLink to={`/panel/peminjaman/${row.original.id}/detail`}>
                    <Button variant="secondary" size="sm">Detail</Button>
                </NavLink>
            );
        }
    }
];