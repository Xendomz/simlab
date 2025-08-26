import { useAuth } from '@/application/hooks/useAuth'
import Header from '@/presentation/components/Header'
import React from 'react'
import KoorprodiPraticumScheduleApproval from './components/KoorprodiPraticumScheduleApproval'
import KepalaLabTerpaduPracticumScheduleApproval from './components/KepalaLabTerpaduPracticumScheduleApproval'
import LaboranPracticumScheduleApproval from './components/LaboranPracticumScheduleApproval'

const PracticumSchedulingVerification = () => {
    const { user } = useAuth()
    return (
        <>
            <Header title="Menu Penjadwalan Praktikum" />
            { user?.role === 'Koorprodi' && (
                <KoorprodiPraticumScheduleApproval/>
            )}
            { user?.role === 'Kepala Lab Terpadu' && (
                <KepalaLabTerpaduPracticumScheduleApproval/>
            )}
            { user?.role === 'Laboran' && (
                <LaboranPracticumScheduleApproval/>
            )}
        </>
    )
}

export default PracticumSchedulingVerification
