import { createContactSchema, updateContactSchema, updateStatusContactSchema } from "../schemas/contactsSchemas.js";
import Contact from "../modules/contacts.js";
import mongoose from "mongoose";
import HttpError from "../helpers/HttpError.js";

async function getAllContacts (req, res, next) {

  try {
    const contacts = await Contact.find()

    res.status(200).send(contacts)
  } catch (error) {
    next(error)
  }
};

async function getOneContact(req, res, next) {
  const {id} = req.params
 
  if(!mongoose.Types.ObjectId.isValid(id)){
     return next(new HttpError(400, `${id} is not valid id`))
}

  try {
    const contact = await Contact.findById(id)  
    
    if(!contact){
      return res.status(404).send({ message: 'Contact not found' });
    }

    res.status(200).send(contact)
  } catch (error) {
    next(error)
  }
};

async function deleteContact (req, res, next) {
  const {id} = req.params

if(!mongoose.Types.ObjectId.isValid(id)){
  return next(new HttpError(400, `${id} is not valid id`))
    }

  try {
    const result = await Contact.findByIdAndDelete(id)    

    if(!result){
      return res.status(404).send({ message: 'Contact not found' });
    }

    res.status(204).send(result)
  } catch (error) {
    next(error)
  }
};

async function createContact (req, res, next) {
  try {
    const {error} = createContactSchema.validate(req.body)

    if(error){
      return res.status(404).send(error.message)
    }

    const newContact = await Contact.create(req.body)
    res.status(201).send(newContact)
  } catch (error) {
    next(error)
  }
};

async function updateContact (req, res, next) {

  const {id} = req.params

  if(!mongoose.Types.ObjectId.isValid(id)){
    return next(new HttpError(400, `${id} is not valid id`))
}

  try {
 
    const {error} = updateContactSchema.validate(req.body)

    if(error){
      return res.status(400).send(error.message)
    }
    if (!req.body || Object.keys(req.body).length === 0){
      return res.status(404).send({message: "Your update is not valid"})
    }

    const updatedContact = await Contact.findByIdAndUpdate(id, req.body, {new: true})

    if(!updatedContact){
      return res.status(404)
    }

    res.status(200).send(updatedContact)

  } catch (error) {
    next(error)
  }
};

async function updateStatusContact(req, res) {

  const { id } = req.params;

  if(!mongoose.Types.ObjectId.isValid(id)){
    return next(new HttpError(400, `${id} is not valid id`))
  }

  try {

    const { error } = updateStatusContactSchema.validate(req.body);

    if(error){
      return res.status(400).send(error.message)
    }
    if (!req.body || Object.keys(req.body).length === 0){
      return res.status(404).send({message: "Your update is not valid"})
    }

    const updatedContact = await Contact.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedContact) throw HttpError(404);
    res.status(200).send(updatedContact);
  } catch (error) {
    next(error);
  }
}

export default {getAllContacts, getOneContact, deleteContact, createContact, updateContact, updateStatusContact} 