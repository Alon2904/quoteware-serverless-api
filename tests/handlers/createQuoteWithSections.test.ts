import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { handler } from "../../src/handlers/QuoteHandlers/createQuoteWithSections";
import { createQuote } from "../../src/services/QuoteService";
import { HTTP_STATUS_CODES } from "../../src/utils/httpStatusCodes";

// Mock the createQuote function from QuoteService
jest.mock('../../src/services/QuoteService');

describe('createQuoteWithSections Handler', () => {
  const mockEvent = (body: any): APIGatewayProxyEvent => ({
    body: JSON.stringify(body),
    headers: {},
    multiValueHeaders: {},
    httpMethod: 'POST',
    isBase64Encoded: false,
    path: '',
    pathParameters: null,
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    stageVariables: null,
    requestContext: {} as any,
    resource: '',
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new quote with sections successfully', async () => {
    const requestBody = {
      author: 'John Doe',
      name: 'Quote Name',
      title: 'Quote Title',
      type: 'project',
      templateVersion: 1,
      itemsTableVersion: 2,
      createdBy: 'creator-id',
      sections: [
        {
          id: "section-id-1",
          author: "John Doe",
          type: "project",
          name: "Section 1",
          title: "Section Title 1",
          content: "Content 1",
          index: 1,
          created_at: "1",
          edited_at: "1",
        },
        {
          id: "section-id-2",
          author: "John Doe",
          type: "project",
          name: "Section 2",
          title: "Section Title 2",
          content: "Content 2",
          index: 2,
          created_at: "1",
          edited_at: "1",
        },
      ],
    };

    const mockQuote = {
      quote_id: 'mock-uuid',
      author: 'John Doe',
      name: 'Quote Name',
      title: 'Quote Title',
      type: 'project',
      templateVersion: 1,
      itemsTableVersion: 2,
      created_at: expect.any(String),
      created_by: 'creator-id',
      sections: requestBody.sections.map((section) => ({
        ...section,
        created_at: expect.any(String),
        edited_at: expect.any(String),
        quote_id: undefined,
      })),
    };

    (createQuote as jest.Mock).mockResolvedValue(mockQuote);

    const result: APIGatewayProxyResult = await handler(mockEvent(requestBody));

    expect(result.statusCode).toBe(HTTP_STATUS_CODES.CREATED);
    const responseBody = JSON.parse(result.body);
    expect(responseBody.quote_id).toBe('mock-uuid');
    expect(responseBody.sections).toHaveLength(2);
    expect(createQuote).toHaveBeenCalledTimes(1);

    expect(createQuote).toHaveBeenCalledWith(
      "John Doe",
      "Quote Name",
      "Quote Title",
      "project",
      1,
      2,
      "creator-id",
      [
        {
          author: "John Doe",
          content: "Content 1",
          created_at: expect.any(String),
          edited_at: expect.any(String),
          id: "section-id-1",
          index: 1,
          name: "Section 1",
          quote_id: undefined,
          title: "Section Title 1",
          type: "project",
        },
        {
          author: "John Doe",
          content: "Content 2",
          created_at: expect.any(String),
          edited_at: expect.any(String),
          id: "section-id-2",
          index: 2,
          name: "Section 2",
          quote_id: undefined,
          title: "Section Title 2",
          type: "project",
        },
      ]
    );
  });

  it('should return 400 if the validation fails', async () => {
    const requestBody = {
      author: 'John Doe',
      // name is missing to trigger validation error
      title: 'Quote Title',
      type: 'project',
      templateVersion: 1,
      itemsTableVersion: 2,
      createdBy: 'creator-id',
      sections: [
        { id: 'section-id-1', author: 'John Doe', type: 'project', name: 'Section 1', title: 'Section Title 1', content: 'Content 1', index: 1, created_at: '2023-01-01T00:00:00.000Z', edited_at: '2023-01-01T00:00:00.000Z' },
        { id: 'section-id-2', author: 'John Doe', type: 'project', name: 'Section 2', title: 'Section Title 2', content: 'Content 2', index: 2, created_at: '2023-01-01T00:00:00.000Z', edited_at: '2023-01-01T00:00:00.000Z' },
      ],
    };

    const result: APIGatewayProxyResult = await handler(mockEvent(requestBody));

    expect(result.statusCode).toBe(HTTP_STATUS_CODES.BAD_REQUEST);
    const responseBody = JSON.parse(result.body);
    expect(responseBody.error).toBe('"name" is required');
    expect(createQuote).not.toHaveBeenCalled();
  });

  it('should return 500 if an internal error occurs', async () => {
    const requestBody = {
      author: 'John Doe',
      name: 'Quote Name',
      title: 'Quote Title',
      type: 'project',
      templateVersion: 1,
      itemsTableVersion: 2,
      createdBy: 'creator-id',
      sections: [
        { id: 'section-id-1', author: 'John Doe', type: 'project', name: 'Section 1', title: 'Section Title 1', content: 'Content 1', index: 1, created_at: '2023-01-01T00:00:00.000Z', edited_at: '2023-01-01T00:00:00.000Z' },
        { id: 'section-id-2', author: 'John Doe', type: 'project', name: 'Section 2', title: 'Section Title 2', content: 'Content 2', index: 2, created_at: '2023-01-01T00:00:00.000Z', edited_at: '2023-01-01T00:00:00.000Z' },
      ],
    };

    (createQuote as jest.Mock).mockRejectedValue(new Error('Internal Server Error'));

    const result: APIGatewayProxyResult = await handler(mockEvent(requestBody));

    expect(result.statusCode).toBe(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
    const responseBody = JSON.parse(result.body);
    expect(responseBody.error).toBe('Internal Server Error');
    expect(createQuote).toHaveBeenCalledTimes(1);
  });
});
