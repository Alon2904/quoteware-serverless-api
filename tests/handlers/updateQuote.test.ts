import { APIGatewayProxyEvent, APIGatewayProxyResult, Callback, Context } from "aws-lambda";
import { handler } from "../../src/handlers/QuoteInProjectHandlers/updateQuote";
import { updateQuote } from "../../src/services/QuoteService";
import { getErrorMessage } from "../../src/utils/errorUtils";

// tests/handlers/updateQuote.test.ts

jest.mock("../../src/services/QuoteService");
jest.mock("../../src/utils/errorUtils");

describe("updateQuote handler", () => {
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

  it("should update a quote successfully", async () => {
    const mockEvent = {
      pathParameters: { id: "1" },
      body: JSON.stringify({
        title: "Updated Title",
        templateVersion: 2,
        itemsTableVersion: 3,
        sections: [{ title: "Updated Section", content: "Updated content" }],
        editedBy: "Jane Doe"
      }),
    } as unknown as APIGatewayProxyEvent;

    (updateQuote as jest.Mock).mockResolvedValue({
      id: "1",
      author: "John Doe",
      title: "Updated Title",
      templateVersion: 2,
      itemsTableVersion: 3,
      createdAt: new Date(),
      lastUpdated: new Date(),
      sections: [{ title: "Updated Section", content: "Updated content" }],
      editedBy: "Jane Doe"
    });

    const result = await handler(mockEvent, mockContext, mockCallback) as APIGatewayProxyResult;
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toHaveProperty("title", "Updated Title");
  });

  it("should return a 400 error if ID is missing", async () => {
    const mockEvent = {
      pathParameters: {},
      body: JSON.stringify({
        title: "Updated Title",
        templateVersion: 2,
        sections: [{ title: "Updated Section", content: "Updated content" }],
        editedBy: "Jane Doe"
      }),
    } as unknown as APIGatewayProxyEvent;

    const result = await handler(mockEvent, mockContext, mockCallback) as APIGatewayProxyResult;
    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toHaveProperty("error", "Quote ID is required");
  });

  it("should return a 500 error if update fails", async () => {
    const mockEvent = {
      pathParameters: { id: "1" },
      body: JSON.stringify({
        title: "Updated Title",
        templateVersion: 2,
        sections: [{ title: "Updated Section", content: "Updated content" }],
        editedBy: "Jane Doe"
      }),
    } as unknown as APIGatewayProxyEvent;

    (updateQuote as jest.Mock).mockRejectedValue(new Error("Update failed"));

    const result = await handler(mockEvent, mockContext, mockCallback) as APIGatewayProxyResult;
    expect(result.statusCode).toBe(500);
  });
});
