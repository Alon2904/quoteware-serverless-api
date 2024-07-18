import dynamoDb from "../utils/dynamoDB";
import { v4 as uuidv4 } from "uuid";
import { Quote } from "../models/Quote";
import { Section } from "../models/Section";

const TableName = process.env.QUOTES_TABLE as string;

// Create a new quote
export const createQuoteInProject = async (
  author: string,
  projectId: string,
  title: string,
  templateVersion: number,
  itemsTableVersion: number,
  sections: Section[]
): Promise<Quote> => {
  try {
    const id = uuidv4();
    const createdAt = new Date().toISOString();
    const lastUpdated = new Date().toISOString();

    const newQuote: Quote = {
      id,
      projectId,
      author,
      title,
      templateVersion,
      itemsTableVersion,
      createdAt,
      lastUpdated,
      sections,
      editedBy: undefined, // Set editedBy to undefined initially
    };

    await dynamoDb.put({
      TableName,
      Item: newQuote,
    }).promise();

    return newQuote;
  } catch (error) {
    console.error("Error creating quote:", error);
    throw new Error("Could not create quote");
  }
};

// Get a quote by ID
export const getQuoteInProject = async (id: string): Promise<Quote | null> => {
  try {
    const result = await dynamoDb.get({ TableName, Key: { id } }).promise();

    if (!result.Item) {
      return null;
    }

    const quoteFromDb = result.Item as Quote;
    quoteFromDb.createdAt = new Date(quoteFromDb.createdAt).toISOString();
    quoteFromDb.lastUpdated = new Date(quoteFromDb.lastUpdated).toISOString();

    return quoteFromDb;
  } catch (error) {
    console.error(`Error fetching quote with ID ${id}:`, error);
    throw new Error(`Could not fetch quote with ID ${id}`);
  }
};

// Update a quote
export const updateQuoteInProject = async (
  id: string,
  title: string,
  templateVersion: number,
  itemsTableVersion: number,
  sections: Section[],
  editedBy: string // Add editedBy parameter for updates
): Promise<Quote | null> => {
  try {
    const existingQuote = await getQuoteInProject(id);
    if (!existingQuote) {
      throw new Error(`Quote with ID ${id} not found`);
    }

    const lastUpdated = new Date().toISOString();

    const updatedQuote: Quote = {
      ...existingQuote,
      title,
      templateVersion,
      itemsTableVersion,
      lastUpdated,
      sections,
      editedBy,
    };

    await dynamoDb.put({
      TableName,
      Item: updatedQuote,
    }).promise();

    return updatedQuote;
  } catch (error) {
    console.error(`Error updating quote with ID ${id}:`, error);
    throw new Error(`Could not update quote with ID ${id}`);
  }
};

// Delete a quote
export const deleteQuote = async (id: string): Promise<void> => {
  try {
    const existingQuote = await getQuoteInProject(id);
    if (!existingQuote) {
      throw new Error(`Quote with ID ${id} not found`);
    }

    await dynamoDb.delete({ TableName, Key: { id } }).promise();
  } catch (error) {
    console.error(`Error deleting quote with ID ${id}:`, error);
    throw new Error(`Could not delete quote with ID ${id}`);
  }
};

// List all quotes by project ID
export const listQuotesByProjectId = async (projectId: string): Promise<Quote[]> => {
  try {
    const result = await dynamoDb.scan({ TableName }).promise();
    const quotesFromDb = result.Items as Quote[];

    const quotes = quotesFromDb.filter(quote => quote.projectId === projectId);

    return quotes.map(quote => ({
      ...quote,
      createdAt: new Date(quote.createdAt).toISOString(),
      lastUpdated: new Date(quote.lastUpdated).toISOString(),
    }));
  } catch (error) {
    console.error("Error listing quotes:", error);
    throw new Error("Could not list quotes");
  }
};

// Get a quote by ID (alternative method)
export const getQuoteInProjectById = async (id: string): Promise<Quote | null> => {
  try {
    const result = await dynamoDb.get({ TableName, Key: { id } }).promise();

    if (!result.Item) {
      throw new Error(`Quote with ID ${id} not found`);
    }

    const quoteFromDb = result.Item as Quote;
    quoteFromDb.createdAt = new Date(quoteFromDb.createdAt).toISOString();
    quoteFromDb.lastUpdated = new Date(quoteFromDb.lastUpdated).toISOString();

    return quoteFromDb;
  } catch (error) {
    console.error(`Error fetching quote with ID ${id}:`, error);
    throw new Error(`Could not fetch quote with ID ${id}`);
  }
};
