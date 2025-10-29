import { PracticumSchedulingView } from "@/application/practicum-scheduling/PracticumSchedulingView";
import { Button } from "@/presentation/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { NavLink } from "react-router-dom";

export const PracticumSchedulingByLecturerColumn = (): ColumnDef<PracticumSchedulingView>[] => [
    {
        header: 'Tahun Akademik',
        accessorKey: 'academicYear',
        cell: ({ row }) => (
            `${row.original.academicYear?.name}`
        )
    },
    {
        header: 'Praktikum',
        accessorKey: 'praktikumId',
        cell: ({ row }) => (
            `${row.original.practicum?.name}`
        )
    },
    {
        header: 'Pemohon',
        accessorKey: 'userId',
        cell: ({ row }) => (
            `${row.original.user?.name}`
        )
    },
    {
        header: 'Total Kelas yang Diampu',
        accessorKey: 'practicumClasses',
        cell: ({ row }) => (
            `${row.original.getTotalClass()} Kelas`
        )
    },
    {
        header: "Action",
        accessorKey: 'id',
        cell: ({ row }) => {
            return (
                <NavLink to={`/panel/penjadwalan-praktikum/${row.original.id}/detail`}>
                    <Button variant="secondary" size="sm">Detail</Button>
                </NavLink>
            );
        }
    }
]