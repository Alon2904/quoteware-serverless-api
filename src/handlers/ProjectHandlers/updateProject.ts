import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { getProject, updateProject } from "../../services/ProjectService";
import { DynamoDBError, MissingArgumentError, ProjectAlreadyExistsError, ValidationError } from "../../utils/errors";
import { HTTP_STATUS_CODES } from "../../utils/httpStatusCodes";
import { updateProjectSchema } from "../../validation/projectValidation";

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    let requestBody;
    try {
      requestBody = JSON.parse(event.body || '{}');
    } catch (error) {
      throw new ValidationError("Invalid JSON format in the request body");
    }
    
    const projectId = event.pathParameters?.projectId;
    console.log('projectId:', projectId);
    if (!projectId) {
      throw new MissingArgumentError("Project ID is required");
    }

    const { error } = updateProjectSchema.validate(requestBody);
    if (error) {
      throw new MissingArgumentError(error.details[0].message);
    }

    const { title, lastQuoteId } = requestBody;
   

    //check if project already exists
    const project = await getProject(projectId);
    if (!project) {
      throw new ValidationError("Project does not exist");
    } 

    const updatedProject = await updateProject(projectId, title, lastQuoteId);

    return {
      statusCode: HTTP_STATUS_CODES.OK,
      body: JSON.stringify(updatedProject.toItem()),
    };
  } catch (error) {
    console.error("Error in create project handler:", error);

    let errorMessage = "Internal Server Error";
    let statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;

    if (error instanceof ValidationError || error instanceof MissingArgumentError) {
      statusCode = error.statusCode;
      errorMessage = error.message;
    } else if (error instanceof DynamoDBError) {
      statusCode = error.statusCode;
      errorMessage = "Error creating project in database";
    }

    return {
      statusCode,
      body: JSON.stringify({ error: errorMessage }),
    };
  }
};