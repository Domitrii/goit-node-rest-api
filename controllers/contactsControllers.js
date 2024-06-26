import {
  createContactSchema,
  updateContactSchema,
  updateStatusContactSchema,
} from "../schemas/contactsSchemas.js";
import Contact from "../modules/contacts.js";
import { isValidObjectId } from "mongoose";
import HttpError from "../helpers/HttpError.js";
import * as fs from "node:fs/promises";
import path from "node:path";

import User from "../modules/user.js";
import Jimp from "jimp";

async function getAllContacts(req, res, next) {
  try {
    const userId = req.user.id;
    const contacts = await Contact.find({ owner: userId });

    res.status(200).send(contacts);
  } catch (error) {
    next(error);
  }
}

async function getOneContact(req, res, next) {
  const { id } = req.params;

  try {
    if (!isValidObjectId(id)) throw HttpError(400, `${id} is not valid id`);
    const contact = await Contact.findOne({ _id: id, owner: req.user.id });
    if (!contact) throw HttpError(404);
    res.status(200).send(contact);
  } catch (error) {
    next(error);
  }
}

async function deleteContact(req, res, next) {
  const { id } = req.params;

  try {
    if (!isValidObjectId(id)) throw HttpError(400, `${id} is not valid id`);
    const result = await Contact.findOneAndDelete({
      _id: id,
      owner: req.user.id,
    });
    if (!result) throw HttpError(404);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
}

async function createContact(req, res, next) {
  try {
    const contact = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      owner: req.user.id,
    };
    const addContact = await Contact.create(contact);

    return res.status(201).send(addContact);
  } catch (error) {
    next(error);
  }
}

async function verifyEmail(req, res, next) {
  try {
    const { verificationToken } = req.params;

    const user = await User.findOne({ verificationToken: verificationToken });
    if (user === null) {
      throw HttpError(404, "User not found");
    }
    await User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: null,
    });
    res.status(200).send({ message: "Verification successful" });
  } catch (error) {
    next(error);
  }
}

async function repeatVerifyEmail(req, res, next){
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (user === null) {
      throw HttpError(404, "User not found");
    }
    if (user.verify) {
      throw HttpError(400, "Verification has already been passed");
    }
    sendMail.sendMail({
      to: email,
      from: "danilyanishevski2001@gmail.com",
      subject: "Welcome to contactBook",
      html: `To confirm your email, click on <a href="http://localhost:3000/users/auth/verify/${user.verificationToken}">link</a>`,
      text: `To confirm your email, open link http://localhost:3000/users/auth/verify/${user.verificationToken}`,
    });
    res.status(200).send({ message: "Verification email sent" });
  } catch (error) {
    next(error);
  }
}

async function updateContact(req, res, next) {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) throw HttpError(400, `${id} is not valid id`);
    const { error } = updateContactSchema.validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.message });
    }
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(404).send({ message: "Your update is not valid" });
    }

    const updatedContact = await Contact.findOneAndUpdate(
      { _id: id, owner: req.user.id },
      req.body,
      { new: true }
    );

    if (!updatedContact) throw HttpError(404);
    res.status(200).send(updatedContact);
  } catch (error) {
    next(error);
  }
}

async function updateStatusContact(req, res) {
  const { id } = req.params;
  const userId = req.user._id;
  try {
    if (!isValidObjectId(id)) throw HttpError(400, `${id} is not valid id`);
    const { error } = updateStatusContactSchema.validate(req.body);

    if (error) {
      return res.status(400).send({ message: error.message });
    }
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(404).send({ message: "Your update is not valid" });
    }
    const contact = await Contact.findById(id);
    if (!contact) throw HttpError(404);

    if (String(contact.owner) !== String(userId)) {
      return res
        .status(403)
        .send({ message: "You are not authorized to update this contact" });
    }

    const updatedContact = await Contact.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedContact) throw HttpError(404);
    res.status(200).send(updatedContact);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
}

export default {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
  verifyEmail,
  repeatVerifyEmail
};
