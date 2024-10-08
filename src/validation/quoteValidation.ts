import Joi from "joi";
import { sectionSchema, templateSectionSchema } from "./sectionValidation";

// ------------------ Project Schemas ------------------


// Validation schema for creating a generic quote (template or project)
export const createQuoteSchema = Joi.object({
  author: Joi.string().required(),
  name: Joi.string().required(),
  title: Joi.string().required(),
  type: Joi.string().valid('project', 'template').required(),
  templateVersion: Joi.number().integer().required(),
  itemsTableVersion: Joi.number().integer().required(),
  itemsTableIndex: Joi.number().integer().required(),
  createdBy: Joi.string().required(),
  sections: Joi.array().items(sectionSchema).required(),
  projectId: Joi.string().optional(), // Nullable for templates
});

// Validation schema for creating a project-specific quote
export const createProjectQuoteSchema = Joi.object({
  author: Joi.string().required(),
  name: Joi.string().required(),
  title: Joi.string().required(),
  type: Joi.string().valid('project').required(),
  templateVersion: Joi.number().integer().required(),
  itemsTableVersion: Joi.number().integer().required(),
  itemsTableIndex: Joi.number().integer().required(),
  createdBy: Joi.string().required(),
  sections: Joi.array().items(sectionSchema).required(),
  projectId: Joi.string().required(), // Nullable for templates
});


export const updateProjectQuoteSchema = Joi.object({
  name: Joi.string().required(),
  title: Joi.string().required(),
  templateVersion: Joi.number().integer().required(),
  itemsTableVersion: Joi.number().integer().required(),
  itemsTableIndex: Joi.number().integer().required(),
  sections: Joi.array().items(sectionSchema).required().default([]),
  updatedBy: Joi.string().required(),
});

// Validation schema for updating a quote
export const updateQuoteSchema = Joi.object({
  name: Joi.string().required(),
  title: Joi.string().required(),
  templateVersion: Joi.number().required(),
  itemsTableVersion: Joi.number().required(),
  itemTableIndex: Joi.number().required(),
  updatedBy: Joi.string().required(), // Make sure the updatedBy field is required to track who made the changes
  sections: Joi.array().items(sectionSchema).required().default([]),
});

// ------------------ Template Schemas ------------------

// Validation schema for creating a template-specific quote
export const createTemplateQuoteSchema = Joi.object({
  author: Joi.string().required(),
  name: Joi.string().required(),
  title: Joi.string().required(),
  type: Joi.string().valid('template').required(),
  templateVersion: Joi.number().integer().required(),
  itemsTableVersion: Joi.number().integer().required(),
  itemsTableIndex: Joi.number().integer().required(),
  createdBy: Joi.string().required(),
  sections: Joi.array().items(templateSectionSchema).required(),
  projectId: Joi.string().required(), // Nullable for templates
});

// Validation schema for updating a template-specific quote
export const updateTemplateQuoteSchema = Joi.object({
  name: Joi.string().required(),
  title: Joi.string().required(),
  templateVersion: Joi.number().integer().required(),
  itemsTableVersion: Joi.number().integer().required(),
  itemsTableIndex: Joi.number().integer().required(),
  sections: Joi.array().items(templateSectionSchema).required().default([]),
  updatedBy: Joi.string().required(),
});