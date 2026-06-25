import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";

// form interface
interface RegisterFormInput {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

function RegisterPage() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<RegisterFormInput>();

    const navigate = useNavigate();

    const onFormSubmit: SubmitHandler<RegisterFormInput> = (data) => {
        console.log("New user data:", data);
    };

    return (
        <div className="w-full h-screen flex items-center justify-center p-4">
            <form
                onSubmit={handleSubmit(onFormSubmit)}
                className="w-full max-w-sm bg-surface px-3 py-6 border border-border rounded-xl shadow-lg flex flex-col items-center gap-4"
            >
                <h1 className="text-center text-2xl font-semibold">
                    Create Account
                </h1>

                <div className="w-full flex flex-col items-start gap-1">
                    <label htmlFor="username" className="text-sm font-medium">
                        username:
                    </label>
                    <input
                        id="username"
                        type="username"
                        placeholder="username"
                        className="w-full bg-primary border border-border rounded-lg p-3 outline-0 text-text-body placeholder:text-text-muted hover:border-border-hover focus:border-border-focus 
                        "
                        {...register("username", {
                            required: "username is required",
                        })}
                    />
                    {/* error message */}
                    {errors.username && (
                        <p className="text-sm font-medium text-error">
                            {errors.username.message}
                        </p>
                    )}
                </div>

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
                        className="w-full bg-primary border border-border rounded-lg p-3 outline-0 text-text-body placeholder:text-text-muted hover:border-border-hover focus:border-border-focus 
                        "
                        {...register("password", {
                            required: "Password is required",
                            minLength: {
                                value: 6,
                                message:
                                    "Password must be at least 6 characters",
                            },
                        })}
                    />
                    {/* error message */}
                    {errors.password && (
                        <p className="text-sm font-medium text-error">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                <div className="w-full flex flex-col items-start gap-1">
                    <label
                        htmlFor="confirmPassword"
                        className="text-sm font-medium"
                    >
                        Confirm Password:
                    </label>
                    <input
                        id="confirmPassword"
                        type="password"
                        placeholder="confirm-password"
                        className="w-full bg-primary border border-border rounded-lg p-3 outline-0 text-text-body placeholder:text-text-muted hover:border-border-hover focus:border-border-focus 
                        "
                        {...register("confirmPassword", {
                            required: "Confirm password is required",
                            validate: (value) =>
                                value === watch("password") ||
                                "Passwords do not match",
                        })}
                    />
                    {/* error message */}
                    {errors.confirmPassword && (
                        <p className="text-sm font-medium text-error">
                            {errors.confirmPassword.message}
                        </p>
                    )}
                </div>

                <div className="w-full flex items-start">
                    <button
                        type="submit"
                        className="w-full bg-btn-primary hover:bg-btn-hover text-btn-text py-3 rounded-lg hover:cursor-pointer font-medium active:scale-[0.96] transition-all duration-150"
                    >
                        Create
                    </button>
                </div>
                <div>
                    <p className="text-sm font-medium">
                        Already have an account! &nbsp;
                        <a
                            onClick={() => {
                                navigate("/login");
                            }}
                            className="text-md font-semibold hover:cursor-pointer hover:underline text-text-main hover:text-text-muted"
                        >
                            Login
                        </a>
                    </p>
                </div>
            </form>
        </div>
    );
}

export default RegisterPage;
