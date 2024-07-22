import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult, Callback, Context } from "aws-lambda";
import { v4 as uuidv4 } from "uuid";
import { Section } from "../../models/Section";
import { createQuote, updateQuote } from "../../services/QuoteService";

// src/handlers/createQuoteWithSections.ts



export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback<APIGatewayProxyResult>
): Promise<APIGatewayProxyResult> => {
  try {
    const requestBody = JSON.parse(event.body || '{}');

    const {
      author,
      name,
      title,
      type,
      templateVersion,
      itemsTableVersion,
      createdBy,
      sections,
    } = requestBody;

    const newQuote = await createQuote(
      author,
      name,
      title,
      type,
      templateVersion,
      itemsTableVersion,
      createdBy,
      sections
    );

    const response: APIGatewayProxyResult = {
      statusCode: 201,
      body: JSON.stringify(newQuote),
    };

    callback(null, response);
    return response;
  } catch (error) {
    const errorMessage = getErrorMessage(error);

    const response: APIGatewayProxyResult = {
      statusCode: 500,
      body: JSON.stringify({ error: errorMessage }),
    };

    callback(null, response);
    return response;
  }
};
