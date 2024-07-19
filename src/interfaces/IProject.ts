export interface IProject {
    id: string;
    title: string;
    lastUpdated: string; // Storing dates as ISO strings for DynamoDB
  }