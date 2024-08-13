import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { createProject, getProject } from "../../services/ProjectService";
import { DynamoDBError, MissingArgumentError, ProjectAlreadyExistsError, ValidationError } from "../../utils/errors";
import { HTTP_STATUS_CODES } from "../../utils/httpStatusCodes";
import { createProjectSchema } from "../../validation/projectValidation";

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

    const { error } = createProjectSchema.validate(requestBody);
    if (error) {
      throw new MissingArgumentError(error.details[0].message);
    }

    const { projectId, title } = requestBody;

    //check if project already exists
    const existingProject = await getProject(projectId);
    if (existingProject) {
      throw new ProjectAlreadyExistsError("Project with the given ID already exists");
    } 

    const newProject = await createProject(projectId, title);

    return {
      statusCode: HTTP_STATUS_CODES.CREATED,
      body: JSON.stringify(newProject.toItem()),
    };
  } catch (error) {
    console.error("Error in create project handler:", error);

    let errorMessage = "Internal Server Error";
    let statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;

    if (error instanceof ValidationError || error instanceof MissingArgumentError || error instanceof ProjectAlreadyExistsError) {
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