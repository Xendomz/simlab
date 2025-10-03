import React, { useEffect, useState } from 'react'
import { ApiResponse } from '../../../../../shared/Types'
import { useValidationErrors } from '@/presentation/hooks/useValidationError'
import { UserInputDTO } from '@/application/user/UserDTO'
import { UserView } from '@/application/user/UserView'

interface FormProps {
    handleSave: (data: any) => Promise<void>
    onClose: () => void
    data: any
    dataId: number | null,
}

const LaboranForm: React.FC<FormProps> = ({
    handleSave,
    onClose,
    data,
    dataId,
}) => {
    const [formData, setFormData] = useState<UserInputDTO>({
        name: '',
        email: '',
        role: '',
        prodi_id: 0,
        identity_num: '',
        password: ''
    });
    const { errors, setErrors, processErrors } = useValidationErrors()
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setErrors({})
    }, ['open'])

    useEffect(() => {
        if (dataId) {
            const foundData = data.find((data: UserView) => data.id == dataId);
            const laboranData: UserInputDTO = {
                name: foundData?.name || '',
                email: foundData?.email || '',
                role: 'Laboran',
                prodi_id: foundData?.prodi_id || 0,
                identity_num: foundData?.identity_num || '',
                password: ''
            }
            setFormData(laboranData)
        } else {
            setFormData({
                name: '',
                email: '',
                role: '',
                prodi_id: 0,
                identity_num: '',
                password: ''
            })
        }
    }, [dataId])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            role: 'Laboran',
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await handleSave(formData);
        } catch (e) {
            const error = e as ApiResponse
            if (error.errors) {
                processErrors(error.errors);
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor='email'>
                        Email <span className="text-red-500">*</span>
                    </label>
                    <input
                        type='email'
                        id='email'
                        name='email'
                        value={formData['email'] || ''}
                        onChange={dataId ? undefined : handleChange}
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-300`}
                        placeholder='Email'
                        disabled={dataId ? true : false}
                    />
                    {errors['email'] && (
                        <p className="mt-1 text-xs italic text-red-500">{errors['email']}</p>
                    )}
                </div>
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor='name'>
                        Nama Petugas Laboran <span className="text-red-500">*</span>
                    </label>
                    <input
                        type='text'
                        id='name'
                        name='name'
                        value={formData['name'] || ''}
                        onChange={handleChange}
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        placeholder='Nama Petugas Laboran'
                    />
                    {errors['name'] && (
                        <p className="mt-1 text-xs italic text-red-500">{errors['name']}</p>
                    )}
                </div>
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor='password'>
                        Password <span className="text-red-500">*</span>
                    </label>
                    <input
                        type='password'
                        id='password'
                        name='password'
                        value={formData['password'] || ''}
                        onChange={handleChange}
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        placeholder='*****'
                    />
                    {errors['password'] && (
                        <p className="mt-1 text-xs italic text-red-500">{errors['password']}</p>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end pt-4 border-t border-gray-200 border-solid rounded-b">
                    <button
                        type="button"
                        className="px-6 py-2 mb-1 mr-2 text-sm font-bold text-gray-500 outline-none background-transparent focus:outline-none"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className={`px-6 py-2 mb-1 mr-1 text-sm font-bold text-white bg-blue-500 rounded shadow outline-none hover:shadow-lg focus:outline-none ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'active:bg-blue-600'}`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </form>
        </>
    )
}

export default LaboranForm
