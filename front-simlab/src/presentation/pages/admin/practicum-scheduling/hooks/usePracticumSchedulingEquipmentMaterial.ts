import { LaboratoryEquipmentView } from "@/application/laboratory-equipment/LaboratoryEquipmentView";
import { LaboratoryMaterialView } from "@/application/laboratory-material/LaboratoryMaterialView";
import { PracticumSchedulingEquipmentNMaterialInputDTO } from "@/application/practicum-scheduling/dto/PracticumSchedulingDTO";
import { useCallback, useState, ChangeEvent } from "react";

export function usePracticumSchedulingEquipmentMaterial() {
    const [formData, setFormData] = useState<PracticumSchedulingEquipmentNMaterialInputDTO>({
        practicumSchedulingEquipments: [],
        proposedEquipments: [],
        practicumSchedulingMaterials: []
    })

    const handleSelectItem = useCallback((type: 'laboratory_equipment' | 'laboratory_material', data: LaboratoryEquipmentView | LaboratoryMaterialView) => {
        const actionType = type === 'laboratory_equipment' ? 'practicumSchedulingEquipments' : 'practicumSchedulingMaterials';

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
        const actionType = type === 'laboratory_equipment' ? 'practicumSchedulingEquipments' : 'practicumSchedulingMaterials';

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
        const actionType = type === 'laboratory_equipment' ? 'practicumSchedulingEquipments' : 'practicumSchedulingMaterials';
        setFormData(prev => ({
            ...prev,
            [actionType]: prev[actionType].filter(eq => eq.id !== id)
        }))
    }, [])

    const handleAddProposedItem = useCallback(() => {
        setFormData(prev => ({
            ...prev,
            proposedEquipments: [
                ...prev.proposedEquipments,
                { name: '', quantity: null }
            ]
        }))
    }, [])

    /**
     * Generic onChange handler for input elements.
     * Expects the input element to have `name` attribute either "name" or "quantity".
     * Example: <input name="name" onChange={(e) => handleProposedOnChange(index, e)} />
     */
    const handleChangeProposedItem = useCallback((index: number, e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { type, name, value } = e.target as HTMLInputElement & { name: string };
        if (type === 'number') {
            // strip leading zeros when user types numbers like '00' or '012'
            let newValue = value;
            if (newValue.length > 1 && newValue.startsWith('0')) {
                newValue = newValue.replace(/^0+/, '');
                if (newValue === '') newValue = '0';
            }

            const parsed = newValue === '' ? null : Number(newValue);
            setFormData(prev => ({
                ...prev,
                proposedEquipments: prev.proposedEquipments.map((item, i) => i === index ? { ...item, [name]: parsed } : item)
            }))
            return;
        }

        // default: string/other field
        setFormData(prev => ({
            ...prev,
            proposedEquipments: prev.proposedEquipments.map((item, i) => i === index ? { ...item, [name]: value } : item)
        }))
    }, [])

    const handleRemoveProposedItem = useCallback((index: number) => {
        setFormData(prev => ({
            ...prev,
            proposedEquipments: prev.proposedEquipments.filter((_, i) => i !== index)
        }))
    }, [])

    return {
        formData,
        setFormData,
        handleSelectItem,
        handleChangeItem,
        handleRemoveItem,
        handleAddProposedItem,
        handleChangeProposedItem,
        handleRemoveProposedItem,
    }
}