// vibeCodeSpace_clone/backend/src/lib/aiOrchestrator.test.js
const { generateApplication } = require('./aiOrchestrator');
const OpenaiClient = require('./openaiClient');

// Mock the entire openaiClient module
jest.mock('./openaiClient');

describe('AI Orchestrator', () => {
  it('should return a complete application object on successful generation', async () => {
    // Arrange: Mock the AI response
    const mockResponse = {
      status: 'complete',
      application: { name: 'Test App', frontend: {}, backend: {} },
    };
    OpenaiClient.generateText.mockResolvedValue(JSON.stringify(mockResponse));

    // Act
    const result = await generateApplication('a test prompt', 'session-123');

    // Assert
    expect(result.name).toBe('Test App');
    expect(OpenaiClient.generateText).toHaveBeenCalledTimes(1);
  });
});
