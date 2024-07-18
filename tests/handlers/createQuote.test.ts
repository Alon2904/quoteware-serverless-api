import { APIGatewayProxyEvent, APIGatewayProxyResult, Callback, Context } from "aws-lambda";
import { handler } from "../../src/handlers/QuoteInProjectHandlers/createQuote";
import { createQuote } from "../../src/services/QuoteService";

// tests/handlers/createQuote.test.ts

jest.mock("../../src/services/QuoteService");

describe("createQuote handler", () => {
  const mockContext: Context = {
    callbackWaitsForEmptyEventLoop: false,
    functionName: "mockFunction",
    functionVersion: "1",
    invokedFunctionArn: "arn:aws:lambda:mockFunction",
    memoryLimitInMB: "128",
    awsRequestId: "mockRequestId",
    logGroupName: "mockLogGroup",
    logStreamName: "mockLogStream",
    getRemainingTimeInMillis: jest.fn(),
    done: jest.fn(),
    fail: jest.fn(),
    succeed: jest.fn(),
  };

  const mockCallback: Callback<APIGatewayProxyResult> = jest.fn();

  it("should create a new quote successfully", async () => {
    const mockEvent = {
      body: JSON.stringify({
        author: "John Doe",
        projectId: "1",
        title: "Sample Quote",
        templateVersion: 1,
        itemsTableVersion: 3,
        sections: [{ title: "Introduction", content: "This is the introduction." }],
      }),
    } as APIGatewayProxyEvent;

    (createQuote as jest.Mock).mockResolvedValue({
      id: "1",
      author: "John Doe",
      projectId: "1",
      title: "Sample Quote",
      templateVersion: 1,
      createdAt: new Date(),
      lastUpdated: new Date(),
      sections: [{ title: "Introduction", content: "This is the introduction." }],
    });

    const result = await handler(mockEvent, mockContext, mockCallback) as APIGatewayProxyResult;
    expect(result.statusCode).toBe(201);
    expect(JSON.parse(result.body)).toHaveProperty("id");
  });

  it("should return a 500 error if creation fails", async () => {
    const mockEvent = {
      body: JSON.stringify({
        author: "John Doe",
        title: "Sample Quote",
        templateVersion: 1,
        sections: [{ title: "Introduction", content: "This is the introduction." }],
      }),
    } as APIGatewayProxyEvent;

    (createQuote as jest.Mock).mockRejectedValue(new Error("Creation failed"));

    const result = await handler(mockEvent, mockContext, mockCallback) as APIGatewayProxyResult;
    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body)).toHaveProperty("error", "Creation failed");
  });
});
