import dynamoDb from "../../../src/utils/dynamoDB";
import { Quote } from "../../../src/models/Quote";
import { getQuote } from "../../../src/services/QuoteService";

// tests/services/QuoteService/getQuote.test.ts

// Mock DynamoDB client
jest.mock("../../../src/utils/dynamoDB");

describe("getQuote", () => {
  const TableName = process.env.QUOTES_TABLE as string;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should get a quote by ID", async () => {
    const quoteId = "1";
    const mockQuote = new Quote(
      quoteId,
      "John Doe",
      "Sample Quote",
      "Sample Title",
      "project",
      1,
      2,
      new Date().toISOString(),
      "John Doe",
      []
    );

    const mockGet = dynamoDb.get as jest.Mock;
    mockGet.mockReturnValue({
      promise: jest.fn().mockResolvedValue({ Item: mockQuote }),
    });

    const result = await getQuote(quoteId);

    expect(result).toEqual(mockQuote);
    expect(mockGet).toHaveBeenCalledWith({
      TableName,
      Key: { quote_id: quoteId },
    });
  });

  it("should return null if the quote does not exist", async () => {
    const quoteId = "2";

    const mockGet = dynamoDb.get as jest.Mock;
    mockGet.mockReturnValue({
      promise: jest.fn().mockResolvedValue({}),
    });

    const result = await getQuote(quoteId);

    expect(result).toBeNull();
    expect(mockGet).toHaveBeenCalledWith({
      TableName,
      Key: { quote_id: quoteId },
    });
  });

  it("should throw an error if DynamoDB get fails", async () => {
    const quoteId = "3";

    const mockGet = dynamoDb.get as jest.Mock;
    mockGet.mockReturnValue({
      promise: jest.fn().mockRejectedValue(new Error("DynamoDB error")),
    });

    await expect(getQuote(quoteId)).rejects.toThrow("Could not get quote");
  });
});