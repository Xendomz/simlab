import React, { useState } from "react";
import { NavLink } from "react-router-dom"; // only if you’re using react-router

type MenuItem = {
    label: string;
    href?: string;            // link for normal item
    external?: boolean;       // true = open as external <a>
    children?: MenuItem[];    // dropdown items
};

const menuItems: MenuItem[] = [
    { label: "Beranda", href: "/" },
    { label: "Tentang Kami", href: "/tentang" },
    { label: "Berita", href: "/berita" },
    {
        label: "Fasilitas",
        children: [
            { label: "Alat Laboratorium", href: "/alat" },
            { label: "Ruangan Laboratorium", href: "/ruang" },
        ],
    },
    {
        label: "Jadwal",
        children: [
            { label: "Alat Laboratorium", href: "/alat" },
            { label: "Ruangan Laboratorium", href: "/ruang" },
        ],
    },
    {
        label: "Layanan",
        children: [
            { label: "Penelitian", href: "/alat" },
            { label: "Pengabdian Masyarakat", href: "/ruang" },
            { label: "Pengujian", href: "/ruang" },
        ],
    },
    { label: "Unduh", href: "/contacts" },
    { label: "Kontak", href: "https://example.com/numbers", external: true },
];


interface HeaderProps {
    className?: string
}

