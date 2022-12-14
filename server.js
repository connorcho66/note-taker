const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require('util');

const PORT = process.env.PORT || 3001;
const app = express();


app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

const readFromFile = util.promisify(fs.readFile);

app.get('/api/notes', (req, res) => {
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request received to add a notes`);

  const { title, text } = req.body;

  if (title && text) {
    const newNote = {
      title,
      text,
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

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.listen(PORT, () =>
  console.log(`Express server listening on port http://localhost:${PORT} `)
)