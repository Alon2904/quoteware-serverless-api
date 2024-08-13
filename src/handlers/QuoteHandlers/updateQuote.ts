// import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
// import { v4 as uuidv4 } from "uuid";
// import { Quote } from "../../models/Quote";
// import { Section } from "../../models/Section";
// import { updateQuote } from "../../services/QuoteService";
// import { currentISODate } from "../../utils/dateUtils";
// import { QuoteNotFoundError, ValidationError } from "../../utils/errors";
// import { HTTP_STATUS_CODES } from "../../utils/httpStatusCodes";
// import { updateQuoteSchema } from "../../validation/quoteValidation";

// export const handler: APIGatewayProxyHandler = async (
//   event: APIGatewayProxyEvent
// ): Promise<APIGatewayProxyResult> => {
//   try {
//     const quoteId = event.pathParameters?.quoted; // Assuming the quote ID is passed as a path parameter
//     if (!quoteId) {
//       return {
//         statusCode: HTTP_STATUS_CODES.BAD_REQUEST,
//         body: JSON.stringify({ error: 'Quote ID is required' }),
//       };
//     }

//     const requestBody = JSON.parse(event.body || '{}');

//     console.log('before validation');

//     const { error } = updateQuoteSchema.validate(requestBody); // You should define updateQuoteSchema
//     if (error) {
//       return {
//         statusCode: HTTP_STATUS_CODES.BAD_REQUEST,
//         body: JSON.stringify({ error: error.details[0].message }),
//       };
//     }

//     console.log('passed validation');

//     const updatedAt = currentISODate();

//     //create section objects array
//     const sectionInstances = requestBody.sections.map((section: any) => {
//       return new Section(
//         section.id || uuidv4(),
//         section.author,
//         section.type,
//         section.name,
//         section.title,
//         section.content,
//         section.index,
//         section.edited_at || currentISODate()
//       );
//     });
   

//     // Create a Quote object from the request body
//     const updatedQuote = new Quote(
//       quoteId,
//       requestBody.author,
//       requestBody.name,
//       requestBody.title,
//       requestBody.type,
//       requestBody.templateVersion,
//       requestBody.itemsTableVersion,
//       requestBody.created_at,
//       requestBody.created_by,
//       sectionInstances,
//       requestBody.updated_by,
//       updatedAt,
//       requestBody.project_id
//     );

//     console.log('after creating the new quote object');
//     const result = await updateQuote(updatedQuote);
//     console.log('typeof result', typeof result);

//     return {
//       statusCode: HTTP_STATUS_CODES.OK,
//       body: JSON.stringify(result.toItem()),
//     };
//   } catch (error) {
//     const errorMessage = (error as Error).message || "Internal Server Error";
//     const statusCode = error instanceof ValidationError
//       ? HTTP_STATUS_CODES.BAD_REQUEST
//       : HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;

//     return {
//       statusCode,
//       body: JSON.stringify({ error: errorMessage }),
//     };
//   }
// };
