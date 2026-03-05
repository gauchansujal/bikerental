import { UserService } from "../../../services/user.services";
import { UserRepository } from "../../../repositories/user.repository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("../../../config/email");

// ✅ THE FIX: spy on PROTOTYPE methods
// UserService uses module-level: let userRepository = new UserRepository()
// That instance is created before tests run, so constructor mocking doesn't work.
// Prototype spying intercepts ANY instance of UserRepository — including that one.
const getuserByEmailSpy = jest.spyOn(UserRepository.prototype, "getuserByEmail");
const getUserByUsernameSpy = jest.spyOn(UserRepository.prototype, "getUserByUsername");
const createUserSpy = jest.spyOn(UserRepository.prototype, "createUser");
const getUserByIdSpy = jest.spyOn(UserRepository.prototype, "getUserById");
const updateUserSpy = jest.spyOn(UserRepository.prototype, "updateUser");

const mockUser = {
  _id: "507f1f77bcf86cd799439011",
  firstname: "John",
  lastname: "Doe",
  username: "johndoe",
  email: "john@test.com",
  password: "hashedpassword",
  role: "user" as const,
} as any;

describe("UserService", () => {
  let userService: UserService;

  beforeEach(() => {
    jest.clearAllMocks();
    userService = new UserService();
  });

  // ── createUser ─────────────────────────────────────────────────
  describe("createUser", () => {
    const newUserData = {
      firstname: "John",
      lastname: "Doe",
      username: "johndoe",
      email: "john@test.com",
      password: "password123",
      confirmPassword: "password123",
      role: "user" as const,
    };

    test("should create user successfully", async () => {
      getuserByEmailSpy.mockResolvedValue(null);
      getUserByUsernameSpy.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedpassword");
      createUserSpy.mockResolvedValue(mockUser);

      const result = await userService.createUser(newUserData);

      expect(getuserByEmailSpy).toHaveBeenCalledWith("john@test.com");
      expect(getUserByUsernameSpy).toHaveBeenCalledWith("johndoe");
      expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
      expect(result).toEqual(mockUser);
    });

    test("should throw 403 if email already exists", async () => {
      getuserByEmailSpy.mockResolvedValue(mockUser);

      await expect(userService.createUser(newUserData))
        .rejects
        .toMatchObject({ statusCode: 403, message: "email already in use" });
    });

    test("should throw 403 if username already exists", async () => {
      getuserByEmailSpy.mockResolvedValue(null);
      getUserByUsernameSpy.mockResolvedValue(mockUser);

      await expect(userService.createUser(newUserData))
        .rejects
        .toMatchObject({ statusCode: 403, message: " Username already in use" });
    });
  });

  // ── loginUser ──────────────────────────────────────────────────
  describe("loginUser", () => {
    const loginData = { email: "john@test.com", password: "password123" };

    test("should login successfully and return token + user", async () => {
      getuserByEmailSpy.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("mock.jwt.token");

      const result = await userService.loginUser(loginData);

      expect(result.token).toBe("mock.jwt.token");
      expect(result.user).toEqual(mockUser);
    });

    test("should throw 404 if user not found", async () => {
      getuserByEmailSpy.mockResolvedValue(null);

      await expect(userService.loginUser(loginData))
        .rejects
        .toMatchObject({ statusCode: 404, message: "user not found" });
    });

    test("should throw 401 if password is wrong", async () => {
      getuserByEmailSpy.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(userService.loginUser(loginData))
        .rejects
        .toMatchObject({ statusCode: 401, message: "Invalid credential" });
    });

    test("should include correct fields in JWT payload", async () => {
      getuserByEmailSpy.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("mock.jwt.token");

      await userService.loginUser(loginData);

      const jwtPayload = (jwt.sign as jest.Mock).mock.calls[0][0];
      expect(jwtPayload.role).toBe("user");
      expect(jwtPayload.email).toBe("john@test.com");
      expect(jwtPayload.id).toBe(mockUser._id);
    });
  });

  // ── getUserById ────────────────────────────────────────────────
  describe("getUserById", () => {
    test("should return user when found", async () => {
      getUserByIdSpy.mockResolvedValue(mockUser);

      const result = await userService.getUserById(mockUser._id);

      expect(getUserByIdSpy).toHaveBeenCalledWith(mockUser._id);
      expect(result).toEqual(mockUser);
    });

    test("should throw 404 when user not found", async () => {
      getUserByIdSpy.mockResolvedValue(null);

      await expect(userService.getUserById("000000000000000000000000"))
        .rejects
        .toMatchObject({ statusCode: 404, message: "User not found" });
    });
  });

  // ── updateUser ─────────────────────────────────────────────────
  describe("updateUser", () => {
    const updateData = {
      firstname: "Updated",
      email: "john@test.com",
      username: "johndoe",
    };

    test("should update user successfully", async () => {
      const updatedUser = { ...mockUser, firstname: "Updated" };
      getUserByIdSpy.mockResolvedValue(mockUser);
      getuserByEmailSpy.mockResolvedValue(null);
      getUserByUsernameSpy.mockResolvedValue(null);
      updateUserSpy.mockResolvedValue(updatedUser);

      const result = await userService.updateUser(mockUser._id, updateData);

      expect(result?.firstname).toBe("Updated");
    });

    test("should throw 404 if user not found", async () => {
      getUserByIdSpy.mockResolvedValue(null);

      await expect(userService.updateUser("badid", updateData))
        .rejects
        .toMatchObject({ statusCode: 404, message: "User not found" });
    });

    test("should throw 403 if new email is already taken", async () => {
      const otherUser = { ...mockUser, _id: "otherid", email: "taken@test.com" };
      getUserByIdSpy.mockResolvedValue(mockUser);
      getuserByEmailSpy.mockResolvedValue(otherUser);

      await expect(userService.updateUser(mockUser._id, { ...updateData, email: "taken@test.com" }))
        .rejects
        .toMatchObject({ statusCode: 403, message: "Email already in use" });
    });

    test("should throw 403 if new username is already taken", async () => {
      const otherUser = { ...mockUser, _id: "otherid", username: "takenuser" };
      getUserByIdSpy.mockResolvedValue(mockUser);
      getuserByEmailSpy.mockResolvedValue(null);
      getUserByUsernameSpy.mockResolvedValue(otherUser);

      await expect(userService.updateUser(mockUser._id, { ...updateData, username: "takenuser" }))
        .rejects
        .toMatchObject({ statusCode: 403, message: "Username already in use" });
    });

    test("should hash password if password is being updated", async () => {
      getUserByIdSpy.mockResolvedValue(mockUser);
      getuserByEmailSpy.mockResolvedValue(null);
      getUserByUsernameSpy.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue("newhashedpassword");
      updateUserSpy.mockResolvedValue(mockUser);

      await userService.updateUser(mockUser._id, { ...updateData, password: "newpassword" });

      expect(bcrypt.hash).toHaveBeenCalledWith("newpassword", 10);
    });
  });

  // ── sendResetPasswordEmail ─────────────────────────────────────
  describe("sendResetPasswordEmail", () => {
    test("should send reset email successfully", async () => {
      getuserByEmailSpy.mockResolvedValue(mockUser);
      (jwt.sign as jest.Mock).mockReturnValue("reset.token");

      const result = await userService.sendResetPasswordEmail("john@test.com");

      expect(result).toEqual(mockUser);
      expect(jwt.sign).toHaveBeenCalled();
    });

    test("should throw 400 if email not provided", async () => {
      await expect(userService.sendResetPasswordEmail(undefined))
        .rejects
        .toMatchObject({ statusCode: 400, message: "Email is required" });
    });

    test("should throw 404 if email not registered", async () => {
      getuserByEmailSpy.mockResolvedValue(null);

      await expect(userService.sendResetPasswordEmail("ghost@test.com"))
        .rejects
        .toMatchObject({ statusCode: 404, message: "User not found" });
    });
  });

  // ── resetPassword ──────────────────────────────────────────────
  describe("resetPassword", () => {
    test("should reset password successfully", async () => {
      (jwt.verify as jest.Mock).mockReturnValue({ id: mockUser._id });
      getUserByIdSpy.mockResolvedValue(mockUser);
      (bcrypt.hash as jest.Mock).mockResolvedValue("newhashedpassword");
      updateUserSpy.mockResolvedValue(mockUser);

      const result = await userService.resetPassword("valid.token", "newpassword");

      expect(bcrypt.hash).toHaveBeenCalledWith("newpassword", 10);
      expect(result).toEqual(mockUser);
    });

    test("should throw 400 if token not provided", async () => {
      await expect(userService.resetPassword(undefined, "newpassword"))
        .rejects
        .toMatchObject({ statusCode: 400, message: "Invalid or expired token" });
    });

    test("should throw 400 if newPassword not provided", async () => {
      await expect(userService.resetPassword("sometoken", undefined))
        .rejects
        .toMatchObject({ statusCode: 400, message: "Invalid or expired token" });
    });

    test("should throw 400 if token is invalid or expired", async () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error("jwt expired");
      });

      await expect(userService.resetPassword("expired.token", "newpassword"))
        .rejects
        .toMatchObject({ statusCode: 400, message: "Invalid or expired token" });
    });
  });
});