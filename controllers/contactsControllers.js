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
    const { token } = req.params;

    const user = await User.findOne({ verificationToken: token });

    if (user === null) {
      return res.status(404).send({ message: "User not found" });
    }

    await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: null });

    res.send({ message: "Email confirm successfully" });
  } catch (error) {}
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

async function changeAvatar(req, res, next) {
  try {
    if (!req.file) throw HttpError(400);
    const avatarSize = await Jimp.read(req.file.path);

    await avatarSize.resize(256, 256).writeAsync(req.file.path);
    await fs.rename(
      req.file.path,
      path.resolve("public", "avatars", req.file.filename)
    );
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        avatarURL: `/avatars/${req.file.filename}`,
      },
      { new: true }
    );
    res.status(201).send({ avatarURL: user.avatarURL });
  } catch (error) {
    next(error);
  }
}

export default {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
  changeAvatar,
  verifyEmail,
};
