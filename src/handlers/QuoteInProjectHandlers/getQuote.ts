import { APIGatewayProxyHandler } from "aws-lambda";
import { getQuoteById } from "../../services/QuoteService";
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
        const retrivedQuote = await getQuoteById(id); 
        return {
            statusCode: 200,
            body: JSON.stringify(retrivedQuote),
        };
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: errorMessage }),
        };
    }
};