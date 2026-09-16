import http from "k6/http";
import {check} from "k6";

const BASE_URL = "http://localhost:3000/v1";
const PASSWORD = "testuser@123";
const SALE_ID = "6aa4f4f920ea6d6d248a21f4";

const users = Array.from({length: 20}, (_, i) => {
    const num = String(i+1).padStart(2, "0");
    return {
        email: `testuser${num}@gmail.com`, 
        password: PASSWORD,
    }
});

export const options = {
    vus: 20,
    iterations: 20,
};

export default function () {
    const user = users[__VU - 1];

    // login
    const loginResponse = http.post(`${BASE_URL}/auth/login`, 
                                     JSON.stringify({
                                        email: user.email, 
                                        password: user.password
                                    }),
                                    {
                                        headers: {
                                           "Content-Type": "application/json", 
                                        }
                                    });

    check(loginResponse, {
        "login-successful" : (res) => res.status === 200,  
    });
   
    // purchase from sale
    const purchaseResponse = http.post(`${BASE_URL}/purchase/salePurchase/${SALE_ID}`, null);
    console.log(
        `VU ${__VU} (${user.email}) -> ${purchaseResponse.status}`,
        purchaseResponse.body
    );
}

