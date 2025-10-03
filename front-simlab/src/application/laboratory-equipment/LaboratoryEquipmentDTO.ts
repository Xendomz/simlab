export interface LaboratoryEquipmentInputDTO {
    equipment_name: string;
    laboratory_room_id: number;
    quantity: number;
    unit: string;
    function: string;
    photo: string | File |null ;
    brand: string;
    equipment_type: string;
    origin: string;
    condition: string;
    condition_description: string;
    asset_code: string,
    student_price: number | null,
    lecturer_price: number | null,
    external_price: number | null
}

export interface LaboratoryEquipmentTableParams {
    page: number,
    per_page: number,
    search: string,
    filter_laboratory_room?: number,
}