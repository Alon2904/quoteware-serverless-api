import * as QuoteService from "../../src/services/QuoteService";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Callback, Context } from "aws-lambda";
import { v4 as uuidv4 } from "uuid";
import { handler } from "../../src/handlers/QuoteHandlers/createQuoteWithSections";
import { Section } from "../../src/models/Section";

// Mock UUID generation
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mock-uuid'),
}));

// Mock the createQuote and updateQuote functions from QuoteService
jest.mock('../../services/QuoteService');

describe('createQuoteWithSections Handler', () => {
  const mockContext: Context = {} as Context;
  const mockCallback: Callback<APIGatewayProxyResult> = jest.fn();

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
        { name: 'Section 1', title: 'Section Title 1', content: 'Content 1', index: 1 },
        { name: 'Section 2', title: 'Section Title 2', content: 'Content 2', index: 2 },
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
      created_at: '2023-01-01T00:00:00.000Z',
      created_by: 'creator-id',
      sections: requestBody.sections.map((section, index) => new Section(
        `mock-uuid-${index}`,
        requestBody.author,
        requestBody.type,
        section.name,
        section.title,
        section.content,
        section.index
      )),
    };

    (QuoteService.createQuote as jest.Mock).mockResolvedValue(mockQuote);

    const result: APIGatewayProxyResult = await handler(mockEvent(requestBody), mockContext, mockCallback);

    expect(result.statusCode).toBe(201);
    const responseBody = JSON.parse(result.body);
    expect(responseBody.quote_id).toBe('mock-uuid');
    expect(responseBody.sections).toHaveLength(2);
    expect(QuoteService.createQuote).toHaveBeenCalledTimes(1);
    expect(QuoteService.createQuote).toHaveBeenCalledWith(
      requestBody.author,
      requestBody.name,
      requestBody.title,
      requestBody.type,
      requestBody.templateVersion,
      requestBody.itemsTableVersion,
      requestBody.createdBy,
      expect.any(Array), // sections
      undefined // projectId
    );
  });

  it('should return 500 if an error occurs', async () => {
    const requestBody = {
      author: 'John Doe',
      name: 'Quote Name',
      title: 'Quote Title',
      type: 'project',
      templateVersion: 1,
      itemsTableVersion: 2,
      createdBy: 'creator-id',
      sections: [
        { name: 'Section 1', title: 'Section Title 1', content: 'Content 1', index: 1 },
        { name: 'Section 2', title: 'Section Title 2', content: 'Content 2', index: 2 },
      ],
    };

    (QuoteService.createQuote as jest.Mock).mockRejectedValue(new Error('Creation failed'));

    const result: APIGatewayProxyResult = await handler(mockEvent(requestBody), mockContext, mockCallback);

    expect(result.statusCode).toBe(500);
    const responseBody = JSON.parse(result.body);
    expect(responseBody.error).toBe('Creation failed');
  });
});
