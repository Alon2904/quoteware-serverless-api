import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { deleteProject } from "../../services/ProjectService";
import { DynamoDBError, MissingArgumentError, ProjectNotFoundError } from "../../utils/errors";
import { HTTP_STATUS_CODES } from "../../utils/httpStatusCodes";

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const projectId = event.pathParameters?.projectId;
    console.log('projectId:', projectId);

    if (!projectId) {
      throw new MissingArgumentError("Project ID is required");
    }

    await deleteProject(projectId);

    return {
      statusCode: HTTP_STATUS_CODES.NO_CONTENT,
      body: '',
    };
  } catch (error) {
    console.error("Error in delete project handler:", error);

    let errorMessage = "Internal Server Error";
    let statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;

    if (error instanceof MissingArgumentError) {
      statusCode = HTTP_STATUS_CODES.BAD_REQUEST;
      errorMessage = error.message;
    } else if (error instanceof ProjectNotFoundError) {
      statusCode = HTTP_STATUS_CODES.NOT_FOUND;
      errorMessage = error.message;
    } else if (error instanceof DynamoDBError) {
      statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
      errorMessage = "Error deleting project from database";
    }

    return {
      statusCode,
      body: JSON.stringify({ error: errorMessage }),
    };
  }
};