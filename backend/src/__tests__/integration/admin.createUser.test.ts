import request from "supertest";
import app from "../../app";
import { UserModel } from "../../models/user.model";

describe("Admin Create User API", () => {
  const testUser = {
    firstname: "AdminTest",
    lastname: "User",
    username: "admintestuser",
    email: "admintestuser@test.com",
    password: "password123",
    confirmPassword: "password123",
  };

  let adminToken: string;

  beforeAll(async () => {
    // Remove test users
    await UserModel.deleteOne({ email: testUser.email });
    await UserModel.deleteOne({ email: "admin@test.com" });

    // Create admin in DB
    const admin = new UserModel({
      firstname: "Super",
      lastname: "Admin",
      email: "admin@test.com",
      username: "superadmin",
      password: "admin123",
      role: "admin",
    });
    await admin.save();

    // Login admin to get token
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@test.com", password: "admin123" });

    adminToken = res.body.token;
  });

  afterAll(async () => {
    await UserModel.deleteOne({ email: testUser.email });
    await UserModel.deleteOne({ email: "admin@test.com" });
  });

  test("should create user successfully", async () => {
    const res = await request(app)
      .post("/api/admin/users")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(testUser);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe(testUser.email);
  });

  test("should fail if required fields missing", async () => {
    const res = await request(app)
      .post("/api/admin/users")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ email: "incomplete@test.com" });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test("should fail if email already exists", async () => {
    const res = await request(app)
      .post("/api/admin/users")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(testUser);

    expect(res.body.success).toBe(false);
  });
});
