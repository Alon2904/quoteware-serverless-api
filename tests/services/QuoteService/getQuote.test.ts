import dynamoDb from "../../../src/utils/dynamoDB";
import { Quote } from "../../../src/models/Quote";
import { getQuote } from "../../../src/services/QuoteService";

// Mock DynamoDB client
jest.mock("../../../src/utils/dynamoDB");

describe("getQuote", () => {
  const mockGet = dynamoDb.get as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should get a quote successfully", async () => {
    const existingQuote: Quote = {
      id: "1",
      projectId: "1",
      author: "John Doe",
      title: "Original Title",
      templateVersion: 1,
      itemsTableVersion: 2,
      createdAt: new Date(),
      lastUpdated: new Date(),
      sections: [{sectionName: "this is section name",  title: "Introduction", content: "Original content", sectionLocation: 1 }],
      editedBy: "John Doe"
    };

    mockGet.mockReturnValue({
      promise: jest.fn().mockResolvedValue({ Item: existingQuote }),
    });

    const result = await getQuote("1");

    expect(result).toEqual(existingQuote);

    expect(mockGet).toHaveBeenCalledWith({
      TableName: process.env.QUOTES_TABLE,
      Key: { id: "1" },
    });
  });

  it("should return null if the quote does not exist", async () => {
    mockGet.mockReturnValue({
      promise: jest.fn().mockResolvedValue({}),
    });

    const result = await getQuote("2");

    expect(result).toBeNull();
  });

  it("should throw an error if DynamoDB get fails", async () => {
    mockGet.mockReturnValue({
      promise: jest.fn().mockRejectedValue(new Error("DynamoDB error")),
    });

    await expect(getQuote("1")).rejects.toThrow("Could not fetch quote with ID 1");
  });
});
