import { useEffect, useState } from "react";
import { Navigate, NavLink, useLocation, useNavigate } from "react-router-dom";
import { LoginCredentials } from "../../domain/Auth/Auth";
import { useAuth } from "../../application/hooks/useAuth";
import { ApiResponse } from "../../shared/Types";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useValidationErrors } from "../hooks/useValidationError";

export const Login: React.FC = () => {
    // hooks
    const { user, login } = useAuth();
    const { errors, setErrors, processErrors } = useValidationErrors()
    const [formData, setFormData] = useState<LoginCredentials>({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [registerStatus, setRegisterStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [loginStatus, setLoginStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const navigate = useNavigate();
    const location = useLocation();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            setErrors({})
            await login(formData);
            navigate('/panel');
        } catch (e) {
            const error = e as ApiResponse
            if (error.message === 'Unauthorized') {
                setLoginStatus({ type: 'error', message: 'Email atau password salah!' })
            } else if (error.errors) {
                processErrors(error.errors);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const status = location.state?.from?.state?.register_status;
        if (status) {
            setRegisterStatus(status)
            navigate(location.pathname, { replace: true });
        }
    }, [])

    if (user) {
        return <Navigate to="/panel" state={{ from: location }} replace />;
    }

    return (
        <div className="grid min-h-screen bg-white md:grid-cols-2 lg:grid-cols-9">
            <div className="flex flex-col items-center w-full px-5 py-32 gap-5 sm:px-10 md:px-16 lg:px-10 xl:px-16 h-fit lg:col-span-4">
                <img src="https://labterpadu.itk.ac.id/gambar_pendukung/logo_depan.jpg" className="w-56" alt="" />
                <div className="w-full text-left">
                    <h3 className="text-3xl font-medium">Selamat Datang</h3>
                    <h4 className="text-base">Silakan masuk ke akun Anda.</h4>
                </div>
                {registerStatus && (
                    <div className="w-full px-4 py-3 leading-normal text-green-700 bg-green-100 rounded-lg" role="alert">
                        <p>{registerStatus.message}</p>
                    </div>
                )}
                {loginStatus && (
                    <div className="w-full px-4 py-3 leading-normal text-red-700 bg-red-100 rounded-lg" role="alert">
                        <p>{loginStatus.message}</p>
                    </div>
                )}
                <form className="flex flex-col w-full gap-5" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="xxx@xxx.xxx"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        {errors['email'] && (
                            <p className="mt-1 text-xs italic text-red-500">{errors['email']}</p>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="xxxxxxxxx"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        {errors['password'] && (
                            <p className="mt-1 text-xs italic text-red-500">{errors['password']}</p>
                        )}
                    </div>
                    <Button type="submit" disabled={isLoading}>{isLoading ? 'Logging in...' : 'Login'}</Button>
                    <div className="flex gap-2 text-sm">
                        <p>Belum Punya Akun?</p>
                        <NavLink to={'/register'} className='font-medium hover:text-blue-500'>Daftar</NavLink>
                    </div>
                </form>
            </div>
            <div className="relative hidden md:block lg:col-span-5">
                <div className="absolute w-full h-full col-span-2 bg-black opacity-50"></div>
                <img src="https://labterpadu.itk.ac.id/halaman_depan/07.png" alt="" className="object-cover w-full h-full" />
            </div>
        </div>
    );
};