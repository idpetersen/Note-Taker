//Importing the required packages 
const express = require('express');
const path = require('path');
const {
    readFromFile,
    readAndAppend
} = require('./helpers/fsUtils');
const {
    v4: uuidv4
} = require('uuid');
const fs = require('fs');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use(express.static('public'));

//Get route for notes
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);
//Get route for notes/api
app.get('/api/notes', (req, res) => {
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

//Post route for adding notes
app.post('/api/notes', (req, res) => {
    //Destructuring the request body to set the title and text
    const {
        title,
        text
    } = req.body;

    if (req.body) {
        //Setting new title content, text, content, and assinging a new unique id using the uuid package and uuidv4 method
        const newNote = {
            title,
            text,
            id: uuidv4(),
        }
        //Adding new note with the read and append method
        readAndAppend(newNote, './db/db.json');
        res.json('Added new note');
    } else {
        res.error('Error in adding note')
    }
})

//Delete route for deleting notes
app.delete("/api/notes/:id", (req, res) => {
    fs.readFile("./db/db.json", (err, data) => {
        const notes = JSON.parse(data);
        if (err) {
            throw err
        } else {
            //Filtering out the matching ID from the request and returning the DB without the matching ID note
            const filteredNotes = notes.filter((note) => {
                return note.id !== req.params.id
            });
            //Overwriting the existing db without the filtered note
            fs.writeFile("./db/db.json", JSON.stringify(filteredNotes, null, 4), (err) => {
                if (err) {
                    throw err
                } else {
                    return res.json(filteredNotes)
                }
            });
        }
    });
});

//Get route for index.html
app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

//Connecting to port
app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
);
