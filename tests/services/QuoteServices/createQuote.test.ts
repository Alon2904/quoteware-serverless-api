import dynamoDb from "../../../src/utils/dynamoDB";
import { v4 as uuidv4 } from "uuid";
import { Quote } from "../../../src/models/Quote";
import { Section } from "../../../src/models/Section";
import { createQuote } from "../../../src/services/QuoteService";
import { currentISODate } from "../../../src/utils/dateUtils";

// Mock UUID and Date generation
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mock-uuid')
}));

jest.mock('../../../src/utils/dateUtils', () => ({
  currentISODate: jest.fn(() => '2023-01-01T00:00:00.000Z')
}));

// Mock DynamoDB client
jest.mock("../../../src/utils/dynamoDB");

describe("createQuote", () => {
  const TableName = process.env.QUOTES_TABLE as string;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new quote successfully", async () => {
    const mockPut = dynamoDb.put as jest.Mock;
    mockPut.mockReturnValue({
      promise: jest.fn().mockResolvedValue({})
    });

    const author = "John Doe";
    const name = "Quote Name";
    const title = "Quote Title";
    const type = "project";
    const templateVersion = 1;
    const itemsTableVersion = 2;
    const createdBy = "creator-id";
    const sections: Section[] = [
      new Section("section-1", "John Doe", "project", "Section 1", "Title 1", "Content 1", 1),
      new Section("section-2", "John Doe", "project", "Section 2", "Title 2", "Content 2", 2)
    ];

    const expectedQuote: Quote = new Quote(
      "mock-uuid",
      author,
      name,
      title,
      type,
      templateVersion,
      itemsTableVersion,
      "2023-01-01T00:00:00.000Z",
      createdBy,
      sections
    );

    const result = await createQuote(author, name, title, type, templateVersion, itemsTableVersion, createdBy, sections);

    expect(result).toEqual(expectedQuote);
    expect(mockPut).toHaveBeenCalledWith({
      TableName,
      Item: expectedQuote,
    });
  });

  it("should throw an error if DynamoDB put fails", async () => {
    const mockPut = dynamoDb.put as jest.Mock;
    mockPut.mockReturnValue({
      promise: jest.fn().mockRejectedValue(new Error("DynamoDB error"))
    });

    const author = "John Doe";
    const name = "Quote Name";
    const title = "Quote Title";
    const type = "project";
    const templateVersion = 1;
    const itemsTableVersion = 2;
    const createdBy = "creator-id";
    const sections: Section[] = [
      new Section("section-1", "John Doe", "project", "Section 1", "Title 1", "Content 1", 1),
      new Section("section-2", "John Doe", "project", "Section 2", "Title 2", "Content 2", 2)
    ];

    await expect(createQuote(author, name, title, type, templateVersion, itemsTableVersion, createdBy, sections)).rejects.toThrow("Could not create quote");
  });
});
