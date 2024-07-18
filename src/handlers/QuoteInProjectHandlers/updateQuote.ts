import { APIGatewayProxyHandler } from "aws-lambda";
import { updateQuoteInProject } from "../../services/QuoteService";
import { getErrorMessage } from "../../utils/errorUtils";

export const handler: APIGatewayProxyHandler = async (event) => {
    const {id} = event.pathParameters || {};
    const { title, templateVersion,itemsTableVersion, sections, editedBy } = JSON.parse(event.body || '{}');

    if (!id) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Quote ID is required" }),
        };
    }

    try {
        const updatedQuote = await updateQuoteInProject(id, title, templateVersion,itemsTableVersion, sections, editedBy);
        return {
            statusCode: 200,
            body: JSON.stringify(updatedQuote),
        };
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: errorMessage }),
        };
    }
};