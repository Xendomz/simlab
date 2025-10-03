import { PracticumGroupView } from "@/application/practicum-scheduling/PracticumClassView";
import { Badge } from "@/presentation/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";

export const PracticumScheduleGroupColumn = (): ColumnDef<PracticumGroupView>[] => [
    {
      header: 'Kelompok & Sesi',
      cell: ({ row }) => `${row.original.groupName} | ${row.original.practicumSession}`,
    },
    {
        header: 'Jumlah Praktikan',
        cell: ({ row }) => `${row.original.totalParticipant}`
    },
    {
      header: 'Assisten Praktikum',
      cell: ({ row }) => `${row.original.practicumAssistant || '-'}`,
    },
    {
        header: "Tanggal Praktikum",
        accessorKey: 'startTime',
        cell: ({ row }) => (
            <Badge variant={"secondary"}>{row.original.startTime.formatForInformation()} | {row.original.endTime.formatForInformation()}</Badge>
        )
    },
];
