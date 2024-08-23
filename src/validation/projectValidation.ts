import Joi from "joi";

// src/validation/projectValidation.ts

export const createProjectSchema = Joi.object({
  projectId: Joi.string().required(),
  title: Joi.string().required(),
  lastQuoteId: Joi.string().required(),
});

export const updateProjectSchema = Joi.object({
  title: Joi.string().required(),
  lastQuoteId: Joi.string().optional(),
});