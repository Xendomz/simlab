import { usePracticumScheduling } from '@/application/practicum-scheduling/hooks/usePracticumScheduling'
import { PracticumStepperView } from '@/application/practicum-scheduling/PracticumStepperView'
import { Skeleton } from '@/presentation/components/ui/skeleton'
import React, { useEffect, useState } from 'react'

interface PracticumStepperProps {
    practicumId: number
}

const PracticumStepper: React.FC<PracticumStepperProps> = ({ practicumId }) => {
    const { getPracticumSteps } = usePracticumScheduling({})
    const [practicumSteps, setPracticumSteps] = useState<PracticumStepperView[]>([])
    const [practicumStepsLoading, setPracticumStepsLoading] = useState<boolean>(false)
    const [practicumStepsError, setPracticumStepsError] = useState<string | null>(null);
    useEffect(() => {
        const loadSteps = async () => {
            try {
                setPracticumStepsLoading(true);
                const res = await getPracticumSteps(practicumId);
                setPracticumSteps(res.data || []);
            } catch (e: any) {
                setPracticumStepsError(e?.message || 'Gagal memuat progress persetujuan');
            } finally {
                setPracticumStepsLoading(false);
            }
        };
        loadSteps();
    }, [])


    return (
        <div className="relative flex flex-col gap-3 w-full mt-5">
            {practicumStepsLoading && (
                <div className="flex gap-4 w-full animate-pulse justify-center mb-5">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex flex-col items-center w-52">
                            <Skeleton className="w-10 h-10 mb-2" />
                            <Skeleton className="h-4 w-20 mb-1" />
                            <Skeleton className="h-3 w-16 mb-1" />
                            <Skeleton className="h-3 w-32" />
                        </div>
                    ))}
                </div>
            )}
            {practicumStepsError && <div className="text-sm text-red-500">{practicumStepsError}</div>}
            {!practicumStepsLoading && !practicumStepsError && practicumSteps.length === 0 && (
                <div className="text-sm text-muted-foreground">Belum ada data persetujuan.</div>
            )}
            {!practicumStepsLoading && !practicumStepsError && (
                <div className="pb-4 w-full flex overflow-x-auto scrollbar-hidden">
                    {practicumSteps.map((step, i) => (
                        <div className={`flex items-center ${(i + 1) == practicumSteps.length ? 'w-fit' : 'w-full'}`} key={i}>
                            <div className='flex flex-col items-center w-fit gap-1'>
                                <div className={`w-10 h-10 flex items-center justify-center rounded-full text-xs font-semibold shadow-sm
                                    ${step.status === 'approved' ? 'bg-green-600 text-white' : step.status === 'rejected' ? 'bg-red-600 text-white' : step.status === 'revision' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-300 text-gray-600'}`}
                                >
                                    {i + 1}
                                </div>
                                <div className="flex flex-col items-center w-48 text-center gap-2">
                                    <div className="text-xs font-medium leading-tight text-muted-foreground">{step.role}</div>
                                    {step.status === 'approved' ? (
                                        <span className="self-center text-[10px] tracking-wide px-2 py-0.5 rounded-full font-semibold bg-green-100 text-green-700">APPROVED</span>
                                    ) : step.status === 'rejected' ? (
                                        <span className="self-center text-[10px] tracking-wide px-2 py-0.5 rounded-full font-semibold bg-red-100 text-red-700">REJECTED</span>
                                    ) : step.status === 'revision' ? (
                                        <span className="self-center text-[10px] tracking-wide px-2 py-0.5 rounded-full font-semibold bg-yellow-100 text-yellow-700">REVISION</span>
                                    ) : (
                                        <span className="self-center text-[10px] tracking-wide px-2 py-0.5 rounded-full font-semibold bg-gray-100 text-gray-500">PENDING</span>
                                    )}

                                    {/* Details: show approver/time/info for approved, rejected, or revision when available */}
                                    {((step.status === 'approved' || step.status === 'rejected' || step.status === 'revision') && (step.approver || step.information || step.approvedAt)) ? (
                                        <div className={`text-xs text-muted-foreground`}>
                                            {step.status === 'approved' ? 'Diverifikasi oleh: ' : step.status === 'rejected' ? 'Ditolak oleh: ' : 'Dalam proses revisi oleh: '}
                                            <span className="font-medium">{step.approver} </span>
                                            {step.approvedAt  ? step.approvedAt.formatForInformation() : ''}
                                            {step.information && (
                                                <><br /><span className="italic font-semibold">{step.status == 'approved' ? 'Catatan' : 'Alasan'}: {step.information}</span></>
                                            )}
                                        </div>
                                    ) : (
                                        <div className={`text-xs text-muted-foreground invisible`} />
                                    )}
                                </div>
                            </div>
                            {(i + 1) < practicumSteps.length && (
                                <div className="bg-foreground min-w-32 w-full h-px rounded-full"></div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default PracticumStepper