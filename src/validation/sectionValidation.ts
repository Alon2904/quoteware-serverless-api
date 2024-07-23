import Joi from "joi";

// src/validation/sectionValidation.ts

export const sectionSchema = Joi.object({
  id: Joi.string().optional(), // This will be generated server-side
  author: Joi.string().required(),
  type: Joi.string().valid('project', 'template').required(),
  name: Joi.string().required(),
  title: Joi.string().required(),
  content: Joi.string().required(),
  index: Joi.number().integer().required(),
  created_at: Joi.string().optional(), // This will be generated server-side
  edited_at: Joi.string().optional(), // This will be generated server-side
  quote_id: Joi.string().optional(), // Optional field
});
