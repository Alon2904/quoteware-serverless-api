// import AWSMock from "aws-sdk-mock";
// import { APIGatewayProxyEvent } from "aws-lambda";
// import { v4 as uuidv4 } from "uuid";
// import { handler as createHandler } from "../src/handlers/projectQuotes/createProjectQuote";
// import { handler as deleteHandler } from "../src/handlers/projectQuotes/deleteProjectQuote";
// import { handler as getHandler } from "../src/handlers/projectQuotes/getProjectQuote";
// import { handler as updateHandler } from "../src/handlers/projectQuotes/updateProjectQuote";

// describe('Project Quote Lifecycle', () => {
//   let createdQuoteId: string;
//   const projectId = '1234';

//   beforeAll(() => {
//     AWSMock.mock('DynamoDB.DocumentClient', 'put', (params, callback) => {
//       callback(null, {});
//     });

//     AWSMock.mock('DynamoDB.DocumentClient', 'get', (params, callback) => {
//       if (params.Key.quoteId === createdQuoteId) {
//         callback(null, { Item: mockQuote });
//       } else {
//         callback(null, {});
//       }
//     });

//     AWSMock.mock('DynamoDB.DocumentClient', 'delete', (params, callback) => {
//       callback(null, {});
//     });
//   });

//   afterAll(() => {
//     AWSMock.restore('DynamoDB.DocumentClient');
//   });

//   const mockQuote = {
//     author: 'John Doe',
//     name: 'Quote Name',
//     title: 'Quote Title',
//     type: 'project',
//     templateVersion: 1,
//     itemsTableVersion: 2,
//     createdBy: 'creator-id',
//     createdAt: new Date().toISOString(),
//     sections: [
//       {
//         id: 'section-1',
//         type: 'project',
//         name: 'Section 1',
//         title: 'Section Title 1',
//         content: 'Content 1',
//         index: 1,
//       },
//       {
//         id: 'section-2',
//         type: 'project',
//         name: 'Section 2',
//         title: 'Section Title 2',
//         content: 'Content 2',
//         index: 2,
//       },
//     ],
//     projectId: projectId,
//   };

//   it('should create a new project quote', async () => {
//     const event: APIGatewayProxyEvent = {
//       body: JSON.stringify(mockQuote),
//       pathParameters: { projectId },
//     } as any;

//     const response = await createHandler(event);

//     expect(response.statusCode).toBe(201);
//     const responseBody = JSON.parse(response.body);
//     createdQuoteId = responseBody.quoteId;
//     expect(responseBody).toHaveProperty('quoteId');
//     expect(responseBody).toHaveProperty('sections');
//     expect(responseBody.sections).toHaveLength(2);
//   });

//   it('should get the created project quote', async () => {
//     const event: APIGatewayProxyEvent = {
//       pathParameters: { projectId, quoteId: createdQuoteId },
//     } as any;

//     const response = await getHandler(event);

//     expect(response.statusCode).toBe(200);
//     const responseBody = JSON.parse(response.body);
//     expect(responseBody.quoteId).toBe(createdQuoteId);
//   });

//   it('should update the created project quote', async () => {
//     const updatedQuote = {
//       name: 'Updated Quote Name',
//       title: 'Updated Quote Title',
//       templateVersion: 2,
//       itemsTableVersion: 3,
//       updatedBy: 'Jane Doe',
//       sections: [
//         {
//           id: 'section-1',
//           author: 'John Doe',
//           type: 'project',
//           name: 'Section Name 1 - Updated',
//           title: 'Section Title 1 - Updated',
//           content: 'Content 1 - Updated',
//           index: 1,
//         },
//       ],
//     };

//     const event: APIGatewayProxyEvent = {
//       body: JSON.stringify(updatedQuote),
//       pathParameters: { projectId, quoteId: createdQuoteId },
//     } as any;

//     const response = await updateHandler(event);

//     expect(response.statusCode).toBe(200);
//     const responseBody = JSON.parse(response.body);
//     expect(responseBody.name).toBe(updatedQuote.name);
//     expect(responseBody.title).toBe(updatedQuote.title);
//     expect(responseBody.templateVersion).toBe(updatedQuote.templateVersion);
//     expect(responseBody.itemsTableVersion).toBe(updatedQuote.itemsTableVersion);
//     expect(responseBody.sections).toHaveLength(1);
//     expect(responseBody.sections[0].name).toBe(updatedQuote.sections[0].name);
//   });

//   it('should delete the created project quote', async () => {
//     const event: APIGatewayProxyEvent = {
//       pathParameters: { projectId, quoteId: createdQuoteId },
//     } as any;

//     const response = await deleteHandler(event);

//     expect(response.statusCode).toBe(204);
//   });
// });
