import request from 'supertest';
import app from '../../app';
import { UserModel } from '../../models/user.model';

describe('Auth register api', ()=>{
    const testUser = {
        firstname:'Test',
        lastName: 'User',
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
        confirmPassword: 'password123',

    };
    beforeAll(async()=>{
        await UserModel.deleteOne({email:testUser.email});

    });
    afterAll(async()=>{
        await UserModel.deleteOne({email:testUser.email});

    });
    test('should validate missing fields', async()=>{
        const res = await request(app)
        .post('/api/auth/register')
        .send({firstname: testUser.firstname, email: testUser.email});

     
        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);

    });
      test('should register new user', async () => {
        const res = await request(app).post('/api/auth/register').send(testUser);

        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('user created');
    });
});