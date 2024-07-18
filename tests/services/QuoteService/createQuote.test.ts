import dynamoDb from "../../../src/utils/dynamoDB";
import { v4 as uuidv4 } from "uuid";
import { QuoteInProject } from "../../../src/models/Quote";
import { createQuote } from "../../../src/services/QuoteService";

// Mock UUID generation
jest.mock("uuid", () => ({
  v4: jest.fn(() => "mock-uuid"),
}));

// Mock DynamoDB client
jest.mock("../../../src/utils/dynamoDB");

describe("createQuote", () => {
  const mockDate = new Date();

  beforeAll(() => {
    // Mock Date globally
    jest.spyOn(global, "Date").mockImplementation(() => mockDate);
  });

  afterAll(() => {
    // Restore original Date
    jest.restoreAllMocks();
  });

  it("should create a new quote successfully", async () => {
    const mockPut = dynamoDb.put as jest.Mock;
    mockPut.mockReturnValue({
      promise: jest.fn().mockResolvedValue({}),
    });

    const author = "John Doe";
    const projectId = "1";
    const title = "Sample Quote";
    const templateVersion = 1;
    const itemsTableVersion = 3;
    const sections = [{ sectionName: "this is section name", title: "Introduction", content: "This is the introduction.", sectionLocation: 0 }];

    const expectedQuote: QuoteInProject = {
      id: "mock-uuid",
      author,
      projectId,
      title,
      templateVersion,
      itemsTableVersion,
      createdAt: mockDate,
      lastUpdated: mockDate,
      sections: [{ sectionName: "this is section name", title: "Introduction", content: "This is the introduction.", sectionLocation: 0 }],
      editedBy: undefined,
    };

    const result = await createQuote(author,projectId, title, templateVersion, itemsTableVersion, sections);

    expect(result).toEqual(expectedQuote);
    expect(mockPut).toHaveBeenCalledWith({
      TableName: process.env.QUOTES_TABLE,
      Item: {
        ...expectedQuote,
        createdAt: mockDate.toISOString(),
        lastUpdated: mockDate.toISOString(),
      },
    });
  });

  it("should throw an error if DynamoDB put fails", async () => {
    const mockPut = dynamoDb.put as jest.Mock;
    mockPut.mockReturnValue({
      promise: jest.fn().mockRejectedValue(new Error("DynamoDB error")),
    });

    const author = "John Doe";
    const projectId = "1";
    const title = "Sample Quote";
    const templateVersion = 1;
    const itemsTableVersion = 3;
    const sections = [{ sectionName: "this is section name", title: "Introduction", content: "This is the introduction." , sectionLocation: 0 }];

    await expect(createQuote(author,projectId, title, templateVersion, itemsTableVersion, sections)).rejects.toThrow("Could not create quote");
  });
});


