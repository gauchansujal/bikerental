import request from "supertest";
import app from "../../app";
import { UserModel } from "../../models/user.model";
import bcrypt from "bcrypt";

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
    await UserModel.deleteOne({ email: testUser.email });
    await UserModel.deleteOne({ email: "admin@test.com" });

    const hashedPassword = await bcrypt.hash("admin123", 10);

    // ✅ findOneAndUpdate with upsert bypasses schema defaults
    await UserModel.findOneAndUpdate(
      { email: "admin@test.com" },
      {
        $set: {
          firstname: "Super",
          lastname: "Admin",
          email: "admin@test.com",
          username: "superadmin",
          password: hashedPassword,
          role: "admin", // ✅ force admin role
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: false } // ✅ setDefaultsOnInsert:false prevents schema default overriding role
    );

    // ✅ Verify role was actually saved correctly
    const savedAdmin = await UserModel.findOne({ email: "admin@test.com" });
    console.log("✅ Saved admin role:", savedAdmin?.role); // should print "admin"

    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@test.com", password: "admin123" });

    console.log("✅ Login response:", JSON.stringify(loginRes.body, null, 2));

    adminToken = loginRes.body.token;

    if (!adminToken) {
      throw new Error("❌ Admin token missing. Login body: " + JSON.stringify(loginRes.body));
    }
  }, 20000);

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

    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
  });
});