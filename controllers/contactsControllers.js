import contactsService from "../services/contactsServices.js";
import * as fs from "node:fs/promises";
import path from "node:path";

const contactsPath = path.resolve("db", "contacts.json");

export const getAllContacts = async (req, res) => {
    try {
        const contacts = await contactsService.listContacts();
        res.status(200).json(contacts);
    } catch (error) {
        console.error('Error is: ', error);
        res.status(500).json({ message: 'Failed to get contacts' });
    }
};

export const getOneContact = async (req, res) => {
    try {
        const contactId = req.params.id;
        const contact = await contactsService.getContactById(contactId);
        if (contact.message === "not found") {
            res.status(404).json({ message: 'Contact not found' });
        } else {
            res.status(200).json(contact);
        }
    } catch (error) {
        console.error('Error is: ', error);
        res.status(500).json({ message: 'Failed to get contact' });
    }
};

export const deleteContact = async (req, res) => {
    try {
        const contactId = req.params.id;
        const deletedContact = await contactsService.removeContact(contactId);
        if (!deletedContact) {
            res.status(404).json({ message: 'Contact not found' });
        } else {
            res.status(200).json(deletedContact);
        }
    } catch (error) {
        console.error('Error is: ', error);
        res.status(500).json({ message: 'Failed to delete contact' });
    }
};

export const createContact = async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        const newContact = await contactsService.addContact(name, email, phone);
        res.status(201).json(newContact);
    } catch (error) {
        console.error('Error is: ', error);
        res.status(500).json({ message: 'Failed to create contact' });
    }
};

export const updateContact = async (req, res) => {
    try {
        const contactId = req.params.id;
        const { name, email, phone } = req.body;
        const contacts = await contactsService.listContacts();
        const contactIndex = contacts.findIndex(({ id }) => id === contactId);

        if (contactIndex === -1) {
            res.status(404).json({ message: 'Contact not found' });
            return;
        }

        const updatedContact = {
            ...contacts[contactIndex],
            name: name || contacts[contactIndex].name,
            email: email || contacts[contactIndex].email,
            phone: phone || contacts[contactIndex].phone,
        };

        contacts[contactIndex] = updatedContact;
        await fs.writeFile(
            contactsPath,
            JSON.stringify(contacts, undefined, 2)
        );

        res.status(200).json(updatedContact);
    } catch (error) {
        console.error('Error is: ', error);
        res.status(500).json({ message: 'Failed to update contact' });
    }
};
