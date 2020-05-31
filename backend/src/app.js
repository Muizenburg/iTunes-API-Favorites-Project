const express = require("express");
const helmet = require('helmet')
const app = express();
const Joi = require("joi");
const cors = require("cors");

//middleware
app.use(helmet())
app.use(express.static("pages"));
app.use(cors());
app.use(express.json());

//list of webprojects
const webprojects = [
  {
    "id": 1,
    "artist": "Test 1 artist",
    "trackName": "Test 1 Track Name",
    "mediaType": "Song"
  },
  {
    "id": 2,
    "artist": "Test 2 artist",
    "trackName": "Test 2 Track Name",
    "mediaType": "ebook"
  }
];

//reads the list of webprjects and sends it to the /api path
app.get("/api", (req, res) => {
  res.send(webprojects);
});

//enables path api/id to be used to only view the selected id (1 for example is the react game webproject)
app.get("/api/:id", (req, res) => {
  const webproject = webprojects.find((c) => c.id === parseInt(req.params.id));
  if (!webproject) {
    res.status(404).send("the given id is not found ...");
    return;
  }
  res.send(webproject);
});

//enables user to create an entirely now web project and also provisions the id to be automatically allocated
app.post("/api", (req, res) => {
  const schema = {
    artist: Joi.string().min(2).required(),
    trackName: Joi.string().min(2).required(),
    mediaType: Joi.string().min(2).required(),
  };

  const result = Joi.validate(req.body, schema);
  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  const newProject = {
    id: webprojects.length + 1,
    artist: req.body.artist,
    trackName: req.body.trackName,
    mediaType: req.body.mediaType,
  };

  webprojects.push(newProject);
  res.send(newProject);
});

app.put("/api/:id", (req, res) => {

  // look up the id/project
  // if the id/project deosnt exist we need to return a 404 (resource not found) error
  const webproject = webprojects.find((c) => c.id === parseInt(req.params.id));
  if (!webproject) {
    res.status(404).send("the given id is not found ...");
    return;
  }
  // validate the project to see if it is good shape
  // if invalid return 400 -- bad request

  const schema = {
    title: Joi.string().min(2).required(),
    description: Joi.string().min(2).required(),
    website: Joi.string().min(2).required(),
  };

  const result = Joi.validate(req.body, schema);
  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  //if validated passes then return the updated course
 
  webproject.artist = req.body.artist;
  webproject.trackName = req.body.trackName;
  webproject.mediaType = req.body.mediaType;

  res.send(webproject)

});

app.delete("/api/:id", (req, res) => {
  const webproject = webprojects.find((c) => c.id === parseInt(req.params.id));
  if (!webproject) {
    res.status(404).send("the given id is not found ...");
    return;
  }
  const index = webprojects.indexOf(webproject);
  webprojects.splice(index, 1);
  res.send(webproject);

});

// port is dynimically added as an enviromental variable, or will automically just be rendered on port 8080
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
