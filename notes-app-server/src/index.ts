import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

// Get all notes
app.get("/api/notes", async (req, res) => {
    const notes = await prisma.note.findMany();
    res.json(notes);
});

// Post new note
app.post("/api/notes", async (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).send("Title and content fields required.");
    }

    try {
        const note = await prisma.note.create({
            data: { title, content },
        });
        res.json(note);
    } catch (error) {
        res.status(500).send("Oops, something went wrong!");
    }
});

// Update existing note
app.put("/api/notes/:id", async (req, res) => {
    const { title, content } = req.body;
    const id = parseInt(req.params.id);

    if (!title || !content) {
        return res.status(400).send("Title and content fields required.");
    }

    if (!id || isNaN(id)) {
        return res.status(400).send("ID must be valid.");
    }

    try {
        const updatedNote = await prisma.note.update({
            where: { id },
            data: { title, content },
        });
        res.json(updatedNote);
    } catch (error) {
        res.status(500).send("Oops, something went wrong!");
    }
});

// Delete existing note
app.delete("/api/notes/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    if (!id || isNaN(id)) {
        return res.status(400).send("ID must be valid.");
    }

    try {
        await prisma.note.delete({
            where: { id },
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).send("Oops, something went wrong!");
    }
});

// Start server on port 5000
app.listen(5000, () => {
    console.log("Server running on localhost:5000");
});