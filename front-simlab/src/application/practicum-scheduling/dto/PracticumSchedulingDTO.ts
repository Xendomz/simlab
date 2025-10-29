export interface PracticumSchedulingTableParam {
    page: number,
    per_page: number,
    search: string,
}

export interface PracticumSchedulingSession {
    practicum_module_id: number | null,
    start_time: Date | null,
    end_time: Date | null
}

export interface PracticumSchedulingClass {
    lecturer_id: number | null,
    laboratory_room_id: number | null,
    name: string,
    practicum_assistant: string,
    total_participant: number | null,
    total_group: number | null,
    sessions: PracticumSchedulingSession[]
}

export interface PracticumSchedulingInputDTO {
    practicum_id: number | null,
    phone_number: string,
    classes: PracticumSchedulingClass[]
}

export interface PracticumSchedulingEquipmentNMaterialInputDTO {
    practicumSchedulingEquipments: {
        id: number,
        name: string,
        quantity: number | null,
        unit: string
    }[];
    proposedEquipments: {
        name: string
        quantity: number | null
    }[];
    practicumSchedulingMaterials: {
        id: number,
        name: string,
        quantity: number | null,
        unit: string
    }[];
}

export interface PracticumSchedulingSessionConductedDTO {
    session_id: number,
    status: boolean,
    information: string | null
}

export interface PracticumSchedulingLecturerNotesDTO {
    session_id: number,
    information: string | null
}

export interface PracticumSchedulingVerifyDTO {
    action: 'approve' | 'reject' | 'revision',
    laboran_id?: number,
    information?: string,
    materials?: number[]
}