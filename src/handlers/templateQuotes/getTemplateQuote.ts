import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { Quote } from "../../models/Quote";
import { getTemplateQuote } from "../../services/QuoteService";
import { MissingArgumentError, QuoteNotFoundError, ValidationError } from "../../utils/errors";
import { HTTP_STATUS_CODES } from "../../utils/httpStatusCodes";

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const quoteId = event.pathParameters?.quoteId; // Assuming the quote ID is passed as a path parameter
    if (!quoteId) {
        throw new MissingArgumentError("Quote ID is required");
    }   
    const quote = await getTemplateQuote(quoteId);
    if (!quote) {
      throw new QuoteNotFoundError(`Quote with ID "${quoteId}" not found`);
    }

    console.log('quote:', quote);
    console.log('typeof quote:', typeof quote);

    return {
      statusCode: HTTP_STATUS_CODES.OK,
      body: JSON.stringify(quote.toItem()),
    };

  } catch (error) {
    const err = error as Error & { statusCode?: number };
    const statusCode = err.statusCode || HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
    const errorMessage = err.message || "Internal Server Error";

    return {
      statusCode,
      body: JSON.stringify({ error: errorMessage }),
    };
  }
};
