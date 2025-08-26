export interface PracticumSchedulingTableParam {
    page: number,
    per_page: number,
    search: string,
}

export interface PracticumSchedulingInputDTO {
    praktikum_id: number | null;
    ruangan_laboratorium_id: number | null;
    phone_number: string;
    groups: {
        group_name: string;
        practicum_assistant: string;
        practicum_session: string;
        start_time: Date | undefined;
        end_time: Date | undefined;
        total_participant: number;
    }[];
    
}

export interface PracticumSchedulingEquipmentNMaterialInputDTO {
    practicumSchedulingEquipments: {
        id: number,
        name: string,
        quantity: number,
        unit: string
    }[];
    practicumSchedulingMaterials: {
        id: number,
        name: string,
        quantity: number,
        unit: string
    }[];
}

export interface PracticumSchedulingVerifyDTO {
    action: 'approve' | 'reject',
    laboran_id?: number,
    information?: string,
}