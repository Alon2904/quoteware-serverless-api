import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { v4 as uuidv4 } from "uuid";
import { Quote } from "../../models/Quote";
import { Section } from "../../models/Section";
import { getTemplateQuote, updateTemplateQuote } from "../../services/QuoteService";
import { currentISODate } from "../../utils/dateUtils";
import { MissingArgumentError, QuoteNotFoundError, ValidationError } from "../../utils/errors";
import { HTTP_STATUS_CODES } from "../../utils/httpStatusCodes";
import { updateTemplateQuoteSchema } from "../../validation/quoteValidation";

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const quoteId = event.pathParameters?.quoteId; // Assuming the quote ID is passed as a path parameter
    if (!quoteId) {
        throw new MissingArgumentError("Quote ID is required"); 
    }

    const quote = await getTemplateQuote(quoteId);

    if(!quote) {
        throw new QuoteNotFoundError(`Quote with ID "${quoteId}" not found`);
    }


    const requestBody = JSON.parse(event.body || '{}');

    console.log('before validation');

    const { error } = updateTemplateQuoteSchema.validate(requestBody); // You should define updateTemplateQuoteSchema
    if (error) {
        throw new ValidationError(error.details[0].message);
    }

    console.log('passed validation');

    const updatedAt = currentISODate();

    //create section objects array
    const sectionInstances = requestBody.sections.map((section: any) => {
      return new Section(
        section.id || uuidv4(),
        section.author,
        section.type,
        section.name,
        section.title,
        section.content,
        section.index,
        section.updatedAt || currentISODate()
      );
    });
   

    // Create a Quote object from the request body
    const updatedQuote = new Quote(
      quoteId,
      quote.author,
      requestBody.name,
      requestBody.title,
      quote.type,
      requestBody.templateVersion,
      requestBody.itemsTableVersion,
      requestBody.itemsTableIndex,
      quote.createdAt,
      quote.createdBy,
      sectionInstances,
      requestBody.updatedBy,
      updatedAt,
      requestBody.projectId
    );

    console.log('after creating the new quote object');
    const result = await updateTemplateQuote(updatedQuote);
    console.log('typeof result', typeof result);

    return {
      statusCode: HTTP_STATUS_CODES.OK,
      body: JSON.stringify(result.toItem()),
    };
  } catch (error) {
    const errorMessage = (error as Error).message || "Internal Server Error";
    const statusCode = error instanceof ValidationError
      ? HTTP_STATUS_CODES.BAD_REQUEST
      : HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;

    return {
      statusCode,
      body: JSON.stringify({ error: errorMessage }),
    };
  }
};
