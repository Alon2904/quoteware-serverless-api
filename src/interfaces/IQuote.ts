import { ISection } from "./ISection";

export interface IQuote {
    quoteId: string;
    author: string;
    projectId?: string; // Nullable for templates
    type: 'project' | 'template';
    name: string;
    title: string;
    templateVersion: number;
    itemsTableVersion: number;
    createdAt: string; // Storing dates as ISO strings for DynamoDB
    createdBy: string;
    updatedAt?: string; // Storing dates as ISO strings for DynamoDB
    updatedBy?: string;
    sections: ISection[];
  }

