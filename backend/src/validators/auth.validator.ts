// auth.validator.ts

function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return false;
    return true;
}

export const validateRegisterData = (
    username: any,
    email: any,
    password: any,
    confirmPassword: any,
) => {
    try {
        if (typeof username !== "string")
            return { status: false, message: "Invalid Username type" };
        if (typeof email !== "string")
            return { status: false, message: "Invalid email type" };
        if (typeof password !== "string")
            return { status: false, message: "Invalid Password type" };
        if (typeof confirmPassword !== "string")
            return { status: false, message: "Invalid confirmPassword type" };
        if (password !== confirmPassword) {
            return { status: false, message: "Password didn't match" };
        }
        if (!isValidEmail(email)) {
            return { status: false, message: "Invalid Email Address" };
        }
        return { status: true };
    } catch (error: any) {
        console.error(error.message);
        return {
            status: false,
            message: "Validation Executio Failed!",
        };
    }
};

export const validateLoginData = (email: string, password: string) => {
    try {
        if (
            !email ||
            email.trim() === "" ||
            !password ||
            password.trim() === ""
        ) {
            return { status: false, message: "Missing Data" };
        }
        if (!isValidEmail(email))
            return { status: false, message: "Invalid Email Address" };
        return { status: true };
    } catch (error: any) {
        console.error(error.message);
        return { status: false, message: "Something went wrong" };
    }
};
