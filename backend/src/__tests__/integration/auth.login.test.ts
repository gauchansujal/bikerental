import request from 'supertest';
import app from '../../app';
import { UserModel } from '../../models/user.model';

describe('Auth Login API', () => {
  const testUser = {
    firstname: 'Test',
    lastname: 'User',
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
    confirmPassword: 'password123',
  };

  beforeAll(async () => {
    // remove if exists
    await UserModel.deleteOne({ email: testUser.email });

    // create real user via register
    await request(app)
      .post('/api/auth/register')
      .send(testUser);
  });

  afterAll(async () => {
    await UserModel.deleteOne({ email: testUser.email });
  });

  test('should login with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
  });

  test('should fail with invalid email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'wrong@example.com',
        password: testUser.password,
      });

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });

  test('should fail with wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: 'wrongpassword',
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