const Header: React.FC<HeaderProps> = ({ className }) => {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    return (
        <>
            <div className={`${className} w-full bg-white py-3 px-10 xl:px-32 flex justify-between items-center shadow-2xl h-[82px]`}>
                {/* Logo */}
                <img
                    src="https://itk.ac.id/assets/image/Logo_ITK.webp"
                    className="w-20"
                    alt="ITK Logo"
                />

                {/* Navigation */}
                <ul className="hidden lg:flex items-center font-medium text-xs xl:text-sm gap-10">
                    {menuItems.map((item, idx) => (
                        <li
                            key={idx}
                            className="relative flex items-center"
                            onMouseEnter={() => item.children && setOpenDropdown(item.label)}
                            onMouseLeave={() => item.children && setOpenDropdown(null)}
                        >
                            {/* Normal Item (internal/external) */}
                            {!item.children &&
                                (item.external ? (
                                    <a
                                        href={item.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-semibold text-secondary hover:text-warning transition-colors duration-200"
                                    >
                                        {item.label}
                                    </a>
                                ) : (
                                    <NavLink
                                        to={item.href || "#"}
                                        className={({ isActive }) =>
                                            `font-semibold text-secondary hover:text-warning transition-colors duration-200 ${isActive ? "font-semibold underline" : ""
                                            }`
                                        }
                                    >
                                        {item.label}
                                    </NavLink>
                                ))}

                            {/* Dropdown Trigger */}
                            {item.children && (
                                <button
                                    onClick={() =>
                                        setOpenDropdown(openDropdown === item.label ? null : item.label)
                                    }
                                    className="flex items-center font-semibold cursor-pointer text-secondary hover:text-warning transition-colors duration-200 group"
                                >
                                    {item.label}
                                    <svg
                                        className={`w-3 h-3 ml-2 fill-secondary group-hover:fill-warning transition-transform duration-200 ${openDropdown === item.label ? "rotate-180" : ""
                                            }`}
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="12"
                                        height="12"
                                    >
                                        <path d="M10 2.586 11.414 4 6 9.414.586 4 2 2.586l4 4z" />
                                    </svg>
                                </button>
                            )}

                            {/* Dropdown Menu */}
                            {item.children && openDropdown === item.label && (
                                <ul
                                    className="absolute top-full left-1/2 -translate-x-1/2 min-w-[240px] 
                           bg-white border border-slate-200 p-2 rounded-lg shadow-xl z-50"
                                >
                                    {item.children.map((child, cIdx) =>
                                        child.external ? (
                                            <li key={cIdx}>
                                                <a
                                                    href={child.href}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className=" text-black text-xs hover:bg-secondary hover:text-white duration-200 flex items-center p-2 rounded"
                                                >
                                                    {child.label}
                                                </a>
                                            </li>
                                        ) : (
                                            <li key={cIdx}>
                                                <NavLink
                                                    to={child.href || "#"}
                                                    className={({ isActive }) =>
                                                        ` text-black text-xs hover:bg-secondary hover:text-white duration-200 transition-colors flex items-center p-2 rounded ${isActive ? "bg-slate-100 font-semibold" : ""
                                                        }`
                                                    }
                                                >
                                                    {child.label}
                                                </NavLink>
                                            </li>
                                        )
                                    )}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>

                <NavLink to={'/login'} className="hidden lg:block bg-white border rounded-lg px-5 py-2 text-xs xl:text-sm text-secondary font-semibold hover:bg-secondary hover:text-warning transition-colors duration-300 shadow-lg">
                    Masuk Simlab
                </NavLink>
                <button
                    className="lg:hidden flex flex-col gap-1"
                    onClick={() => setMobileOpen(!mobileOpen)}
                >
                    <div className="h-1 w-8 bg-warning"></div>
                    <div className="h-1 w-8 bg-warning"></div>
                    <div className="h-1 w-8 bg-warning"></div>
                </button>
            </div>
            {/* Mobile Menu - Floating From Top */}
            <div
                className={`lg:hidden fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${mobileOpen ? "opacity-100 visible" : "opacity-0 invisible"
                    }`}
                onClick={() => setMobileOpen(false)}
            />

            <div
                className={`lg:hidden fixed top-0 left-0 right-0 bg-white z-50 transform transition-transform duration-300 ${mobileOpen ? "translate-y-0" : "-translate-y-full"
                    }`}
            >
                <div className="p-6 flex flex-col gap-6">
                    {/* Close button */}
                    <div className="flex justify-between">
                        <img
                            src="https://itk.ac.id/assets/image/Logo_ITK.webp"
                            className="w-20"
                            alt="ITK Logo"
                        />
                        <button
                            className=" text-warning font-bold"
                            onClick={() => setMobileOpen(false)}
                        >
                            ✕
                        </button>
                    </div>

                    <ul className="flex flex-col gap-4">
                        {menuItems.map((item, idx) => (
                            <li key={idx} className="flex flex-col">
                                {!item.children &&
                                    (item.external ? (
                                        <a
                                            href={item.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-semibold text-secondary hover:text-warning transition-colors duration-200"
                                            onClick={() => setMobileOpen(false)}
                                        >
                                            {item.label}
                                        </a>
                                    ) : (
                                        <NavLink
                                            to={item.href || "#"}
                                            className={({ isActive }) =>
                                                `font-semibold text-secondary hover:text-warning transition-colors duration-200 ${isActive ? "font-semibold underline" : ""
                                                }`
                                            }
                                            onClick={() => setMobileOpen(false)}
                                        >
                                            {item.label}
                                        </NavLink>
                                    ))}

                                {/* Dropdown inside mobile */}
                                {item.children && (
                                    <details>
                                        <summary className="cursor-pointer font-semibold text-secondary hover:text-warning transition-colors duration-200">
                                            {item.label}
                                        </summary>
                                        <ul className="pl-4 mt-2 flex flex-col gap-2">
                                            {item.children.map((child, cIdx) =>
                                                child.external ? (
                                                    <li key={cIdx}>
                                                        <a
                                                            href={child.href}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-black text-xs hover:text-warning duration-200"
                                                            onClick={() => setMobileOpen(false)}
                                                        >
                                                            {child.label}
                                                        </a>
                                                    </li>
                                                ) : (
                                                    <li key={cIdx}>
                                                        <NavLink
                                                            to={child.href || "#"}
                                                            className={({ isActive }) =>
                                                                `text-black text-xs hover:text-warning duration-200 ${isActive ? "font-semibold underline" : ""
                                                                }`
                                                            }
                                                            onClick={() => setMobileOpen(false)}
                                                        >
                                                            {child.label}
                                                        </NavLink>
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </details>
                                )}
                            </li>
                        ))}

                        {/* Login Button */}
                        <li>
                            <NavLink
                                to={"/login"}
                                className="block bg-white border rounded-lg px-5 py-2 text-xs text-secondary font-semibold hover:bg-secondary hover:text-warning transition-colors duration-300 shadow"
                                onClick={() => setMobileOpen(false)}
                            >
                                Masuk Simlab
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
};

export default Header;
