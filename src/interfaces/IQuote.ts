export interface IQuote {
    quote_id: string;
    author: string;
    project_id?: string; // Nullable for templates
    type: 'project' | 'template';
    name: string;
    title: string;
    templateVersion: number;
    itemsTableVersion: number;
    created_at: string; // Storing dates as ISO strings for DynamoDB
    created_by: string;
    updated_at?: string; // Storing dates as ISO strings for DynamoDB
    updated_by?: string;
  }