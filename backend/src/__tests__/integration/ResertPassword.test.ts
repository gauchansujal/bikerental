import request from "supertest";
import app from "../../app";
import { UserModel } from "../../models/user.model";

describe("Reset Password API", () => {
  const testUser = {
    firstname: "Reset",
    lastname: "User",
    username: "resetuser",
    email: "reset@example.com",
    password: "password123",
    confirmPassword: "password123",
  };

  beforeAll(async () => {
    await UserModel.deleteOne({ email: testUser.email });

    await request(app).post("/api/auth/register").send(testUser);

    await request(app)
      .post("/api/auth/requestresetPassword")
      .send({ email: testUser.email });
  });

  afterAll(async () => {
    await UserModel.deleteOne({ email: testUser.email });
  });

  test("should fail with invalid token", async () => {
    const res = await request(app)
      .post("/api/auth/reset-password/faketoken")
      .send({ newPassword: "newpassword123" });

    expect(res.statusCode).not.toBe(500);
    expect(res.body.success).toBe(false);
  });
});
