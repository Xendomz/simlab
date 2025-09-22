import { createBrowserRouter, Navigate } from "react-router-dom";
import { AuthProvider } from "./application/context/AuthContext";
import { Login } from "./presentation/pages/LoginPage";
import AdminLayout from "./presentation/layouts/AdminLayout";
import Dashboard from "./presentation/pages/admin/Dashboard";
import AcademicYearPage from "./presentation/pages/admin/academic-year/AcademicYearPage";
import TestingTypePage from "./presentation/pages/admin/testing-type/TestingTypePage";
import MajorPage from "./presentation/pages/admin/major/MajorPage";
import StudyProgramPage from "./presentation/pages/admin/study-program/StudyProgramPage";
import PracticalWorkPage from "./presentation/pages/admin/practical-work/PracticalWorkPage";
import AdminPage from "./presentation/pages/admin/user/admin/AdminPage";
import LaboranPage from "./presentation/pages/admin/user/laboran/LaboranPage";
import MahasiswaPage from "./presentation/pages/admin/user/mahasiswa/MahasiswaPage";
import PihakLuarPage from "./presentation/pages/admin/user/pihak-luar/PihakLuarPage";
import { RegisterPage } from "./presentation/pages/RegisterPage";
import LaboratoryRoomPage from "./presentation/pages/admin/laboratory-room/LaboratoryRoomPage";
import LaboratoryEquipmentPage from "./presentation/pages/admin/laboratory-equipment/LaboratoryEquipmentPage";
import LaboratoryMaterialPage from "./presentation/pages/admin/laboratory-material/LaboratoryMaterialPage";
import KoorprodiPage from "./presentation/pages/admin/user/koorprodi/KoorprodiPage";
import DosenPage from "./presentation/pages/admin/user/dosen/DosenPage";
import KepalaLabUnitPage from "./presentation/pages/admin/user/kepala-lab-unit/KepalaLabUnitPage";
import { ProtectedRoute } from "./application/routes/ProtectedRoute";
import BookingPage from "./presentation/pages/admin/booking/BookingPage";
import BookingCreatePage from "./presentation/pages/admin/booking/BookingCreatePage";
import BookingManagePage from "./presentation/pages/admin/booking/BookingManagePage";
import { BookingDetailPage } from "./presentation/pages/admin/booking/BookingDetailPage";
import NotFound404Page from "./presentation/pages/errors/NotFound404Page";
import BookingReportPage from "./presentation/pages/report/booking/BookingReportPage";
import KepalaLabPage from "./presentation/pages/admin/user/kepala-lab/KepalaLabPage";
import BookingVerification from "./presentation/pages/admin/booking/BookingVerification";
import PracticumSchedulingPage from "./presentation/pages/admin/practicum-scheduling/PracticumSchedulingPage";
import PracticumSchedulingCreatePage from "./presentation/pages/admin/practicum-scheduling/PracticumSchedulingCreatePage";
import PracticumSchedulingDetailPage from "./presentation/pages/admin/practicum-scheduling/PracticumSchedulingDetailPage";
import PracticumSchedulingManagePage from "./presentation/pages/admin/practicum-scheduling/PracticumSchedulingManagePage";
import PracticumSchedulingVerification from "./presentation/pages/admin/practicum-scheduling/PracticumSchedulingVerification";
import MainPage from "./presentation/pages/landing/MainPage";
import NewsContent from "./presentation/pages/landing/news/NewsContent";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <MainPage/>
    },
    {
        path: '/berita/:slug',
        element: <NewsContent/>
    },
    {
        path: '/login',
        element: (
            <AuthProvider>
                <Login />
            </AuthProvider>
        )
    },
    {
        path: '/register',
        element: (
            <AuthProvider>
                <RegisterPage />
            </AuthProvider>
        )
    },
    {
        path: '/panel',
        element: (
            <AuthProvider>
                <AdminLayout />
            </AuthProvider>
        ),
        children: [
            {
                path: '',
                element: (
                    <Dashboard />
                )
            },
            {
                path: 'tahun-akademik',
                element: (
                    <ProtectedRoute allowedRoles={['Admin']}>
                        <AcademicYearPage />
                    </ProtectedRoute>
                )
            },
            {
                path: 'jenis-pengujian',
                element: (
                    <ProtectedRoute allowedRoles={['Admin']}>
                        <TestingTypePage />
                    </ProtectedRoute>
                )
            },
            {
                path: 'jurusan',
                element: (
                    <ProtectedRoute allowedRoles={['Admin']}>
                        <MajorPage />
                    </ProtectedRoute>
                )
            },
            {
                path: 'prodi',
                element: (
                    <ProtectedRoute allowedRoles={['Admin']}>
                        <StudyProgramPage />
                    </ProtectedRoute>
                )
            },
            {
                path: 'praktikum',
                element: (
                    <ProtectedRoute allowedRoles={['Admin']}>
                        <PracticalWorkPage />
                    </ProtectedRoute>
                )
            },
            {
                path: 'ruangan-laboratorium',
                element: (
                    <ProtectedRoute allowedRoles={['Admin', 'Laboran']}>
                        <LaboratoryRoomPage />
                    </ProtectedRoute>
                )
            },
            {
                path: 'alat-laboratorium',
                element: (
                    <ProtectedRoute allowedRoles={['Admin', 'Laboran']}>
                        <LaboratoryEquipmentPage />
                    </ProtectedRoute>
                )
            },
            {
                path: 'bahan-laboratorium',
                element: (
                    <ProtectedRoute allowedRoles={['Admin', 'Laboran']}>
                        <LaboratoryMaterialPage />
                    </ProtectedRoute>
                )
            },
            {
                path: 'admin',
                element: (
                    <ProtectedRoute allowedRoles={['Admin']}>
                        <AdminPage />
                    </ProtectedRoute>
                )
            },
            {
                path: 'kepala-lab-terpadu',
                element: (
                    <ProtectedRoute allowedRoles={['Admin']}>
                        <KepalaLabPage />
                    </ProtectedRoute>
                )
            },
            {
                path: 'koorprodi',
                element: (
                    <ProtectedRoute allowedRoles={['Admin']}>
                        <KoorprodiPage />
                    </ProtectedRoute>
                )
            },
            {
                path: 'kepala-lab-unit',
                element: (
                    <ProtectedRoute allowedRoles={['Admin']}>
                        <KepalaLabUnitPage />
                    </ProtectedRoute>
                )
            },
            {
                path: 'dosen',
                element: (
                    <ProtectedRoute allowedRoles={['Admin']}>
                        <DosenPage />
                    </ProtectedRoute>
                )
            },
            {
                path: 'laboran',
                element: (
                    <ProtectedRoute allowedRoles={['Admin']}>
                        <LaboranPage />
                    </ProtectedRoute>
                )
            },
            {
                path: 'mahasiswa',
                element: (
                    <ProtectedRoute allowedRoles={['Admin']}>
                        <MahasiswaPage />
                    </ProtectedRoute>
                )
            },
            {
                path: 'pihak-luar',
                element: (
                    <ProtectedRoute allowedRoles={['Admin']}>
                        <PihakLuarPage />
                    </ProtectedRoute>
                )
            },
            {
                path: 'peminjaman',
                children: [
                    {
                        path: '',
                        element: (
                            <ProtectedRoute allowedRoles={['Dosen', 'Mahasiswa', 'Kepala Lab Terpadu', 'Koorprodi']}>
                                <BookingPage />
                            </ProtectedRoute>
                        )
                    },
                    {
                        path: 'create',
                        element: (
                            <ProtectedRoute allowedRoles={['Dosen', 'Mahasiswa', 'Kepala Lab Terpadu', 'Koorprodi']}>
                                <BookingCreatePage />
                            </ProtectedRoute>
                        )
                    },
                    {
                        path: ':id/manage',
                        element: (
                            <ProtectedRoute allowedRoles={['Dosen', 'Mahasiswa', 'Kepala Lab Terpadu', 'Koorprodi']}>
                                <BookingManagePage />
                            </ProtectedRoute>
                        )
                    },
                    {
                        path: ':id/detail',
                        element: (
                            <ProtectedRoute allowedRoles={['Admin', 'Dosen', 'Mahasiswa', 'Kepala Lab Terpadu', 'Laboran']}>
                                <BookingDetailPage />
                            </ProtectedRoute>
                        )
                    },
                    {
                        path: 'verif',
                        element: (
                            <ProtectedRoute allowedRoles={['Kepala Lab Terpadu', 'Laboran']}>
                                <BookingVerification />
                            </ProtectedRoute>
                        )
                    },
                ],
            },
            {
                path: 'penjadwalan-praktikum',
                children: [
                    {
                        path: '',
                        element: (
                            <ProtectedRoute allowedRoles={['Dosen', 'Kepala Lab Terpadu']}>
                                <PracticumSchedulingPage />
                            </ProtectedRoute>
                        )
                    },
                    {
                        path: 'create',
                        element: (
                            <ProtectedRoute allowedRoles={['Dosen', 'Kepala Lab Terpadu', 'Koorprodi']}>
                                <PracticumSchedulingCreatePage />
                            </ProtectedRoute>
                        )
                    },
                    {
                        path: ':id/manage',
                        element: (
                            <ProtectedRoute allowedRoles={['Dosen', 'Mahasiswa', 'Kepala Lab Terpadu', 'Koorprodi']}>
                                <PracticumSchedulingManagePage />
                            </ProtectedRoute>
                        )
                    },
                    {
                        path: ':id/detail',
                        element: (
                            <ProtectedRoute allowedRoles={['Dosen', 'Kepala Lab Terpadu', 'Laboran', 'Koorprodi']}>
                                <PracticumSchedulingDetailPage />
                            </ProtectedRoute>
                        )
                    },
                    {
                        path: 'verif',
                        element: (
                            <ProtectedRoute allowedRoles={['Kepala Lab Terpadu', 'Laboran', 'Koorprodi']}>
                                <PracticumSchedulingVerification />
                            </ProtectedRoute>
                        )
                    },
                ],
            },
            {
                path: 'laporan',
                children: [
                    {
                        path: '',
                        element: (
                            <Navigate to={'/404'} replace/>
                        )
                    },
                    {
                        path: 'peminjaman',
                        element: (
                            <ProtectedRoute allowedRoles={['Admin', 'Laboran']}>
                                <BookingReportPage />
                            </ProtectedRoute>
                        )
                    },
                ],
            },
        ]
    },
    {
        path: '*',
        element: (
            <NotFound404Page />
        )
    },
])