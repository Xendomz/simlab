import { useEffect, useState } from "react";
import { Navigate, NavLink, useLocation, useNavigate } from "react-router-dom";
import { StudyProgram } from "../../domain/study-program/StudyProgram";
import { useAuth } from "../../application/hooks/useAuth";
import { StudyProgramRepository } from "../../infrastructure/study-program/StudyProgramRepository";
import { useValidationErrors } from "../hooks/useValidationError";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../components/ui/select";
import { Button } from "../components/ui/button";
import { toast, Toaster } from "sonner";
import { Combobox } from "../components/custom/combobox";
import { ApiResponse } from "@/shared/Types";
import { RegisterCredentials } from "@/domain/Auth/Auth";
import ItkLogo from '../assets/itk_logo.png'

const studyProgramRepository = new StudyProgramRepository()

export const RegisterPage: React.FC = () => {
    const [formData, setFormData] = useState<RegisterCredentials>({
        name: '',
        identity_num: '',
        role: '',
        study_program_id: 0,
        email: '',
        password: '',
        c_password: ''
    });
    const { errors, processErrors } = useValidationErrors()
    const [isLoading, setIsLoading] = useState(false);
    const [studyProgram, setStudyProgram] = useState<StudyProgram[]>([])
    const { user, register } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const getProdi = async () => {
        try {
            const response = await studyProgramRepository.getPublicData()
            setStudyProgram(response.data || [])
        } catch (error) {
            console.error(error);
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setFormData((prev: RegisterCredentials) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await register(formData);
            navigate('/login');
            toast.success('Berhasil mendaftar, silahkan login!')
        } catch (e) {
            const error = e as ApiResponse
            if (error.errors) {
                processErrors(error.errors)
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getProdi()
    }, []);

    if (user) {
        return <Navigate to="/panel" state={{ from: location }} replace />;
    }

    return (
        <>
            <div className="grid min-h-screen bg-white md:grid-cols-2 xl:grid-cols-9">
                <div className="flex flex-col items-center w-full px-5 py-10 space-y-8 sm:px-10 md:px-10 xl:px-16 h-fit xl:col-span-4">
                    <img src={ItkLogo} className="w-36" alt="" />
                    <div className="w-full text-left">
                        <h3 className="text-3xl font-medium">Pendaftaran Akun</h3>
                        <h4 className="text-base">Daftar akun untuk mengakases SIMLAB!</h4>
                    </div>
                    <form className="grid w-full grid-cols-1 mt-8 gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="name">
                                Nama <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="name"
                                type="name"
                                name="name"
                                placeholder="Nama Lengkap"
                                value={formData.name}
                                onChange={handleChange}
                            />
                            {errors['name'] && (
                                <p className="mt-1 text-xs italic text-red-500">{errors['name']}</p>
                            )}
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="email">
                                Email <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            {errors['email'] && (
                                <p className="mt-1 text-xs italic text-red-500">{errors['email']}</p>
                            )}
                        </div>
                        <div className="flex flex-col gap-2 md:col-span-2">
                            <Label htmlFor="identity_num">
                                NIM / NIP / NIPH / Identitas Lainnya <span className="text-red-500">*</span>
                            </Label>
                            <div>
                                <Input
                                    id="identity_num"
                                    type="identity_num"
                                    name="identity_num"
                                    placeholder="NIM / NIP / NIPH / Identitas Lainnya"

                                    value={formData.identity_num}
                                    onChange={handleChange}
                                />
                                {errors['identity_num'] && (
                                    <p className="mt-1 text-xs italic text-red-500">{errors['identity_num']}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="role">
                                Daftar Sebagai <span className="text-red-500">*</span>
                            </Label>
                            <Select name='role' onValueChange={(value) =>
                                handleChange({
                                    target: {
                                        name: 'role',
                                        value: value
                                    }
                                } as React.ChangeEvent<HTMLSelectElement>)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Daftar Sebagai" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Daftar Sebagai</SelectLabel>
                                        <SelectItem value="mahasiswa">Mahasiswa</SelectItem>
                                        <SelectItem value="pihak_luar">Pihak Luar</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors['role'] && (
                                <p className="mt-1 text-xs italic text-red-500">{errors['role']}</p>
                            )}
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="study_program_id">
                                Program Studi (Kosongkan jika eksternal)
                            </Label>
                            <Combobox
                                options={studyProgram}
                                value={formData.study_program_id?.toString() || ''}
                                onChange={(val) => {
                                    setFormData((prev) => ({
                                        ...prev,
                                        study_program_id: val ? Number(val) : 0
                                    }))
                                }}
                                placeholder="Pilih Prodi"
                                optionLabelKey='name'
                                optionValueKey='id'
                            />
                            {errors['study_program_id'] && (
                                <p className="mt-1 text-xs italic text-red-500">{errors['study_program_id']}</p>
                            )}
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="password">
                                Password <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="xxxxxxxxx"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            {errors['password'] && (
                                <p className="mt-1 text-xs italic text-red-500">{errors['password']}</p>
                            )}
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="c_password">
                                Konfirmasi Password <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="c_password"
                                name="c_password"
                                type="password"
                                placeholder="xxxxxxxxx"
                                value={formData.c_password}
                                onChange={handleChange}
                            />
                            {errors['c_password'] && (
                                <p className="mt-1 text-xs italic text-red-500">{errors['c_password']}</p>
                            )}
                        </div>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full md:col-span-2"
                        >
                            {isLoading ? 'Registering...' : 'Register'}
                        </Button>
                        <div className="flex gap-2 text-sm md:col-span-2">
                            <p>Sudah punya akun?</p>
                            <NavLink to={'/login'} className='font-medium hover:text-blue-500'>Login</NavLink>
                        </div>
                    </form>
                </div>
                <div className="relative hidden xl:col-span-5 md:block">
                    <div className="absolute w-full h-full col-span-2 bg-black opacity-50"></div>
                    <img src="https://labterpadu.itk.ac.id/halaman_depan/07.png" alt="" className="object-cover w-full h-full" />
                </div>
            </div>
            <Toaster position="top-right" richColors expand={true} closeButton />
        </>
    );
};