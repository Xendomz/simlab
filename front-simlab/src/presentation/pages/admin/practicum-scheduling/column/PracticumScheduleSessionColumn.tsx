import { PracticumSessionView } from "@/application/practicum-scheduling/PracticumSessionView";
import { Badge } from "@/presentation/components/ui/badge";
import { userRole } from "@/domain/User/UserRole";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/presentation/components/ui/button";

const renderConductedStatusBadge = (status: boolean) => {
  if (status) {
    return <Badge variant={'success'}>Terlaksana</Badge>
  }
  return <Badge variant={'destructive'}>Tidak Terlaksana</Badge>
}

export const PracticumScheduleSessionColumn = (handleOpenConductionConfirm: (id: number, status: boolean) => void, role: userRole, isApproved: boolean = false): ColumnDef<PracticumSessionView>[] => {
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
    columns.push({
      header: 'Status',
      cell: ({ row }) => {
        const data = row.original;

        if (!data.isAllowToConducted()) {
          return <Badge>Belum masuk minggu pelaksanaan kelas</Badge>;
        }

        if (data.isClassConducted === null) {
          if (role === userRole.Laboran) {
            return (
              <div className="flex gap-3">
                <Button
                  size="sm"
                  onClick={() => handleOpenConductionConfirm(data.id, true)}
                >
                  Terlaksana
                </Button>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleOpenConductionConfirm(data.id, false)}
                >
                  Tidak Terlaksana
                </Button>
              </div>
            );
          }
          return <Badge>Menunggu Konfirmasi Laboran</Badge>
        }

        return renderConductedStatusBadge(Boolean(data.isClassConducted));
      }
    });
    if ([userRole.Laboran, userRole.KepalaLabJurusan, userRole.KepalaLabTerpadu].includes(role)) {
      columns.push({
        header: 'Catatan Laboran',
        cell: ({ row }) => {
          if (row.original.laboranComment?.trim()) {
            return (
              <div className="flex flex-col">
                <span className="font-medium">{row.original.laboranComment}</span>
                <span className="text-muted-foreground text-xs">{row.original.laboranCommentedAt?.formatForInformation()}</span>
              </div>
            )
          }

          return <span>-</span>
        }
      });
    }
  }

  return columns;
};
