import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { Quote } from "../../models/Quote";
import { listProjectQuotesByProject } from "../../services/QuoteService";
import { MissingArgumentError, QuoteNotFoundError, ValidationError } from "../../utils/errors";
import { HTTP_STATUS_CODES } from "../../utils/httpStatusCodes";

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const projectId = event.pathParameters?.projectId; // Assuming the project ID is passed as a path parameter
   if (!projectId) {
        throw new MissingArgumentError("Project ID is required");
    }

    const quotes: Quote[]  = await listProjectQuotesByProject(projectId);
    if (!quotes) {
      throw new QuoteNotFoundError(`No Quotes found for project with ID "${projectId}"`);
    }

    const quotesList = quotes.map(quote => quote.toItem());
    //sort by date
    quotesList.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return {
      statusCode: HTTP_STATUS_CODES.OK,
      body: JSON.stringify(quotesList),
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
