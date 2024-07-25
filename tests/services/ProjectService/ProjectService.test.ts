import dynamoDb from "../../../src/utils/dynamoDB";
import { Project } from "../../../src/models/Project";
import { currentISODate } from "../../../src/utils/dateUtils";
import { DynamoDBError, ProjectNotFoundError } from "../../../src/utils/errors";

import {
  createProject,
  getProject,
  updateProject,
  deleteProject,
  listProjects,
} from "../../../src/services/ProjectService";

jest.mock("../../../src/utils/dynamoDB");



describe("createProject", () => {
  const TableName = process.env.PROJECTS_TABLE as string;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new project", async () => {
    const projectId = "1";
    const projectTitle = "Sample Project";
    const newProject = new Project(projectId, projectTitle);

    const mockPut = dynamoDb.put as jest.Mock;
    mockPut.mockReturnValue({
      promise: jest.fn().mockResolvedValue({}),
    });

    const result = await createProject(projectId, projectTitle);

    expect(result).toMatchObject({
      "_id": newProject["_id"],
      "_title": newProject["_title"],
      "_lastUpdated": expect.any(String),
    });
    expect(mockPut).toHaveBeenCalledWith({
      TableName,
      Item: newProject,
    });
  });

  it("should throw an error if project creation fails", async () => {
    const projectId = "1";
    const projectTitle = "Sample Project";

    const mockPut = dynamoDb.put as jest.Mock;
    mockPut.mockReturnValue({
      promise: jest.fn().mockRejectedValue(new Error("DynamoDB error")),
    });

    await expect(createProject(projectId, projectTitle)).rejects.toThrow(
      "Could not create project"
    );
  });
});

describe("getProject", () => {
  const TableName = process.env.PROJECTS_TABLE as string;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should get a project by ID", async () => {
    const projectId = "1";
    const projectTitle = "Sample Project";
    const projectFromDb = new Project(projectId, projectTitle);

    const mockGet = dynamoDb.get as jest.Mock;
    mockGet.mockReturnValue({
      promise: jest.fn().mockResolvedValue({ Item: projectFromDb }),
    });

    const result = await getProject(projectId);

    expect(result).toEqual(projectFromDb);
    expect(mockGet).toHaveBeenCalledWith({
      TableName,
      Key: { id: projectId },
    });
  });

  it("should throw an error if project does not exist", async () => {
    const projectId = "2";

    const mockGet = dynamoDb.get as jest.Mock;
    mockGet.mockReturnValue({
      promise: jest.fn().mockResolvedValue({}),
    });

    await expect(getProject(projectId)).resolves.toBeNull();
  });

  it("should throw an error if project retrieval fails", async () => {
    const projectId = "1";

    const mockGet = dynamoDb.get as jest.Mock;
    mockGet.mockReturnValue({
      promise: jest.fn().mockRejectedValue(new Error("DynamoDB error")),
    });

    await expect(getProject(projectId)).rejects.toThrow("Could not get project");
  });
});

