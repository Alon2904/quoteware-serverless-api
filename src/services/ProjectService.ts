import dynamoDb from "../utils/dynamoDB";
import { Project } from "../models/Project";
import { currentISODate } from "../utils/dateUtils";
import { DynamoDBError, ProjectNotFoundError } from "../utils/errors";

const TableName = process.env.PROJECTS_TABLE as string;

// Create a new project
//creating project with no lastQuoteId as it will be added once a quote will be saved.
export const createProject = async (projectId: string, title: string): Promise<Project> => {
  try {
    const newProject = new Project(projectId, title);



    await dynamoDb
      .put({
        TableName,
        Item: newProject.toItem(),
      })
      .promise();

    return newProject;
  } catch (error) {
    console.error("Error creating project:", error);
    throw new DynamoDBError("Could not create project");
  }
};

// Get a project by ID
export const getProject = async (projectId: string): Promise<Project | null> => {
  try {
    const result = await dynamoDb.get({ TableName, Key: { projectId } }).promise();

    if (!result.Item) {
      return null;
    }

    // Convert stored ISO string dates back to Date objects
    const projectFromDb = result.Item as Project;

    return projectFromDb;
  } catch (error) {
    console.error("Error getting project:", error);
    throw new DynamoDBError("Could not get project");
  }
};

// Update a project
// Update a project
export const updateProject = async (
  projectId: string,
  title: string,
  lastQuoteId?: string
): Promise<Project> => {
  try {
    const lastUpdated = currentISODate();

    const existingProject = await getProject(projectId);
    if (!existingProject) {
      throw new ProjectNotFoundError(`Project with ID ${projectId} not found`);
    }

    const updatedProject = new Project(projectId, title, lastQuoteId, lastUpdated);

    await dynamoDb
      .put({
        TableName,
        Item: updatedProject.toItem(),
      })
      .promise();

    return updatedProject;
  } catch (error) {
    console.error("Error updating project:", error);
    if (error instanceof ProjectNotFoundError) {
      throw error;
    }
    throw new DynamoDBError(`Could not update project with ID ${projectId}`);
  }
};


// Delete a project
export const deleteProject = async (projectId: string): Promise<void> => {
  try {

    // Check if the project exists
    const existingProject = await getProject(projectId);
    if (!existingProject) {
      throw new ProjectNotFoundError(`Project with ID ${projectId} not found`);
    }


    await dynamoDb
      .delete({
        TableName,
        Key: { projectId },
      })
      .promise();
  } catch (error) {

    if( error instanceof ProjectNotFoundError){
      throw error;
    }
    console.error(`Error deleting project with ID ${projectId}:`, error);
    throw new DynamoDBError(`Could not delete project with ID ${projectId}`);
  }
};

// List all projects
export const listProjects = async (): Promise<Project[]> => {
  try {
    const result = await dynamoDb.scan({ TableName }).promise();
    const projectsFromDb = result.Items as Project[];

    return projectsFromDb;
  } catch (error) {
    console.error("Error listing projects:", error);
    throw new DynamoDBError("Could not list projects");
  }
};
