const Express = require("express");
const MongoClient = require("mongodb").MongoClient;
const cors = require("cors");
const multer = require("multer");
const app = Express();

// Middleware to handle CORS and parse JSON bodies
app.use(cors());
app.use(Express.json()); // Important for parsing JSON bodies in POST requests

const CONNECTION_STRING = "mongodb+srv://lokesh:RyzUG4LxwLgKFuwO@cluster0.vatqd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const DATABASENAME = "todoappdb";
let database;

// Initialize MongoDB connection
app.listen(5000, () => {
    MongoClient.connect(CONNECTION_STRING, { useUnifiedTopology: true }, (error, client) => {
        if (error) {
            console.error("MongoDB connection error:", error);
            return;
        }
        database = client.db(DATABASENAME);
        console.log("MongoDB connection successful");
    });
});

// GET: Fetch all notes
app.get('/api/todoapp/getnotes', async (req, res) => {
    try {
        const result = await database.collection("todoappcollection").find({}).toArray();
        res.send(result);
    } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).send('Failed to fetch notes');
    }
});

// POST: Add a new note
app.post('/api/todoapp/addnotes', async (req, res) => {
    try {
        const numDocs = await database.collection("todoappcollection").countDocuments({});
        await database.collection("todoappcollection").insertOne({
            id: (numDocs + 1).toString(),
            description: req.body.newNotes
        });
        res.json({ message: 'Add notes successful' }); 
    } catch (error) {
        console.error('Error adding note:', error);
        res.status(500).send('Failed to add notes');
    }
});

// DELETE: Delete a note by ID
app.delete('/api/todoapp/deletenotes', async (req, res) => {
    try {
        const result = await database.collection("todoappcollection").deleteOne({ id: req.query.id });
        if (result.deletedCount === 1) {
            res.send("Delete successful");
        } else {
            res.status(404).send("Note not found");
        }
    } catch (error) {
        console.error('Error deleting note:', error);
        res.status(500).send('Failed to delete note');
    }
});
