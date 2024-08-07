import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { Quote } from "../../models/Quote";
import { deleteQuote, getQuote } from "../../services/QuoteService";
import { MissingArgumentError, QuoteNotFoundError, ValidationError } from "../../utils/errors";
import { HTTP_STATUS_CODES } from "../../utils/httpStatusCodes";

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const quoteId = event.pathParameters?.quoteId; // Assuming the quote ID is passed as a path parameter
    const projectId = event.pathParameters?.projectId; // Assuming the project ID is passed as a path parameter
    if (!quoteId) {
        throw new MissingArgumentError("Quote ID is required");
    } else if (!projectId) {
        throw new MissingArgumentError("Project ID is required");
    }

    const quote = await getQuote(quoteId);
    if (!quote) {
      throw new QuoteNotFoundError(`Quote with ID "${quoteId}" not found`);
    } else if (quote.projectId !== projectId) {
        throw new ValidationError(`Quote with ID "${quoteId}" does not belong to project with ID "${projectId}"`);
    }

    await deleteQuote(quoteId);

    return {
        statusCode: HTTP_STATUS_CODES.NO_CONTENT,
        body: JSON.stringify({ message: `Quote with ID "${quoteId}" deleted successfully` }),
    }
 


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
