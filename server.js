const express = require('express');
const path = require('path');
const { readFromFile, readAndAppend } = require('./helpers/fsUtils');
const { v4: uuidv4 } = require('uuid');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

//Get route for api/notes

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) =>{
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
  });


app.post('/api/notes', (req, res)=>{
    const { title, text } = req.body;

    if(req.body){
        const newNote = {
            title,
            text,
            id: uuidv4(),
        }

        readAndAppend(newNote, './db/db.json');
        res.json('Added new note');
    } else {
        res.error('Error in adding note')
    }
})  
//Get route for index.html
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);

