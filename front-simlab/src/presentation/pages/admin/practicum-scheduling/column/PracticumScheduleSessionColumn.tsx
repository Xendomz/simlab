import { PracticumSessionView } from "@/application/practicum-scheduling/PracticumSessionView";
import { Badge } from "@/presentation/components/ui/badge";
import { userRole } from "@/domain/User/UserRole";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/presentation/components/ui/button";

export const PracticumScheduleSessionColumn = (role?: userRole, isApproved: boolean): ColumnDef<PracticumSessionView>[] => {
  const columns: ColumnDef<PracticumSessionView>[] = [
    {
      header: 'Modul Praktikum',
      cell: ({ row }) => `${row.original.practicumModule?.name}`,
    },
    {
      header: 'Jadwal Praktikum',
      cell: ({ row }) => (
        <Badge variant={"secondary"}>{row.original.formattedDate()}</Badge>
      )
    }
  ];

  // Add a dummy/sample column only visible to Laboran
  if (isApproved) {
    if (role === userRole.Laboran) {
      columns.push({
        header: 'Status',
        cell: () => (
          <div className="flex gap-3">
            <Button size={'sm'}>Terlaksana</Button>
            <Button size={'sm'} variant={'destructive'}>Tidak Terlaksana</Button>
          </div>
        )
      });
      columns.push({
        header: 'Catatan Laboran',
        cell: () => (
          <div className="flex flex-col">
            <Badge variant={"secondary"}>Contoh</Badge>
            <span className="text-xs text-muted-foreground">Hanya untuk Laboran</span>
          </div>
        )
      });
    }
  }

  return columns;
};