describe("updateProject", () => {
  const TableName = process.env.PROJECTS_TABLE as string;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update a project", async () => {
    const projectId = "1";
    const projectTitle = "Updated Project";
    const lastUpdated = currentISODate();
    const existingProject = new Project(projectId, "Sample Project", lastUpdated);
    const updatedProject = new Project(projectId, projectTitle, lastUpdated);

    const mockGet = dynamoDb.get as jest.Mock;
    mockGet.mockReturnValue({
      promise: jest.fn().mockResolvedValue({ Item: existingProject }),
    });

    const mockPut = dynamoDb.put as jest.Mock;
    mockPut.mockReturnValue({
      promise: jest.fn().mockResolvedValue({}),
    });

    const result = await updateProject(projectId, projectTitle);

    expect(result).toEqual(updatedProject);
    expect(mockGet).toHaveBeenCalledWith({
      TableName,
      Key: { id: projectId },
    });
    expect(mockPut).toHaveBeenCalledWith({
      TableName,
      Item: updatedProject,
    });
  });

  it("should throw an error if project does not exist", async () => {
    const projectId = "2";
    const projectTitle = "Updated Project";

    const mockGet = dynamoDb.get as jest.Mock;
    mockGet.mockReturnValue({
      promise: jest.fn().mockResolvedValue({}),
    });

    await expect(updateProject(projectId, projectTitle)).rejects.toThrow(
      `Project with ID ${projectId} not found`
    );
  });

  it("should throw an error if project update fails", async () => {
    const projectId = "1";
    const projectTitle = "Updated Project";
    const lastUpdated = currentISODate();
    const existingProject = new Project(projectId, "Sample Project", lastUpdated);

    const mockGet = dynamoDb.get as jest.Mock;
    mockGet.mockReturnValue({
      promise: jest.fn().mockResolvedValue({ Item: existingProject }),
    });

    const mockPut = dynamoDb.put as jest.Mock;
    mockPut.mockReturnValue({
      promise: jest.fn().mockRejectedValue(new Error("DynamoDB error")),
    });

    await expect(updateProject(projectId, projectTitle)).rejects.toThrow(
      `Could not update project with ID ${projectId}`
    );
  });
});

describe("deleteProject", () => {
  const TableName = process.env.PROJECTS_TABLE as string;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should delete a project", async () => {
    const projectId = "1";
    const existingProject = new Project(projectId, "Sample Project");

    const mockGet = dynamoDb.get as jest.Mock;
    mockGet.mockReturnValue({
      promise: jest.fn().mockResolvedValue({ Item: existingProject }),
    });

    const mockDelete = dynamoDb.delete as jest.Mock;
    mockDelete.mockReturnValue({
      promise: jest.fn().mockResolvedValue({}),
    });

    await deleteProject(projectId);

    expect(mockGet).toHaveBeenCalledWith({
      TableName,
      Key: { id: projectId },
    });
    expect(mockDelete).toHaveBeenCalledWith({
      TableName,
      Key: { id: projectId },
    });
  });

  it("should throw an error if project does not exist", async () => {
    const projectId = "2";

    const mockGet = dynamoDb.get as jest.Mock;
    mockGet.mockReturnValue({
      promise: jest.fn().mockResolvedValue({}),
    });

    await expect(deleteProject(projectId)).rejects.toThrow(
      `Project with ID ${projectId} not found`
    );
  });

  it("should throw an error if project deletion fails", async () => {
    const projectId = "1";
    const existingProject = new Project(projectId, "Sample Project");

    const mockGet = dynamoDb.get as jest.Mock;
    mockGet.mockReturnValue({
      promise: jest.fn().mockResolvedValue({ Item: existingProject }),
    });

    const mockDelete = dynamoDb.delete as jest.Mock;
    mockDelete.mockReturnValue({
      promise: jest.fn().mockRejectedValue(new Error("DynamoDB error")),
    });

    await expect(deleteProject(projectId)).rejects.toThrow(
      `Could not delete project with ID ${projectId}`
    );
  });
});

describe("listProjects", () => {
  const TableName = process.env.PROJECTS_TABLE as string;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should list all projects", async () => {
    const projectsFromDb = [
      new Project("1", "Project 1"),
      new Project("2", "Project 2"),
    ];

    const mockScan = dynamoDb.scan as jest.Mock;
    mockScan.mockReturnValue({
      promise: jest.fn().mockResolvedValue({ Items: projectsFromDb }),
    });

    const result = await listProjects();

    expect(result).toEqual(projectsFromDb);
    expect(mockScan).toHaveBeenCalledWith({ TableName });
  });

  it("should throw an error if project listing fails", async () => {
    const mockScan = dynamoDb.scan as jest.Mock;
    mockScan.mockReturnValue({
      promise: jest.fn().mockRejectedValue(new Error("DynamoDB error")),
    });

    await expect(listProjects()).rejects.toThrow("Could not list projects");
  });
});
