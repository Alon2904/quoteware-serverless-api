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
        1
      )
    ];

    const mockGet = dynamoDb.get as jest.Mock;
    mockGet.mockReturnValue({
      promise: jest.fn().mockResolvedValue({ Item: mockQuote }),
    });

    const mockPut = dynamoDb.put as jest.Mock;
    mockPut.mockReturnValue({
      promise: jest.fn().mockResolvedValue({}),
    });

    const result = await updateQuote(
      quoteId,
      "Updated Quote Name",
      "Updated Quote Title",
      2,
      3,
      updatedSections,
      "Jane Doe"
    );

    expect(result).toEqual(expect.objectContaining({
      name: "Updated Quote Name",
      title: "Updated Quote Title",
      templateVersion: 2,
      itemsTableVersion: 3,
      sections: updatedSections,
      updated_by: "Jane Doe",
      updated_at: "2023-01-01T00:00:00.000Z"
    }));

    expect(mockPut).toHaveBeenCalledWith({
      TableName,
      Item: result,
    });
  });

  it("should throw an error if the quote does not exist", async () => {
    const quoteId = "2";

    const mockGet = dynamoDb.get as jest.Mock;
    mockGet.mockReturnValue({
      promise: jest.fn().mockResolvedValue({}),
    });

    await expect(updateQuote(
      quoteId,
      "Updated Quote Name",
      "Updated Quote Title",
      2,
      3,
      [],
      "Jane Doe"
    )).rejects.toThrow(`Quote with ID ${quoteId} not found`);
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
        1
      )
    ];

    const mockGet = dynamoDb.get as jest.Mock;
    mockGet.mockReturnValue({
      promise: jest.fn().mockResolvedValue({ Item: mockQuote }),
    });

    const mockPut = dynamoDb.put as jest.Mock;
    mockPut.mockReturnValue({
      promise: jest.fn().mockRejectedValue(new Error("DynamoDB error")),
    });

    await expect(updateQuote(
      quoteId,
      "Updated Quote Name",
      "Updated Quote Title",
      2,
      3,
      updatedSections,
      "Jane Doe"
    )).rejects.toThrow(`Could not update quote with ID ${quoteId}`);
  });



});
