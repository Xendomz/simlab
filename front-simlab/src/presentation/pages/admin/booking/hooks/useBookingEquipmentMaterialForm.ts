import { BookingRoomNEquipmentInputDTO } from "@/application/booking/dto/BookingDTO"
import { LaboratoryEquipmentView } from "@/application/laboratory-equipment/LaboratoryEquipmentView"
import { LaboratoryMaterialView } from "@/application/laboratory-material/LaboratoryMaterialView"
import { useCallback, useState } from "react"

export const useBookingEquipmentMaterialForm = () => {
    const [formData, setFormData] = useState<BookingRoomNEquipmentInputDTO>({
        laboratoryEquipments: [],
        laboratoryMaterials: []
    })

    const handleSelectItem = useCallback((type: 'laboratory_equipment' | 'laboratory_material', data: LaboratoryEquipmentView | LaboratoryMaterialView) => {
        const actionType = type === 'laboratory_equipment' ? 'laboratoryEquipments' : 'laboratoryMaterials';

        setFormData(prev => {
            const exists = prev[actionType].some(eq => eq.id === data.id);
            return {
                ...prev,
                [actionType]: exists
                    ? prev[actionType].filter(eq => eq.id !== data.id)
                    : [
                        ...prev[actionType],
                        {
                            id: data.id,
                            name:
                                type === 'laboratory_equipment'
                                    ? (data as LaboratoryEquipmentView).equipmentName
                                    : (data as LaboratoryMaterialView).materialName,
                            quantity: null,
                            unit: data.unit
                        }
                    ]
            }
        })
    }, [])

    const handleChangeItem = useCallback((type: 'laboratory_equipment' | 'laboratory_material', id: number, quantity: number | string | null) => {
        const actionType = type === 'laboratory_equipment' ? 'laboratoryEquipments' : 'laboratoryMaterials';

        // normalize quantity if it's a string (coming from an input event)
        // strip leading zeros when user types numbers like '00' or '012'
        let newValue = quantity;
        if (typeof newValue === 'string' && newValue.length > 1 && newValue.startsWith('0')) {
            newValue = newValue.replace(/^0+/, '');
            if (newValue === '') newValue = '0';
        }

        const parsed = newValue === '' ? null : Number(newValue);
        setFormData(prev => ({
            ...prev,
            [actionType]: prev[actionType].map(eq => eq.id === id ? { ...eq, quantity: parsed } : eq)
        }))
        
    }, [])

    const handleRemoveItem = useCallback((type: 'laboratory_equipment' | 'laboratory_material', id: number) => {
        const actionType = type === 'laboratory_equipment' ? 'laboratoryEquipments' : 'laboratoryMaterials';
        setFormData(prev => ({
            ...prev,
            [actionType]: prev[actionType].filter(eq => eq.id !== id)
        }))
    }, [])

    return {
        formData,
        setFormData,
        handleSelectItem,
        handleChangeItem,
        handleRemoveItem,
    }
}