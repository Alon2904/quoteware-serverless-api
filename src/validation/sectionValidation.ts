import Joi from "joi";

// src/validation/sectionValidation.ts

export const sectionSchema = Joi.object({
    id: Joi.string().optional(), // This will be generated server-side if not provided
    author: Joi.string().required(),
    type: Joi.string().valid('project', 'template').required(),
    name: Joi.string().required(),
    title: Joi.string().required(),
    content: Joi.string().required(),
    index: Joi.number().integer().required(),
    createdAt: Joi.string().optional(), // This will be generated server-side
    editedAt: Joi.string().optional(), // This will be generated server-side
    quoteId: Joi.string().optional(), // Optional field
  });

