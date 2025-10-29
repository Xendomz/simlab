import { userRole } from "@/domain/User/UserRole";
import { CalendarClock, CalendarPlus, Key, LayoutDashboard, SquareTerminal } from "lucide-react"

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    url: "/panel",
    icon: LayoutDashboard,
    is_end: true,
    // roles: [userRole.Admin, userRole.KepalaLabTerpadu,userRole.Kooprodi, userRole.KepalaLabJurusan,  userRole.Laboran,userRole.Mahasiswa,userRole.PihakLuar,userRole.Dosen' ],
    roles: [userRole.Admin, userRole.KepalaLabTerpadu, userRole.Kooprodi, userRole.KepalaLabJurusan, userRole.Laboran, userRole.Mahasiswa, userRole.PihakLuar, userRole.Dosen, userRole.AdminKeuangan ],
  },
  {
    title: "Data Master",
    url: "#",
    icon: Key,
    roles: [userRole.Admin, userRole.Laboran],
    items: [
      { title: "Tahun Akademik", url: "/panel/tahun-akademik", roles: [userRole.Admin] },
      { title: "Fakultas", url: "/panel/fakultas", roles: [userRole.Admin] },
      { title: "Jurusan", url: "/panel/jurusan", roles: [userRole.Admin] },
      { title: "Prodi", url: "/panel/prodi", roles: [userRole.Admin] },
      { title: "Praktikum", url: "/panel/praktikum", roles: [userRole.Admin] },
      { title: "Modul Praktikum", url: "/panel/modul-praktikum", roles: [userRole.Admin] },
      { title: "Jenis Pengujian", url: "/panel/jenis-pengujian", roles: [userRole.Admin] },
      { title: "Ruangan Laboratorium", url: "/panel/ruangan-laboratorium", roles: [userRole.Admin, userRole.Laboran] },
      { title: "Alat Laboratorium", url: "/panel/alat-laboratorium", roles: [userRole.Admin, userRole.Laboran] },
      { title: "Bahan Laboratorium", url: "/panel/bahan-laboratorium", roles: [userRole.Admin, userRole.Laboran] },
    ],
  },
  {
    title: "Manajemen User",
    url: "#",
    icon: SquareTerminal,
    roles: [userRole.Admin],
    items: [
      { title: "Admin", url: "/panel/admin", roles: [userRole.Admin] },
      { title: "Kepala Lab Terpadu", url: "/panel/kepala-lab-terpadu", roles: [userRole.Admin] },
      { title: "Koorprodi", url: "/panel/koorprodi", roles: [userRole.Admin] },
      { title: "Kepala Lab Jurusan", url: "/panel/kepala-lab-jurusan", roles: [userRole.Admin] },
      { title: "Dosen", url: "/panel/dosen", roles: [userRole.Admin] },
      { title: "Laboran", url: "/panel/laboran", roles: [userRole.Admin] },
      { title: "Mahasiswa", url: "/panel/mahasiswa", roles: [userRole.Admin] },
      { title: "Pihak Luar", url: "/panel/pihak-luar", roles: [userRole.Admin] },
    ],
  },
  {
    title: "Peminjaman",
    url: "/panel/peminjaman",
    icon: CalendarClock,
    roles: [userRole.Kooprodi, userRole.KepalaLabJurusan, userRole.Mahasiswa,userRole.PihakLuar,userRole.Dosen],
  },
  {
    title: "Penjadwalan Praktikum",
    url: "/panel/penjadwalan-praktikum",
    icon: CalendarPlus,
    roles: [userRole.KepalaLabJurusan, userRole.Dosen],
  },
  {
    title: "Manajemen Peminjaman",
    url: "#",
    icon: CalendarClock,
    roles: [userRole.KepalaLabTerpadu, userRole.Laboran],
    items: [
      // { title: "Peminjaman", url: "/panel/peminjaman", roles: [userRole.KepalaLabTerpadu]},
      { title: "Verifikasi Peminjaman", url: "/panel/peminjaman/verif", roles: [userRole.KepalaLabTerpadu, userRole.Laboran]},
    ],
  },
  {
    title: "Manajemen Penjadwalan Praktikum",
    url: "#",
    icon: CalendarPlus,
    roles: [userRole.KepalaLabTerpadu, userRole.Laboran, userRole.KepalaLabJurusan],
    items: [
      // { title: "Peminjaman", url: "/panel/peminjaman", roles: [userRole.KepalaLabTerpadu]},
      { title: "Verifikasi Penjadwalan Praktikum", url: "/panel/penjadwalan-praktikum/verif", roles: [userRole.KepalaLabTerpadu, userRole.Laboran, userRole.Kooprodi]},
    ],
  },
]

interface NavSubItem {
    title: string;
    url: string;
    roles: userRole[];
}

interface NavItem {
    title: string;
    url: string;
    icon?: any;
    is_end?: boolean;
    roles: userRole[];
    items?: NavSubItem[];
}

export function filterNavByRole(navItems: NavItem[], role: userRole): NavItem[] {
    return navItems
        .filter(item => item.roles.includes(role))
        .map(item => {
            if (item.items) {
                const filteredItems = item.items.filter(sub => sub.roles.includes(role));
                if (filteredItems.length === 0) return null;
                return { ...item, items: filteredItems };
            }
            return item;
        })
        .filter(Boolean) as NavItem[]; // remove null
}