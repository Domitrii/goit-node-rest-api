import express from "express";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config"
import contactsRouter from "./routes/contactsRouter.js";
import authRouter from './routes/authRoutes.js'
import authMiddleware from './middleware/auth.js'
import "./db/db.js"
import path from 'node:path'

const app = express();

app.use('/avatars', express.static(path.resolve("public/avatars")))

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", authMiddleware ,contactsRouter);
app.use('/api/users', authRouter)

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});


app.listen(7070, () => {
  console.log("Server is running. Use our API on port: 7070");
});
