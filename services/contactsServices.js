import * as fs from "node:fs/promises";
import crypto from "node:crypto";
import path from "node:path";

const contactsPath = path.resolve("db", "contacts.json");

async function listContacts() {
  const allContacts = await fs.readFile(contactsPath, { encoding: "utf-8" });
  return JSON.parse(allContacts);
}

async function getContactById(contactId) {
  const allContacts = await listContacts();
  return allContacts.find(({ id }) => id === String(contactId)) || {"message": "not found"};
}

async function removeContact(contactId) {
  const allContacts = await listContacts();
  const index = allContacts.findIndex(({ id }) => id === String(contactId));

  if (index === -1) return null;

  const newContactsList = [
    ...allContacts.slice(0, index),
    ...allContacts.slice(index + 1),
  ];

  await fs.writeFile(
    contactsPath,
    JSON.stringify(newContactsList, undefined, 2)
  );
  return allContacts[index];
}

async function addContact(name, email, phone) {
  const allContacts = await listContacts();
  const newContact = { id: crypto.randomUUID(), name, email, phone };
  const newContactsList = [...allContacts, newContact];

  await fs.writeFile(
    contactsPath,
    JSON.stringify(newContactsList, undefined, 2)
  );
  return newContact;
}

export default { listContacts, getContactById, addContact, removeContact };
