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


export const updateQuoteSchema = Joi.object({
    quote_id: Joi.string().required(),
    name: Joi.string().required(),
    title: Joi.string().required(),
    templateVersion: Joi.number().required(),
    itemsTableVersion: Joi.number().required(),
    updatedBy: Joi.string().required(), // Make sure the updatedBy field is required to track who made the changes
    sections: Joi.array().items(
        Joi.object({
            id: Joi.string().required(),
            author: Joi.string().required(),
            type: Joi.string().valid('project', 'template').required(),
            name: Joi.string().required(),
            title: Joi.string().required(),
            content: Joi.string().required(),
            index: Joi.number().required(),
            created_at: Joi.string().required(),
            edited_at: Joi.string().required(),
        })
    ).optional().default([]),
});
  