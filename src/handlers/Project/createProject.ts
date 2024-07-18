import { APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { createProject } from "../../services/ProjectService";

export const handler: APIGatewayProxyHandler = async (event) => {
  const { author, hhjobid, title, templateVersion,itemsTableVersion, sections } = JSON.parse(event.body || '{}');

  try {
    const newQuote = await createQuote(author,hhjobid, title, templateVersion,itemsTableVersion, sections);
    return {
      statusCode: 201,
      body: JSON.stringify(newQuote),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: (error as Error).message }),
    } as APIGatewayProxyResult;
  }
};
