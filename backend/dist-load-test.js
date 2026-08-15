// load-test.ts
import http from "k6/http";
import { check, sleep } from "k6";
var BASE_URL = "http://localhost:3000";
var PRODUCT_ID = "6a6ae48e144ed7995171c8c6";
var options = {
  // stages: [
  //     { duration: "5s", target: 50 }, // Ramp up to 50 VUs
  //     { duration: "15s", target: 200 }, // Spike to 200 VUs
  //     { duration: "5s", target: 0 }, // Cool down
  // ],
  stages: [
    { duration: "5s", target: 1 },
    { duration: "10s", target: 1 },
    { duration: "5s", target: 5 },
    { duration: "10s", target: 5 },
    { duration: "5s", target: 10 },
    { duration: "10s", target: 10 },
    { duration: "5s", target: 20 },
    { duration: "10s", target: 20 },
    { duration: "5s", target: 0 }
  ],
  thresholds: {
    http_req_failed: ["rate<0.01"],
    // Error rate should be under 1%
    http_req_duration: ["p(95)<500"]
    // 95% of requests should respond under 500ms
  }
};
function setup() {
  const loginUrl = `${BASE_URL}/v1/auth/login`;
  const payload = JSON.stringify({
    email: "voidarceus123@gmail.com",
    password: "voidarceus"
  });
  const params = {
    headers: {
      "Content-Type": "application/json"
    }
  };
  const res = http.post(loginUrl, payload, params);
  const setCookieHeader = res.headers["Set-Cookie"];
  if (res.status !== 200 || !setCookieHeader) {
    console.log(`\u274C Setup failed! Status: ${res.status}`);
    console.log(`\u274C Response body: ${res.body}`);
    throw new Error("Authentication failed in setup step. Check logs.");
  }
  console.log("\u2705 Successfully logged in during setup step.");
  return { cookieHeader: setCookieHeader };
}
function load_test_default(data) {
  const purchaseUrl = `${BASE_URL}/v1/purchase/product/${PRODUCT_ID}`;
  const payload = JSON.stringify({
    purchaseQuantity: 1
  });
  const params = {
    headers: {
      "Content-Type": "application/json",
      Cookie: data.cookieHeader
      // Attach the session cookie
    }
  };
  const res = http.post(purchaseUrl, payload, params);
  console.log(`status=${res.status}, body=${res.body}`);
  check(res, {
    "status is 200 or 201": (r) => r.status === 200 || r.status === 201
  });
  sleep(0.1);
}
export {
  load_test_default as default,
  options,
  setup
};
