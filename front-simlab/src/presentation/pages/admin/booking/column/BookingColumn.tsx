import { BookingView } from "@/application/booking/BookingView";
import { BookingStatus } from "@/domain/booking/BookingStatus";
import { BookingType } from "@/domain/booking/BookingType";
import { Badge } from "@/presentation/components/ui/badge";
import { Button } from "@/presentation/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { NavLink } from "react-router-dom";
import BookingBadgeStatus from "../components/BookingBadgeStatus";

export const BookingColumn = (): ColumnDef<BookingView>[] => [
    {
        header: 'Tahun Akademik',
        accessorKey: 'academicYear'
    },
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
    {
        header: "Status Peminjaman",
        accessorKey: 'BookingStatus',
        cell: ({ row }) => {
            return (
                <BookingBadgeStatus status={row.original.status}/>
            )
        }
    },
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