export interface LaboratoryMaterialInputDTO {
    code: string;
    ruangan_laboratorium_id: number | undefined;
    material_name: string;
    brand: string;
    stock: number;
    unit: string;
    purchase_date: Date | undefined;
    expiry_date: Date | undefined;
    description: string;
    refill_date: Date | undefined;
}

export interface LaboratoryMaterialTableParams {
    page: number,
    per_page: number,
    search: string,
    filter_laboratory_room?: number,
}