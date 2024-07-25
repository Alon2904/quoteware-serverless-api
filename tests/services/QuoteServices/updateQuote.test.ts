import dynamoDb from "../../../src/utils/dynamoDB";
import { Quote } from "../../../src/models/Quote";
import { Section } from "../../../src/models/Section";
import { getQuote, updateQuote } from "../../../src/services/QuoteService";
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

describe("updateQuote", () => {
  const TableName = process.env.QUOTES_TABLE as string;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update a quote", async () => {
    const quoteId = "1";
    const mockQuote = new Quote(
      quoteId,
      "John Doe",
      "Sample Quote",
      "Sample Title",
      "project",
      1,
      2,
      "2023-01-01T00:00:00.000Z",
      "John Doe",
      []
    );

    const updatedSections = [
      new Section(
        "section-1",
        "John Doe",
        "project",
        "Section Name 1",
        "Section Title 1",
        "Section Content 1",
        1,
        "2023-01-01T00:00:00.000Z"
      )
    ];

    const updatedQuote = new Quote(
      quoteId,
      "John Doe",
      "Updated Quote Name",
      "Updated Quote Title",
      "project",
      2,
      3,
      "2023-01-01T00:00:00.000Z",
      "John Doe",
      updatedSections,
      "Jane Doe",
      "2023-01-01T00:00:00.000Z"
    );

    const mockGet = dynamoDb.get as jest.Mock;
    mockGet.mockReturnValue({
      promise: jest.fn().mockResolvedValue({ Item: mockQuote }),
    });

    const mockPut = dynamoDb.put as jest.Mock;
    mockPut.mockReturnValue({
      promise: jest.fn().mockResolvedValue({}),
    });

    const result = await updateQuote(updatedQuote);

    expect(result).toEqual(updatedQuote);

    expect(mockPut).toHaveBeenCalledWith({
      TableName,
      Item: updatedQuote.toItem(),
    });
  });

  it("should throw an error if the quote does not exist", async () => {
    const quoteId = "2";

    const updatedQuote = new Quote(
      quoteId,
      "John Doe",
      "Updated Quote Name",
      "Updated Quote Title",
      "project",
      2,
      3,
      "2023-01-01T00:00:00.000Z",
      "John Doe",
      [],
      "Jane Doe",
      "2023-01-01T00:00:00.000Z"
    );

    const mockGet = dynamoDb.get as jest.Mock;
    mockGet.mockReturnValue({
      promise: jest.fn().mockResolvedValue({}),
    });

    await expect(updateQuote(updatedQuote)).rejects.toThrow(`Quote with ID ${quoteId} not found`);
  });

  it("should throw an error if DynamoDB put fails", async () => {
    const quoteId = "1";
    const mockQuote = new Quote(
      quoteId,
      "John Doe",
      "Sample Quote",
      "Sample Title",
      "project",
      1,
      2,
      "2023-01-01T00:00:00.000Z",
      "John Doe",
      []
    );

    const updatedSections = [
      new Section(
        "section-1",
        "John Doe",
        "project",
        "Section Name 1",
        "Section Title 1",
        "Section Content 1",
        1,
        "2023-01-01T00:00:00.000Z"
      )
    ];

    const updatedQuote = new Quote(
      quoteId,
      "John Doe",
      "Updated Quote Name",
      "Updated Quote Title",
      "project",
      2,
      3,
      "2023-01-01T00:00:00.000Z",
      "John Doe",
      updatedSections,
      "Jane Doe",
      "2023-01-01T00:00:00.000Z"
    );

    const mockGet = dynamoDb.get as jest.Mock;
    mockGet.mockReturnValue({
      promise: jest.fn().mockResolvedValue({ Item: mockQuote }),
    });

    const mockPut = dynamoDb.put as jest.Mock;
    mockPut.mockReturnValue({
      promise: jest.fn().mockRejectedValue(new Error("DynamoDB error")),
    });

    await expect(updateQuote(updatedQuote)).rejects.toThrow(`Could not update quote with ID ${quoteId}`);
  });
});
