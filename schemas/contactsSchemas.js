import Joi from "joi";

export const createContactSchema = Joi.object({
  favorite: Joi.boolean(),
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
});

export const updateContactSchema = Joi.object({
  favorite: Joi.boolean(),
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
})

export const updateStatusContactSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

export const repeatVerifyEmailSchema = Joi.object({
  email: Joi.string().email().required(),
});