const fs = require('fs');
const express = require('express');
const PORT = process.env.PORT || 3001;
const path = require('path');
const app = express();
const SavedNotes = require('./db/db.json');


app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(express.static('public'));

app.get('/api/notes', (req ,res) => {
  res.sendFile(path.join(__dirname, './db/db.json'))
})
app.get('/', (req ,res) => {
  res.sendFile(path.join(__dirname, './public/index.html'))
})
app.get('/notes', (req ,res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'))
})
app.get('*', (req ,res) => {
  res.sendFile(path.join(__dirname, './public/index.html'))
}) 


// creates and pushes the new created note to the db.json file
function createNewNote(body) {
  const newNote = body;

  const savedNotes = JSON.parse(fs.readFileSync(path.join(__dirname, './db/db.json')));
  newNote.id = savedNotes.length;
  fs.writeFileSync(
      path.join(__dirname, './db/db.json'),
      JSON.stringify([...savedNotes, newNote], null, 2)
  );
  return newNote;
}

app.post('/api/notes', (req, res) => {
  const newNote = createNewNote(req.body);
  res.json(newNote);
});


function deleteNote(id, notesArray) {
  for (let i = 0; i < notesArray.length; i++) {
      let note = notesArray[i];

      if (note.id == id) {
          notesArray.splice(i, 1);
          fs.writeFileSync(
              path.join(__dirname, './db/db.json'),
              JSON.stringify(notesArray, null, 2)
          );

          break;
      }
  }
}

app.delete('/api/notes/:id', (req, res) => {
  deleteNote(req.params.id, SavedNotes);
  res.json(true);
});


app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
  });
  