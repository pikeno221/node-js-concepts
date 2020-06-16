const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());
app.use('/repositories/:id', validateRepositoryId);

const repositories = [];

function validateRepositoryId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: 'invalid id' })
  }

  next();

}

app.get("/repositories", (request, response) => {
  return response.json(repositories);

});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = { likes: 0, id: uuid(), title, url, techs };

  repositories.push(repository);

  return response.status(200).json(repository);


});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  let likes;

  const repositoryIndex = findRepositoryIndexById(id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'repository not found' });
  }

  const repositoryStorage = findRepositoryById(id);

  likes = repositoryStorage.likes;

  const repository = { id, title, url, techs, likes };

  repositories[repositoryIndex] = repository;

  return response.status(200).json(repository);


});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = findRepositoryIndexById(id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'repository not found' });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).json(null);

});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repositoryIndex = findRepositoryIndexById(id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'repository not found' });

  }

  const repository = findRepositoryById(id); 

  repository.likes ++;

  return response.status(200).json(repository);

});

function findRepositoryIndexById(id) {
  return repositories.findIndex(repository => repository.id === id);

}

function findRepositoryById(id) {
  return repositories.find(repository => repository.id === id);

}


module.exports = app;
