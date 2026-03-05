import request from "supertest";
import app from "../../app";
import { UserModel } from "../../models/user.model";

describe("Send Reset Password Email API", () => {
  const testUser = {
    firstname: "Reset",
    lastname: "Tester",
    username: "resettester",
    email: "resettester@test.com",
    password: "password123",
    confirmPassword: "password123",
  };

  beforeAll(async () => {
    await UserModel.deleteOne({ email: testUser.email });
    // ✅ Register user so email exists in DB when we call reset
    await request(app).post("/api/auth/register").send(testUser);
  }, 15000);

  afterAll(async () => {
    await UserModel.deleteOne({ email: testUser.email });
  });

  test("should send reset password email", async () => {
    const res = await request(app)
      .post("/api/auth/requestresetPassword") // ✅ matches your auth.routes.ts
      .send({ email: testUser.email });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test("should fail if email not provided", async () => {
    const res = await request(app)
      .post("/api/auth/requestresetPassword")
      .send({});

    // ✅ Your service: if (!email) throw new HttpError(400, "Email is required")
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test("should fail if email not registered", async () => {
    const res = await request(app)
      .post("/api/auth/requestresetPassword")
      .send({ email: "notregistered@test.com" });

    // ✅ Your service: throw new HttpError(404, "User not found")
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });
});