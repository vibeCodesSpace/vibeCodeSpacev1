// vibeCodeSpace_clone/backend/src/routes/generate.test.js
const request = require('supertest');
const express = require('express');
const generateRouter = require('./generate');
const { generateApplication } = require('../lib/aiOrchestrator');

// Mock the orchestrator to prevent actual AI calls
jest.mock('../lib/aiOrchestrator');

const app = express();
app.use(express.json());
app.use('/api', generateRouter);

describe('POST /api/generate-app', () => {
  it('should return 400 if the prompt is missing', async () => {
    const res = await request(app).post('/api/generate-app').send({});
    expect(res.statusCode).toEqual(400);
  });

  it('should return 200 and the generated app on success', async () => {
    // Arrange
    generateApplication.mockResolvedValue({ name: 'Success App' });

    // Act
    const res = await request(app)
      .post('/api/generate-app')
      .send({ prompt: 'a valid prompt' });

    // Assert
    expect(res.statusCode).toEqual(200);
    expect(res.body.application.name).toBe('Success App');
  });
});
