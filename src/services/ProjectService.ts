import dynamoDb from "../utils/dynamoDB";
import { Project } from "../models/Project";

const TableName = process.env.PROJECTS_TABLE as string;

// Create a new project
export const createProject = async (id: string, title: string): Promise<Project> => {
  try {
    const lastUpdated = new Date().toISOString();

    const newProject = new Project(id, title, lastUpdated);

    await dynamoDb
      .put({
        TableName,
        Item: newProject,
      })
      .promise();

    return newProject;
  } catch (error) {
    console.error("Error creating project:", error);
    throw new Error("Could not create project");
  }
};

// Get a project by ID
export const getProject = async (id: string): Promise<Project | null> => {
  try {
    const result = await dynamoDb.get({ TableName, Key: { id } }).promise();

    if (!result.Item) {
      return null;
    }

    // Convert stored ISO string dates back to Date objects
    const projectFromDb = result.Item as Project;

    return projectFromDb;
  } catch (error) {
    console.error("Error getting project:", error);
    throw new Error("Could not get project");
  }
};

// Update a project
export const updateProject = async (
  id: string,
  title: string
): Promise<Project> => {
  try {
    const lastUpdated = new Date().toISOString();

  
    const updatedProject = new Project(id, title, lastUpdated);

    await dynamoDb
      .put({
        TableName,
        Item: updatedProject,
      })
      .promise();

    return updatedProject;
  } catch (error) {
    console.error("Error updating project:", error);
    throw new Error("Could not update project");
  }
};

// Delete a project
export const deleteProject = async (id: string): Promise<void> => {
  try {
    await dynamoDb
      .delete({
        TableName,
        Key: { id },
      })
      .promise();
  } catch (error) {
    console.error(`Error deleting project with ID ${id}:`, error);
    throw new Error(`Could not delete project with ID ${id}`);
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
    throw new Error("Could not list projects");
  }
};
