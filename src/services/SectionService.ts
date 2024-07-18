import dynamoDb from "../utils/dynamoDB";
import { v4 as uuidv4 } from "uuid";
import { Section } from "../models/Section";

const TableName = process.env.SECTIONS_TABLE as string;


// Create a new section
export const createSection = async (
  sectionName: string,
  title: string,
  content: string,
): Promise<Section> => {
  const id = uuidv4();
  const createdAt = new Date();

  const newSection: Section = {
    id,
    sectionName,
    title,
    content,
    createdAt,
  };

  await dynamoDb
    .put({
      TableName,
      Item: newSection,
    })
    .promise();

  return newSection;
};

// Get a section by ID
export const getSection = async (id: string): Promise<Section | null> => {
  const result = await dynamoDb.get({ TableName, Key: { id } }).promise();

  if (!result.Item) {
    return null;
  }

  return result.Item as Section;
};