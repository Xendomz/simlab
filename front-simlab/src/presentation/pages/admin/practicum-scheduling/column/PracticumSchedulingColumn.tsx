import { PracticumSchedulingView } from "@/application/practicum-scheduling/PracticumSchedulingView";
import { Button } from "@/presentation/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { NavLink } from "react-router-dom";

export const PracticumSchedulingColumn = (): ColumnDef<PracticumSchedulingView>[] => [
    {
        header: 'Praktikum',
        accessorKey: 'praktikumId',
        cell: ({ row }) => (
            `${row.original.practicum?.name}`
        )
    },
    {
        header: "Ruangan",
        accessorKey: 'laboratoryRoomId',
        cell: ({ row }) => (
            `${row.original.laboratoryRoom?.name}`
        )
    },
    {
        header: "Tanggal Pengajuan",
        accessorKey: 'createdAt',
        cell: ({ row }) => (
            `${row.original.createdAt.formatForInformation()}`
        )
    },
    {
        header: "Action",
        accessorKey: 'id',
        cell: ({ row }) => {
            if (row.original.status === 'draft') {
                return (
                    <NavLink to={`/panel/penjadwalan-praktikum/${row.original.id}/manage`}>
                        <Button size="sm">Lanjutkan</Button>
                    </NavLink>
                );
            }
            return (
                <NavLink to={`/panel/penjadwalan-praktikum/${row.original.id}/detail`}>
                    <Button variant="secondary" size="sm">Detail</Button>
                </NavLink>
            );
        }
    }
];