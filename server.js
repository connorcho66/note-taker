const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 3001;
const fs = require('fs');
const app = express();
const uuid = require('./helper/uuid')

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/', (req, res) => {
    console.info(`${req.method} access granted!`);

    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/notes', (req, res) => {
    console.info(`${req.method} accessed notes!`)
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get("/api/notes", (req, res) => {
    
    console.info(`${req.method} request to access all notes granted`);

    fs.readFile('./db/db.json', "utf8", function(err, data){
        if(err){
            console.log(err);
        }else {
            res.json(JSON.parse(data));
        }
    });
});

app.post('/api/notes', (req, res) => {

    console.info(`${req.method} successfully added a note`);

    const { title, text } = req.body;

  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuid(),
    };

    fs.readFile('./db/db.json', `utf-8`, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        const notes = JSON.parse(data);
        notes.push(newNote);

        fs.writeFile(`./db/db.json`, JSON.stringify(notes, null, `\t`), (err) =>
          err
            ? console.error(err)
            : console.log(
              `Notes for ${newNote.title} has been written to JSON file`
            )
        );
      }
    })

    const response = {
      status: 'success',
      body: newNote,
    };

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json('Error in posting note');
  }
});

app.listen(PORT, () => console.log('App is now listening to the port http://localhost:3001'));