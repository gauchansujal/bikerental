import request from "supertest";
import app from "../../app";
import { UserModel } from "../../models/user.model";

describe("Send Reset Password Email API", () => {
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
  });

  afterAll(async () => {
    await UserModel.deleteOne({ email: testUser.email });
  });

  test("should send reset password email", async () => {
    const res = await request(app)
      .post("/api/auth/forgot-password")
      .send({ email: testUser.email });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test("should fail if email not provided", async () => {
    const res = await request(app)
      .post("/api/auth/forgot-password")
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
