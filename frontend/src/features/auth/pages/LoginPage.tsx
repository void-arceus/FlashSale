import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext";
import Loading from "../../../components/ui/Loading";

interface LoginFormInputs {
    email: string;
    password: string;
    rememberMe: boolean;
}

function LoginPage() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormInputs>();
    const [loading, setLoading] = useState<boolean>(false);
    const { showToaster } = useToast();

    const { setUserData } = useAuth();
    const navigate = useNavigate();

    const onFormSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
        try {
            setLoading(true);
            const res = await login(data);
            if (res.status === true) {
                showToaster(res.message, "success");
                setUserData(res.data);
                if (res.data.role === "admin") {
                    navigate("/admin");
                } else if (res.data.role === "user") {
                    navigate("/userDashboard");
                } else {
                    console.log("404! Not Found");
                }
            } else {
                setUserData(null);
                showToaster(res.message, "error");
            }
        } catch (error: any) {
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full h-screen flex items-center justify-center p-4">
            <form
                onSubmit={handleSubmit(onFormSubmit)}
                className="w-full max-w-sm bg-surface px-3 py-6 border border-border rounded-xl shadow-lg flex flex-col items-center gap-4"
            >
                <h1 className="text-center text-2xl font-semibold">Login</h1>
                <div className="w-full flex flex-col items-start gap-1">
                    <label htmlFor="email" className="text-sm font-medium">
                        Email:
                    </label>
                    <input
                        id="email"
                        type="email"
                        placeholder="email"
                        className="w-full bg-primary border border-border rounded-lg p-3 outline-0 text-text-body placeholder:text-text-muted hover:border-border-hover focus:border-border-focus 
                        "
                        {...register("email", {
                            required: "Email is required",
                        })}
                    />
                    {/* error message */}
                    {errors.email && (
                        <p className="text-sm font-medium text-error">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                <div className="w-full flex flex-col items-start gap-1">
                    <label htmlFor="password" className="text-sm font-medium">
                        Password:
                    </label>
                    <input
                        id="password"
                        type="password"
                        placeholder="password"
                        className="w-full bg-primary border border-border rounded-lg p-3 outline-0 text-text-body placeholder:text-text-muted hover:border-border-hover focus:border-border-focus "
                        {...register("password", {
                            required: "Password is required",
                            minLength: {
                                value: 6,
                                message:
                                    "Password must be at least 6 characters",
                            },
                        })}
                    />
                    {errors.password && (
                        <p className="text-sm font-medium text-error">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                <div className="w-full flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <input
                            id="rememberme"
                            type="checkbox"
                            className="hover:cursor-pointer"
                            {...register("rememberMe")}
                        />
                        <label
                            htmlFor="rememberme"
                            className="text-sm text-text-main hover:cursor-pointer"
                        >
                            Remember me
                        </label>
                    </div>
                    <a className="hover:cursor-pointer hover:underline font-medium text-text-main hover:text-text-muted">
                        Forgot Password
                    </a>
                </div>

                <div className="w-full flex items-start">
                    <button
                        type="submit"
                        className="w-full bg-btn-primary hover:bg-btn-hover text-btn-text py-3 rounded-lg hover:cursor-pointer font-medium active:scale-[0.96] transition-all duration-150 flex items-center justify-center"
                    >
                        {loading ? <Loading /> : "Login"}
                    </button>
                </div>
                <div>
                    <p className="text-sm font-medium">
                        Don't have an account yet! &nbsp;
                        <a
                            onClick={() => {
                                navigate("/register");
                            }}
                            className="text-md font-semibold hover:cursor-pointer hover:underline text-text-main hover:text-text-muted"
                        >
                            Create new
                        </a>
                    </p>
                </div>
            </form>
        </div>
    );
}

export default LoginPage;
