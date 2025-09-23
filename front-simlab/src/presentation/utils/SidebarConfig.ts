import { CalendarClock, CalendarPlus, Key, LayoutDashboard, SquareTerminal } from "lucide-react"

export const navItems = [
  {
    title: "Dashboard",
    url: "/panel",
    icon: LayoutDashboard,
    is_end: true,
    roles: ['Admin', 'Kepala Lab Terpadu','Koorprodi', 'Kepala Lab Unit', 'Laboran','Mahasiswa','Pihak Luar', 'Dosen' ],
  },
  {
    title: "Data Master",
    url: "#",
    icon: Key,
    roles: ['Admin', 'Laboran'],
    items: [
      { title: "Tahun Akademik", url: "/panel/tahun-akademik", roles: ['Admin', 'Kepala Lab Terpadu'] },
      { title: "Jenis Pengujian", url: "/panel/jenis-pengujian", roles: ['Admin', 'Kepala Lab Terpadu'] },
      { title: "Fakultas", url: "/panel/fakultas", roles: ['Admin'] },
      { title: "Jurusan", url: "/panel/jurusan", roles: ['Admin', 'Kepala Lab Terpadu'] },
      { title: "Prodi", url: "/panel/Prodi", roles: ['Admin', 'Kepala Lab Terpadu'] },
      { title: "Praktikum", url: "/panel/Praktikum", roles: ['Admin', 'Kepala Lab Terpadu'] },
      { title: "Ruangan Laboratorium", url: "/panel/ruangan-laboratorium", roles: ['Admin', 'Kepala Lab Terpadu', 'Laboran'] },
      { title: "Alat Laboratorium", url: "/panel/alat-laboratorium", roles: ['Admin', 'Kepala Lab Terpadu', 'Laboran'] },
      { title: "Bahan Laboratorium", url: "/panel/bahan-laboratorium", roles: ['Admin', 'Kepala Lab Terpadu', 'Laboran'] },
    ],
  },
  {
    title: "Manajemen User",
    url: "#",
    icon: SquareTerminal,
    roles: ['Admin'],
    items: [
      { title: "Admin", url: "/panel/admin", roles: ['Admin'] },
      { title: "Kepala Lab Terpadu", url: "/panel/kepala-lab-terpadu", roles: ['Admin'] },
      { title: "Koorprodi", url: "/panel/koorprodi", roles: ['Admin'] },
      { title: "Kepala Lab. Unit", url: "/panel/kepala-lab-unit", roles: ['Admin'] },
      { title: "Dosen", url: "/panel/dosen", roles: ['Admin'] },
      { title: "Laboran", url: "/panel/laboran", roles: ['Admin'] },
      { title: "Mahasiswa", url: "/panel/mahasiswa", roles: ['Admin'] },
      { title: "Pihak Luar", url: "/panel/pihak-luar", roles: ['Admin'] },
    ],
  },
  {
    title: "Peminjaman",
    url: "/panel/peminjaman",
    icon: CalendarClock,
    roles: ['Koorprodi', 'Kepala Lab Unit','Mahasiswa','Pihak Luar','Dosen'],
  },
  {
    title: "Penjadwalan Praktikum",
    url: "/panel/penjadwalan-praktikum",
    icon: CalendarPlus,
    roles: ['Dosen'],
  },
  {
    title: "Manajemen Peminjaman",
    url: "#",
    icon: CalendarClock,
    roles: ['Kepala Lab Terpadu', 'Laboran'],
    items: [
      // { title: "Peminjaman", url: "/panel/peminjaman", roles: ['Kepala Lab Terpadu']},
      { title: "Verifikasi Peminjaman", url: "/panel/peminjaman/verif", roles: ['Kepala Lab Terpadu', 'Laboran']},
    ],
  },
  {
    title: "Manajemen Penjadwalan Praktikum",
    url: "#",
    icon: CalendarPlus,
    roles: ['Kepala Lab Terpadu', 'Laboran', 'Koorprodi'],
    items: [
      // { title: "Peminjaman", url: "/panel/peminjaman", roles: ['Kepala Lab Terpadu']},
      { title: "Verifikasi Penjadwalan Praktikum", url: "/panel/penjadwalan-praktikum/verif", roles: ['Kepala Lab Terpadu', 'Laboran', 'Koorprodi']},
    ],
  },
]

interface NavSubItem {
    title: string;
    url: string;
    roles: string[];
}

interface NavItem {
    title: string;
    url: string;
    icon?: any;
    is_end?: boolean;
    roles: string[];
    items?: NavSubItem[];
}

export function filterNavByRole(navItems: NavItem[], role: string): NavItem[] {
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