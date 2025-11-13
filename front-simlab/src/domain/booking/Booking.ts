import { Time } from "../time/Time";
import { BookingApproval } from "./BookingApproval";
import { BookingEquipment } from "./BookingEquipment";
import { BookingMaterial } from "./BookingMaterial";
import { BookingStatus } from "./BookingStatus";
import { BookingType } from "./BookingType";

export class Booking {
    private laboratoryRoomName?: string
    private requestor?: {
        name: string,
        email: string
    }
    private laboran?: {
        name: string,
        email: string,
    }
    private academicYear?: string
    private bookingEquipments: BookingEquipment[] = []
    private bookingMaterial: BookingMaterial[] = []
    private bookingApprovals : BookingApproval[] = []

    constructor(
        readonly id: number,
        readonly phoneNumber: string,
        readonly purpose: string,
        readonly supportingFile: string | null,
        readonly activityName: string,
        readonly supervisor: string | null,
        readonly supervisorEmail: string | null,
        readonly startTime: Time,
        readonly endTime: Time,
        readonly status: BookingStatus,
        readonly bookingType: BookingType,
        readonly totalParticipant: number,
        readonly participantList: string,
        readonly isAllowedOffsite: boolean,
        readonly createdAt: Time,
        readonly updatedAt: Time,
    ) { }

    // === Setter Methods

    setLaboratoryRoomName(name: string) {
        this.laboratoryRoomName = name;
    }

    setLaboran(laboranData: {name: string, email: string}) {
        this.laboran = laboranData
    }

    setRequestor(requestorData: {name: string; email: string}) {
        this.requestor = requestorData;
    }

    setAcademicYearLabel(label: string) {
        this.academicYear = label;
    }

    setBookingEquipments(equipments: BookingEquipment[]) {
        this.bookingEquipments = equipments;
    }

    setBookingMaterial(materials: BookingMaterial[]) {
        this.bookingMaterial = materials;
    }

    setBookingApproval(approvals: BookingApproval[]) {
        this.bookingApprovals = approvals
    }

    // === Getter Methods

    getLaboratoryRoomName(): string | undefined {
        return this.laboratoryRoomName;
    }

    getLaboran(): {name: string, email: string} | undefined {
        return this.laboran
    }

    getRequestor(): {name: string, email: string} | undefined {
        return this.requestor;
    }

    getAcademicYear(): string | undefined {
        return this.academicYear;
    }

    getEquipments(): BookingEquipment[] {
        return this.bookingEquipments;
    }

    getMaterials(): BookingMaterial[] {
        return this.bookingMaterial;
    }

    getApprovals(): BookingApproval[] {
        return this.bookingApprovals
    }
}