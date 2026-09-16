import axios from "axios";
const BASE_URL = "http://localhost:3000/v1/auth/register";
const PASSWORD = "testuser@123";

async function createTestUsers() {
    for (let i = 1; i <= 20; ++i) {
        const num = String(i).padStart(2, "0");
        const user = {
            username: `test_user_${num}`,
            email: `testuser${num}@gmail.com`,
            password: PASSWORD,
            confirmPassword: PASSWORD,
        };
        try {
            const response = await axios.post(`${BASE_URL}`, user);
            console.log(`User created successfully:
                         username: ${user.username}
                         email: ${user.email}
                         status: ${response.data.status}
                         `);
        } catch (error: any) {
            console.error(error);
        }
    }
}

createTestUsers();
