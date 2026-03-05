import request from "supertest";
import app from "../../app";
import { UserModel } from "../../models/user.model";

describe("Reset Password API", () => {
  const testUser = {
    firstname: "Reset",
    lastname: "User",
    username: "resetpassworduser",
    email: "resetpassworduser@test.com",
    password: "password123",
    confirmPassword: "password123",
  };

  beforeAll(async () => {
    await UserModel.deleteMany({ email: testUser.email });
    await request(app).post("/api/auth/register").send(testUser);
  }, 15000); // ✅ increased timeout

  afterAll(async () => {
    await UserModel.deleteMany({ email: testUser.email });
  });

  test("should fail with invalid token", async () => {
    const res = await request(app)
      .post("/api/auth/reset-password/invalidtoken123") // ✅ correct route
      .send({ newPassword: "newpassword123" });

    expect(res.statusCode).toBe(400); // or 500 depending on your error handling
    expect(res.body.success).toBe(false);
  });

  test("should fail if newPassword not provided", async () => {
    const res = await request(app)
      .post("/api/auth/reset-password/sometoken")
      .send({});

    expect(res.body.success).toBe(false);
  });
});