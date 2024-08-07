import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { v4 as uuidv4 } from "uuid";
import { Section } from "../../models/Section";
import { createQuote } from "../../services/QuoteService";
import { currentISODate } from "../../utils/dateUtils";
import { MissingArgumentError, ValidationError } from "../../utils/errors";
import { HTTP_STATUS_CODES } from "../../utils/httpStatusCodes";
import { createProjectQuoteSchema } from "../../validation/quoteValidation";

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const requestBody = JSON.parse(event.body || '{}');

    const projectId = event.pathParameters?.projectId;

    const { error } = createProjectQuoteSchema.validate({...requestBody, projectId});
    if (error) {
        throw new MissingArgumentError(error.details[0].message);
    }

    const { author, name, title, type, templateVersion, itemsTableVersion, createdBy, sections } = requestBody;

    const sectionInstances = sections.map((section: any) => {
      return new Section(
        uuidv4(),
        section.author,
        section.type,
        section.name,
        section.title,
        section.content,
        section.index,
        section.edited_at || currentISODate()
      );
    });

    const newQuote = await createQuote(
      author,
      name,
      title,
      type,
      templateVersion,
      itemsTableVersion,
      createdBy,
      sectionInstances,
      projectId
    );

    return {
      statusCode: HTTP_STATUS_CODES.CREATED,
      body: JSON.stringify(newQuote.toItem()),
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

