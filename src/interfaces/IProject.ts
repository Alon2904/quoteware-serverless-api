export interface IProject {
    id: string;
    title: string;
    lastQuoteId?: string;
    updatedAt?: string; // Storing dates as ISO strings for DynamoDB
  }