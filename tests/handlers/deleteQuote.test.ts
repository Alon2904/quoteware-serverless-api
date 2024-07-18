import { APIGatewayProxyEvent, APIGatewayProxyResult, Callback, Context } from "aws-lambda";
import { handler } from "../../src/handlers/QuoteInProjectHandlers/deleteQuote";
import { deleteQuote } from "../../src/services/QuoteService";
import { getErrorMessage } from "../../src/utils/errorUtils";

jest.mock("../../src/services/QuoteService");
jest.mock("../../src/utils/errorUtils");

describe("deleteQuote handler", () => {
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

  it("should delete a quote successfully", async () => {
    const mockEvent = {
      pathParameters: { id: "1" },
    } as unknown as APIGatewayProxyEvent;

    (deleteQuote as jest.Mock).mockResolvedValue(undefined);

    const result = await handler(mockEvent, mockContext, mockCallback) as APIGatewayProxyResult;
    expect(result.statusCode).toBe(200);
    expect(result.body).toBe(JSON.stringify(undefined));
  });

  it("should return a 400 error if ID is missing", async () => {
    const mockEvent = {
      pathParameters: {},
    } as unknown as APIGatewayProxyEvent;

    const result = await handler(mockEvent, mockContext, mockCallback) as APIGatewayProxyResult;
    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toHaveProperty("error", "Quote ID is required");
  });

  it("should return a 500 error if delete fails", async () => {
    const mockEvent = {
      pathParameters: { id: "1" },
    } as unknown as APIGatewayProxyEvent;

    (deleteQuote as jest.Mock).mockRejectedValue(new Error("Delete failed"));
    (getErrorMessage as jest.Mock).mockReturnValue("Delete failed");

    const result = await handler(mockEvent, mockContext, mockCallback) as APIGatewayProxyResult;
    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body)).toHaveProperty("error", "Delete failed");
  });
});
