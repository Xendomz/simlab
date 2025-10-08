import { PracticumSessionView } from "@/application/practicum-scheduling/PracticumSessionView";
import { Badge } from "@/presentation/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";

export const PracticumScheduleSessionColumn = (): ColumnDef<PracticumSessionView>[] => [
    {
      header: 'Modul Praktikum',
      cell: ({ row }) => `${row.original.practicumModule?.name}`,
    },
    {
        header: 'Jadwal Praktikum',
        cell: ({ row }) => (
          <Badge variant={"secondary"}>{row.original.formattedDate()}</Badge>
        )
    },
];
