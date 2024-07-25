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
    const quoteId = uuidv4();
    const createdAt = currentISODate();

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
    const result = await dynamoDb.get({ TableName, Key: { quote_id: quoteId } }).promise();

    if (!result.Item) {
      return null;
    }

    return result.Item as Quote;
  } catch (error) {
    console.error("Error getting quote:", error);
    throw new Error("Could not get quote");
  }
};

// Update a quote, including sections
export const updateQuote = async (updatedQuote: Quote): Promise<Quote> => {
  console.log('inside updateQuote', updatedQuote);
  try {
    const existingQuote = await getQuote(updatedQuote.quote_id);
    if (!existingQuote) {
      throw new QuoteNotFoundError(`Quote with ID ${updatedQuote.quote_id} not found`);
    }

    console.log('got the quote', existingQuote);

    const itemsisedQuote = updatedQuote.toItem();

    await dynamoDb
      .put({
        TableName: process.env.QUOTES_TABLE as string,
        Item: itemsisedQuote,
      })
      .promise();

    return updatedQuote;
  } catch (error) {
    console.error(`Error updating quote with ID ${updatedQuote.quote_id}:`, error);
    if (error instanceof QuoteNotFoundError) {
      throw error;
    }
    throw new DynamoDBError(`Could not update quote with ID ${updatedQuote.quote_id}`);
  }
};

// Delete a quote
export const deleteQuote = async (quoteId: string): Promise<void> => {
  try {
    await dynamoDb
      .delete({
        TableName,
        Key: { quote_id: quoteId },
      })
      .promise();
  } catch (error) {
    console.error(`Error deleting quote with ID ${quoteId}:`, error);
    throw new Error(`Could not delete quote with ID ${quoteId}`);
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
