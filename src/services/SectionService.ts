import dynamoDb from "../utils/dynamoDB";
import { v4 as uuidv4 } from "uuid";
import { Section } from "../models/Section";
import { currentISODate } from "../utils/dateUtils";

const TableName = process.env.SECTIONS_TABLE as string;

// Create a new section
export const createSection = async (
  name: string,
  author: string,
  type: 'project' | 'template',
  title: string,
  content: string,
  index: number,
  quote_id?: string
): Promise<Section> => {
  try {
    const id = uuidv4();
    const createdAt = currentISODate();

    const newSection = new Section(
      id,
      author,
      type,
      name,
      title,
      content,
      index,
      createdAt,
      createdAt,
      quote_id
    );

    await dynamoDb
      .put({
        TableName,
        Item: newSection,
      })
      .promise();

    return newSection;
  } catch (error) {
    console.error("Error creating section:", error);
    throw new Error("Could not create section");
  }
};

// CRUD Operations for sections will be used for sections from template type

// Get all sections
export const getAllSections = async (): Promise<Section[]> => {
  try {
    const result = await dynamoDb.scan({ TableName }).promise();
    return result.Items as Section[];
  } catch (error) {
    console.error("Error getting all sections:", error);
    throw new Error("Could not get all sections");
  }
};

// Get a section by ID
export const getSection = async (id: string): Promise<Section | null> => {
  try {
    const result = await dynamoDb.get({ TableName, Key: { id } }).promise();

    if (!result.Item) {
      return null;
    }

    return result.Item as Section;
  } catch (error) {
    console.error(`Error getting section with ID ${id}:`, error);
    throw new Error(`Could not get section with ID ${id}`);
  }
};

// Update a section
export const updateSection = async (
  id: string,
  name: string,
  title: string,
  content: string,
  index: number,
  author: string
): Promise<Section> => {
  try {
    const editedAt = currentISODate();
    const type = 'template';

    const updatedSection = new Section(
      id,
      author,
      type,
      name,
      title,
      content,
      index,
      editedAt
    );

    await dynamoDb
      .put({
        TableName,
        Item: updatedSection,
      })
      .promise();

    return updatedSection;
  } catch (error) {
    console.error(`Error updating section with ID ${id}:`, error);
    throw new Error(`Could not update section with ID ${id}`);
  }
};

// Delete a section
export const deleteSection = async (id: string): Promise<void> => {
  try {
    await dynamoDb
      .delete({
        TableName,
        Key: { id },
      })
      .promise();
  } catch (error) {
    console.error(`Error deleting section with ID ${id}:`, error);
    throw new Error(`Could not delete section with ID ${id}`);
  }
};
