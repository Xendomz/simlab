import { PracticumSchedulingView } from "@/application/practicum-scheduling/PracticumSchedulingView";
import { PracticumSchedulingStatus } from "@/domain/practicum-scheduling/PracticumSchedulingStatus";
import { Badge } from "@/presentation/components/ui/badge";
import { Button } from "@/presentation/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { NavLink } from "react-router-dom";

export const PracticumSchedulingColumn = (): ColumnDef<PracticumSchedulingView>[] => [
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
        header: "Tanggal Pengajuan",
        accessorKey: 'createdAt',
        cell: ({ row }) => (
            `${row.original.createdAt.formatForInformation()}`
        )
    },
    {
        header: "Status Pengajuan",
        accessorKey: 'PracticumSchedulingStatus',
        cell: ({ row }) => {
            switch (row.original.status) {
                case PracticumSchedulingStatus.Draft:
                    return (
                        <Badge className="bg-secondary">Draft</Badge>
                    )
                case PracticumSchedulingStatus.Pending:
                    return (
                        <Badge className="bg-primary">Pending</Badge>
                    )

                case PracticumSchedulingStatus.Approved:
                    return (
                        <Badge className="bg-emerald-700">Disetujui</Badge>
                    )

                case PracticumSchedulingStatus.Revision:
                    return (
                        <Badge className="bg-yellow-500">Revisi</Badge>
                    )

                case PracticumSchedulingStatus.Rejected:
                    return (
                        <Badge className="bg-destructive">Ditolak</Badge>
                    )
            }
        }
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
            // if (row.original.status === 'revision') {
            //     return (
            //         <NavLink to={`/panel/penjadwalan-praktikum/${row.original.id}/manage`}>
            //             <Button size="sm">Revisi</Button>
            //         </NavLink>
            //     );
            // }
            return (
                <NavLink to={`/panel/penjadwalan-praktikum/${row.original.id}/detail`}>
                    <Button variant="secondary" size="sm">Detail</Button>
                </NavLink>
            );
        }
    }
];