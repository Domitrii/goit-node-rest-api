import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    'string.empty': 'Name is required',
    'string.min': 'Name should have a minimum length of 3 characters',
    'string.max': 'Name should have a maximum length of 30 characters',
  }),
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Email must be a valid email address',
  }),
  phone: Joi.string().pattern(/^\d+$/).required().messages({
    'string.empty': 'Phone is required',
    'string.pattern.base': 'Phone must be a valid phone number',
  }),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(30).optional().messages({
    'string.min': 'Name should have a minimum length of 3 characters',
    'string.max': 'Name should have a maximum length of 30 characters',
  }),
  email: Joi.string().email().optional().messages({
    'string.email': 'Email must be a valid email address',
  }),
  phone: Joi.string().pattern(/^\d+$/).optional().messages({
    'string.pattern.base': 'Phone must be a valid phone number',
  }),
}).or('name', 'email', 'phone');
