import { APIGatewayProxyHandler } from "aws-lambda";
import { deleteQuote } from "../../services/QuoteService";
import { getErrorMessage } from "../../utils/errorUtils";

export const handler: APIGatewayProxyHandler = async (event) => {
    const {id} = event.pathParameters || {};

    if (!id) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Quote ID is required" }),
        };
    }

    try {
        const deletedQuote = await deleteQuote(id);
        return {
            statusCode: 200,
            body: JSON.stringify(deletedQuote),
        };
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: errorMessage }),
        };
    }
};