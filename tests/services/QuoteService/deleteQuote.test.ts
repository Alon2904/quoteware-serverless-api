import dynamoDb from "../../../src/utils/dynamoDB";
import { Quote } from "../../../src/models/Quote";
import { deleteQuote } from "../../../src/services/QuoteService";

// Mock DynamoDB client
jest.mock("../../../src/utils/dynamoDB");

describe("deleteQuote", () => {
  const mockGet = dynamoDb.get as jest.Mock;
  const mockDelete = dynamoDb.delete as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should delete a quote successfully", async () => {
    const existingQuote: Quote = {
      id: "1",
      author: "John Doe",
      projectId: "1",
      title: "Sample Quote",
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

    mockDelete.mockReturnValue({
      promise: jest.fn().mockResolvedValue({}),
    });

    await expect(deleteQuote("1")).resolves.toBeUndefined();
    expect(mockDelete).toHaveBeenCalledWith({
      TableName: process.env.QUOTES_TABLE,
      Key: { id: "1" },
    });
  });

  it("should throw an error if the quote does not exist", async () => {
    mockGet.mockReturnValue({
      promise: jest.fn().mockResolvedValue({}),
    });

    await expect(deleteQuote("2")).rejects.toThrow("Quote with ID 2 not found");
  });

  it("should throw an error if DynamoDB delete fails", async () => {
    const existingQuote: Quote = {
      id: "1",
      author: "John Doe",
      projectId: "1",
      title: "Sample Quote",
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

    mockDelete.mockReturnValue({
      promise: jest.fn().mockRejectedValue(new Error("DynamoDB error")),
    });

    await expect(deleteQuote("1")).rejects.toThrow("Could not delete quote with ID 1");
  });
});
