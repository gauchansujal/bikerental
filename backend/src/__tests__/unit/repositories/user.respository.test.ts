import { UserRepository } from "../../../repositories/user.repository";
import { UserModel } from "../../../models/user.model";

// ✅ Fix mock path - matches the actual import path in user.repository.ts
jest.mock("../../../models/user.model");

// ✅ Cast as any to avoid TypeScript complaints about _id (string vs ObjectId) and role type
const mockUser = {
  _id: "507f1f77bcf86cd799439011",
  firstname: "John",
  lastname: "Doe",
  username: "johndoe",
  email: "john@test.com",
  password: "hashedpassword",
  role: "user" as const,
} as any; // ✅ fixes "_id: string not assignable to ObjectId"

describe("UserRepository", () => {
  let userRepository: UserRepository;

  beforeEach(() => {
    userRepository = new UserRepository();
    jest.clearAllMocks();
  });

  describe("getuserByEmail", () => {
    test("should return user when email exists", async () => {
      (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);
      const result = await userRepository.getuserByEmail("john@test.com");
      expect(UserModel.findOne).toHaveBeenCalledWith({ email: "john@test.com" });
      expect(result).toEqual(mockUser);
    });

    test("should return null when email not found", async () => {
      (UserModel.findOne as jest.Mock).mockResolvedValue(null);
      const result = await userRepository.getuserByEmail("notfound@test.com");
      expect(result).toBeNull();
    });
  });

  describe("getUserByUsername", () => {
    test("should return user when username exists", async () => {
      (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);
      const result = await userRepository.getUserByUsername("johndoe");
      expect(UserModel.findOne).toHaveBeenCalledWith({ username: "johndoe" });
      expect(result).toEqual(mockUser);
    });

    test("should return null when username not found", async () => {
      (UserModel.findOne as jest.Mock).mockResolvedValue(null);
      const result = await userRepository.getUserByUsername("ghost");
      expect(result).toBeNull();
    });
  });

  describe("createUser", () => {
    test("should create and return new user", async () => {
      const saveMock = jest.fn().mockResolvedValue(mockUser);
      (UserModel as any).mockImplementation(() => ({ save: saveMock }));
      const result = await userRepository.createUser(mockUser);
      expect(saveMock).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });
  });

  describe("getUserById", () => {
    test("should return user when id exists", async () => {
      (UserModel.findById as jest.Mock).mockResolvedValue(mockUser);
      const result = await userRepository.getUserById(mockUser._id);
      expect(UserModel.findById).toHaveBeenCalledWith(mockUser._id);
      expect(result).toEqual(mockUser);
    });

    test("should return null when id not found", async () => {
      (UserModel.findById as jest.Mock).mockResolvedValue(null);
      const result = await userRepository.getUserById("000000000000000000000000");
      expect(result).toBeNull();
    });
  });

  describe("getAllUsers", () => {
    test("should return paginated users", async () => {
      const mockUsers = [mockUser, { ...mockUser, _id: "2", email: "jane@test.com" }];
      const limitMock = jest.fn().mockResolvedValue(mockUsers);
      const skipMock = jest.fn().mockReturnValue({ limit: limitMock });
      (UserModel.find as jest.Mock) = jest.fn().mockReturnValue({ skip: skipMock });
      (UserModel.countDocuments as jest.Mock).mockResolvedValue(2);

      const result = await userRepository.getAllUsers(1, 10);
      expect(result.users).toEqual(mockUsers);
      expect(result.total).toBe(2);
      expect(skipMock).toHaveBeenCalledWith(0);
      expect(limitMock).toHaveBeenCalledWith(10);
    });

    test("should apply search filter when search is provided", async () => {
      const limitMock = jest.fn().mockResolvedValue([mockUser]);
      const skipMock = jest.fn().mockReturnValue({ limit: limitMock });
      const findMock = jest.fn().mockReturnValue({ skip: skipMock });
      (UserModel.find as jest.Mock) = findMock;
      (UserModel.countDocuments as jest.Mock).mockResolvedValue(1);

      await userRepository.getAllUsers(1, 10, "john");
      const filterArg = findMock.mock.calls[0][0];
      expect(filterArg.$or).toBeDefined();
      expect(filterArg.$or[0].username.$regex).toBe("john");
    });

    test("should return empty array when no users found", async () => {
      const limitMock = jest.fn().mockResolvedValue([]);
      const skipMock = jest.fn().mockReturnValue({ limit: limitMock });
      (UserModel.find as jest.Mock) = jest.fn().mockReturnValue({ skip: skipMock });
      (UserModel.countDocuments as jest.Mock).mockResolvedValue(0);

      const result = await userRepository.getAllUsers(1, 10);
      expect(result.users).toEqual([]);
      expect(result.total).toBe(0);
    });
  });

  describe("updateUser", () => {
    test("should return updated user", async () => {
      const updatedUser = { ...mockUser, firstname: "Updated" };
      (UserModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedUser);

      const result = await userRepository.updateUser(mockUser._id, { firstname: "Updated" } as any);
      expect(UserModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mockUser._id, { firstname: "Updated" }, { new: true }
      );
      expect(result?.firstname).toBe("Updated");
    });

    test("should return null when user not found", async () => {
      (UserModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);
      const result = await userRepository.updateUser("000000000000000000000000", {} as any);
      expect(result).toBeNull();
    });
  });

  describe("deleteUser", () => {
    test("should return true when user deleted", async () => {
      (UserModel.findByIdAndDelete as jest.Mock).mockResolvedValue(mockUser);
      const result = await userRepository.deleteUser(mockUser._id);
      expect(UserModel.findByIdAndDelete).toHaveBeenCalledWith(mockUser._id);
      expect(result).toBe(true);
    });

    test("should return false when user not found", async () => {
      (UserModel.findByIdAndDelete as jest.Mock).mockResolvedValue(null);
      const result = await userRepository.deleteUser("000000000000000000000000");
      expect(result).toBe(false);
    });
  });
});