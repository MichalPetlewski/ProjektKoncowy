const express = require('express');
require('dotenv').config()
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors') // SETUP CORS

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const noteSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Note = mongoose.model('Note', noteSchema);

app.use(bodyParser.json());

app.post('/api/notes', async (req, res) => {
  const { title, content } = req.body;
  const note = new Note({
    title,
    content,
  });
  await note.save();
  res.json(note);
});

app.get('/api/notes', async (req, res) => {
  const notes = await Note.find();
  res.json(notes);
});

app.put('/api/notes/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const updatedNote = await Note.findByIdAndUpdate(id, { title, content }, { new: true });
  res.json(updatedNote);
});

app.delete('/api/notes/:id', async (req, res) => {
  const { id } = req.params;
  console.log(id);
  await Note.findByIdAndDelete(id);
  res.json({ message: 'Note removed' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
