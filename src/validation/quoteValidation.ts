import Joi from "joi";
import { sectionSchema } from "./sectionValidation";

// src/validation/quoteValidation.ts

export const createQuoteSchema = Joi.object({
  author: Joi.string().required(),
  name: Joi.string().required(),
  title: Joi.string().required(),
  type: Joi.string().valid('project', 'template').required(),
  templateVersion: Joi.number().integer().required(),
  itemsTableVersion: Joi.number().integer().required(),
  createdBy: Joi.string().required(),
  sections: Joi.array().items(sectionSchema).required(),
});
