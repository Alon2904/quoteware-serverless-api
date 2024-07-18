import dynamoDb from "../../../src/utils/dynamoDB";
import { QuoteInProject } from "../../../src/models/Quote";
import { updateQuoteIn } from "../../../src/services/QuoteService";

// Mock DynamoDB client
jest.mock("../../../src/utils/dynamoDB");

describe("updateQuote", () => {
  const mockDate = new Date();

  beforeAll(() => {
    // Mock Date globally
    jest.spyOn(global, "Date").mockImplementation(() => mockDate);
  });

  afterAll(() => {
    // Restore original Date
    jest.restoreAllMocks();
  });

  it("should update a quote successfully", async () => {
    const mockGet = dynamoDb.get as jest.Mock;
    const mockPut = dynamoDb.put as jest.Mock;

    const existingQuote: QuoteInProject = {
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

    mockPut.mockReturnValue({
      promise: jest.fn().mockResolvedValue({}),
    });

    const updatedQuote = await updateQuote("1", "Updated Title", 2, 3, [{sectionName: "this is section name",  title: "Updated Section", content: "Updated content", sectionLocation: 0 }], "Jane Doe");

    expect(updatedQuote).toEqual({
      ...existingQuote,
      title: "Updated Title",
      templateVersion: 2,
      itemsTableVersion: 3,
      lastUpdated: mockDate,
      sections: [{ sectionName: "this is section name", title: "Updated Section", content: "Updated content", sectionLocation: 0 }],
      editedBy: "Jane Doe",
    });

    expect(mockPut).toHaveBeenCalledWith({
      TableName: process.env.QUOTES_TABLE,
      Item: {
        ...updatedQuote,
        createdAt: existingQuote.createdAt.toISOString(),
        lastUpdated: mockDate.toISOString(),
      },
    });
  });

  it("should throw an error if the quote does not exist", async () => {
    const mockGet = dynamoDb.get as jest.Mock;
    mockGet.mockReturnValue({
      promise: jest.fn().mockResolvedValue({}),
    });

    await expect(updateQuote("5", "Updated Title", 2, 3, [{sectionName: "this is section name",  title: "Updated Section", content: "Updated content", sectionLocation: 0 }], "Jane Doe")).rejects.toThrow("QuoteInProject with ID 5 not found");
  });

  it("should throw an error if DynamoDB update fails", async () => {
    const mockGet = dynamoDb.get as jest.Mock;
    const mockPut = dynamoDb.put as jest.Mock;

    const existingQuote: QuoteInProject = {
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

    mockPut.mockReturnValue({
      promise: jest.fn().mockRejectedValue(new Error("DynamoDB error")),
    });

    await expect(updateQuote("1", "Updated Title", 2, 3, [{sectionName: "this is section name",  title: "Updated Section", content: "Updated content", sectionLocation: 1 }], "Jane Doe")).rejects.toThrow("Could not update quote with ID 1");
  });
});
