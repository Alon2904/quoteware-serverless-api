import dynamoDb from "../utils/dynamoDB";
import { v4 as uuidv4 } from "uuid";
import { Quote } from "../models/Quote";
import { Section } from "../models/Section";
import { currentISODate } from "../utils/dateUtils";
import { DynamoDBError, QuoteNotFoundError } from "../utils/errors";

// src/services/QuoteService.ts

const TableName = process.env.QUOTES_TABLE as string;

// Create a new quote
export const createQuote = async (
  author: string,
  name: string,
  title: string,
  type: 'project' | 'template',
  templateVersion: number,
  itemsTableVersion: number,
  createdBy: string,
  sections: Section[] = [],
  projectId?: string
): Promise<Quote> => {
  try {
    const quoteId: string = uuidv4();
    const createdAt: string = currentISODate();

    const newQuote = new Quote(
      quoteId,
      author,
      name,
      title,
      type,
      templateVersion,
      itemsTableVersion,
      createdAt,
      createdBy,
      sections,
      undefined,
      undefined,
      projectId
    );

    await dynamoDb
      .put({
        TableName,
        Item: newQuote.toItem(),
      })
      .promise();

    return newQuote;
  } catch (error) {
    console.error("Error creating quote:", error);
    throw new DynamoDBError("Could not create quote");
  }
};

// Get a quote by ID
export const getQuote = async (quoteId: string): Promise<Quote | null> => {
  try {
    const result = await dynamoDb.get({ TableName, Key: { quoteId: quoteId } }).promise();

    if (!result.Item) {
      return null;
    }


    return Quote.fromItem(result.Item);  
  } catch (error) {
    console.error("Error getting quote:", error);
    throw new Error("Could not get quote");
  }
};

// Update a quote, including sections
export const updateQuote = async (quoteToUpdate: Quote): Promise<Quote> => {
  try {
    const existingQuote = await getQuote(quoteToUpdate.quoteId);
    if (!existingQuote) {
      throw new QuoteNotFoundError(`Quote with ID ${quoteToUpdate.quoteId} not found`);
    }

    const updatedAt: string = currentISODate();

    // Update existing sections or add new sections
    const sectionsMap = new Map<string, Section>();
    existingQuote.sections.forEach(section => sectionsMap.set(section.id, section));

    const updatedSections: Section[] = quoteToUpdate.sections.map(section => {
      const existingSection = sectionsMap.get(section.id);
      return new Section(
        section.id || uuidv4(),
        existingSection ? existingSection.author : section.author,
        section.type,
        section.name,
        section.title,
        section.content,
        section.index,
        existingSection ? existingSection.createdAt : currentISODate(),
        updatedAt
      );
    });

    const quoteForDynamo = new Quote(
      quoteToUpdate.quoteId,
      existingQuote.author, // Preserve the original author
      quoteToUpdate.name,
      quoteToUpdate.title,
      quoteToUpdate.type,
      quoteToUpdate.templateVersion,
      quoteToUpdate.itemsTableVersion,
      existingQuote.createdAt, // Preserve the original createdAt
      existingQuote.createdBy, // Preserve the original createdBy
      updatedSections,
      updatedAt,
      quoteToUpdate.updatedBy,
      existingQuote.projectId // Preserve the original projectId
    );

    const itemsisedQuote = quoteForDynamo.toItem();

    await dynamoDb
      .put({
        TableName,
        Item: itemsisedQuote,
      })
      .promise();

    return quoteForDynamo;
  } catch (error) {
    console.error(`Error updating quote with ID ${quoteToUpdate.quoteId}:`, error);
    if (error instanceof QuoteNotFoundError) {
      throw error;
    }
    throw new DynamoDBError(`Could not update quote with ID ${quoteToUpdate.quoteId}`);
  }
};

// Delete a quote
export const deleteQuote = async (quoteId: string): Promise<void> => {
  try {
    await dynamoDb
      .delete({
        TableName,
        Key: { quoteId: quoteId },
      })
      .promise();
  } catch (error) {
    console.error(`Error deleting quote with ID ${quoteId}:`, error);
    throw new DynamoDBError(`Could not delete quote with ID ${quoteId}`);
  }
};

// List all quotes
export const listQuotes = async (): Promise<Quote[]> => {
  try {
    const result = await dynamoDb.scan({ TableName }).promise();
    return result.Items as Quote[];
  } catch (error) {
    console.error("Error listing quotes:", error);
    throw new Error("Could not list quotes");
  }
};

// List quotes by project
export const listQuotesByProject = async (projectId: string): Promise<Quote[]> => {
  try {
    const params = {
      TableName,
      IndexName: 'ProjectIndex', // Ensure you have an index on project_id
      KeyConditionExpression: "project_id = :projectId",
      ExpressionAttributeValues: {
        ":projectId": projectId,
      },
    };

    const result = await dynamoDb.query(params).promise();
    return result.Items as Quote[];
  } catch (error) {
    console.error("Error listing quotes by project:", error);
    throw new Error("Could not list quotes by project for project ID " + projectId);
  }
};
