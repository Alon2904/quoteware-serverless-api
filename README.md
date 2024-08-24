# Serverless Quotes API

## Overview

The Serverless Quotes API is a scalable, serverless architecture for managing project-based quotes. Built with AWS services, this API allows users to create, retrieve, update, and delete quotes associated with projects. Each quote can have different sections and attributes, and the API also allows you to load the history of saved quotes. The application is designed to be deployed on AWS using Serverless Framework, DynamoDB, and Node.js.

## Features

- **Project Management**: Create, update, retrieve, and delete projects.
- **Quote Management**: Manage quotes associated with specific projects, including creating, updating, retrieving, and deleting quotes.
- **Template Management**: Handle template quotes that can be reused across different projects.
- **Section Management**: Quotes can be divided into different sections with distinct attributes.
- **History Loading**: Retrieve historical data of quotes to track changes and updates over time.

## Architecture

The application leverages the following AWS services:

- **AWS Lambda**: For serverless computing to handle API requests.
- **Amazon API Gateway**: For exposing RESTful endpoints.
- **Amazon DynamoDB**: For storing projects, quotes, sections, and templates.
- **AWS IAM**: For defining the necessary permissions for accessing DynamoDB.

## File Structure

### `serverless.yml`

This is the main configuration file for deploying the Serverless Quotes API. It defines the service, provider, environment variables, IAM roles, functions, and DynamoDB resources.

- **Provider**: Configures the AWS provider with Node.js 18.x runtime.
- **IAM Roles**: Grants necessary permissions to access DynamoDB tables.
- **Functions**: Defines the Lambda functions handling the API endpoints.
- **Resources**: Declares the DynamoDB tables used by the application.

### Functions

- **Project Quotes**
  - `createProjectQuote`: Create a new quote for a specific project.
  - `updateProjectQuote`: Update an existing quote for a project.
  - `getProjectQuote`: Retrieve a specific quote by its ID.
  - `getAllProjectQuotes`: Retrieve all quotes for a project.
  - `deleteProjectQuote`: Delete a specific quote from a project.

- **Template Quotes**
  - `createTemplateQuote`: Create a new template quote.
  - `updateTemplateQuote`: Update an existing template quote.
  - `getTemplateQuote`: Retrieve a specific template quote.
  - `deleteTemplateQuote`: Delete a specific template quote.

- **Projects**
  - `createProject`: Create a new project.
  - `getProject`: Retrieve details of a specific project.
  - `updateProject`: Update an existing project.
  - `deleteProject`: Delete a specific project.

### DynamoDB Tables

- **Quotes Table**: Stores quotes associated with projects.
- **Templates Table**: Stores reusable template quotes.
- **Sections Table**: Stores sections related to quotes.
- **Projects Table**: Stores project information.

## Installation

### Prerequisites

- Node.js (v18.x or higher)
- Serverless Framework
- AWS CLI configured with proper credentials

### Steps

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/serverless-quotes-api.git
   cd serverless-quotes-api

2. **Install dependencies:**

   ```bash
    npm install


2. **Deploy the service to AWS:**

   ```bash
   serverless deploy
## Usage

### API Endpoints

#### Projects

- **POST** `/projects`: Create a new project.
- **GET** `/projects/{projectId}`: Retrieve a project by ID.
- **PUT** `/projects/{projectId}`: Update a project by ID.
- **DELETE** `/projects/{projectId}`: Delete a project by ID.

#### Project Quotes

- **POST** `/projects/{projectId}/quotes`: Create a new quote for a project.
- **GET** `/projects/{projectId}/quotes/{quoteId}`: Retrieve a quote by ID.
- **PUT** `/projects/{projectId}/quotes/{quoteId}`: Update a quote by ID.
- **DELETE** `/projects/{projectId}/quotes/{quoteId}`: Delete a quote by ID.
- **GET** `/projects/{projectId}/quotes`: Retrieve all quotes for a project.

#### Template Quotes

- **POST** `/templates/quotes`: Create a new template quote.
- **GET** `/templates/quotes/{quoteId}`: Retrieve a template quote by ID.
- **PUT** `/templates/quotes/{quoteId}`: Update a template quote by ID.
- **DELETE** `/templates/quotes/{quoteId}`: Delete a template quote by ID.

### Local Development

To run the API locally, you can use the Serverless Offline plugin:

```bash
serverless offline



