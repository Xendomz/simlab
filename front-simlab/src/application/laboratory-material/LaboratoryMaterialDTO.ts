export interface LaboratoryMaterialInputDTO {
    code: string;
    laboratory_room_id: number | undefined;
    material_name: string;
    brand: string;
    stock: number;
    unit: string;
    purchase_date: Date | undefined;
    expiry_date: Date | undefined;
    description: string;
    refill_date: Date | undefined;
    student_price: number | null,
    lecturer_price: number | null,
    external_price: number | null
}

export interface LaboratoryMaterialTableParams {
    page: number,
    per_page: number,
    search: string,
    filter_laboratory_room?: number,
}