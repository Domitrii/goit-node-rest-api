import express from "express";
import Contacts from "../controllers/contactsControllers.js";

const contactsRouter = express.Router();

const jsonParser = express.json()

contactsRouter.get("/", Contacts.getAllContacts);
contactsRouter.get("/:id", Contacts.getOneContact);
contactsRouter.delete("/:id", Contacts.deleteContact);
contactsRouter.post("/", jsonParser ,Contacts.createContact);
contactsRouter.put("/:id", jsonParser, Contacts.updateContact);
contactsRouter.patch("/:id/favorite", Contacts.updateStatusContact);
contactsRouter.get("/auth/verify/:verificationToken", Contacts.verifyEmail)

export default contactsRouter;
