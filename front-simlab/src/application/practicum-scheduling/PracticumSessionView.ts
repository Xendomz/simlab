import { PracticumSession } from "@/domain/practicum-scheduling/PracticumSession";
import { TimeView } from "../time/TimeView";
import { PracticumModuleView } from "../practicum-module/PracticumModuleView";

export class PracticumSessionView {
    private constructor(
        readonly id: number,
        readonly startTime: TimeView,
        readonly endTime: TimeView,
        readonly isClassConducted: number | null,
        readonly laboranComment: string | null,
        readonly laboranCommentedAt: TimeView | null,
        readonly lecturerComment: string | null,
        readonly lecturerCommentedAt: TimeView | null,
        readonly practicumModule?: PracticumModuleView
    ) { }

    static fromDomain(entity: PracticumSession): PracticumSessionView {
        return new PracticumSessionView(
            entity.id,
            TimeView.fromDomain(entity.startTime),
            TimeView.fromDomain(entity.endTime),
            entity.isClassConducted,
            entity.laboranComment,
            entity.laboranCommentedAt ? TimeView.fromDomain(entity.laboranCommentedAt) : null,
            entity.lecturerComment,
            entity.lecturerCommentedAt ? TimeView.fromDomain(entity.lecturerCommentedAt) : null,
            entity.practicumModule ? PracticumModuleView.fromDomain(entity.practicumModule) : undefined
        )
    }

    formattedDate() {
        return this.startTime.formatForDay() + ' - ' + this.endTime.formatForTime()
    }

    isAllowToConducted(): number {
        const target = new Date(this.startTime.date)
        const now = new Date()

        const startOfWeek = new Date(now)
        startOfWeek.setDate(now.getDate() - now.getDay()) // Minggu = hari ke-0
        startOfWeek.setHours(0, 0, 0, 0)

        const endOfWeek = new Date(startOfWeek)
        endOfWeek.setDate(startOfWeek.getDate() + 6)
        endOfWeek.setHours(23, 59, 59, 999)

        // Jika tanggal target masih di masa depan tapi belum masuk minggu ini
        // (contoh: sekarang 1, target 25)
        if (target > endOfWeek) {
            return 0
        }

        // Jika tanggal sudah dalam minggu ini atau sebelumnya
        return 1
    }

}