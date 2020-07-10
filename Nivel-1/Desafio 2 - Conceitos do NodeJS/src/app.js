const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepoId(req,resp,next){
  const { id } = req.params;

  if(!isUuid(id)){
    return resp.status(400).json({error: 'invalid project ID'});
  }

  return next();
}

// app.use('/repositories/:id', validateRepoId);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", validateRepoId, (request, response) => {
  const { id } = request.params;
  const { url, title, techs} = request.body

  const repoIndex = repositories.findIndex( repo => repo.id === id );

  if ( repoIndex < 0){
    return response.status(400).json({ error: 'Project not found.'});
  }

  repo = {
    id,
    url,
    title,
    techs,
    likes: repositories[repoIndex].likes
  }

  repositories[repoIndex] = repo;

  return response.json(repo);
});

app.delete("/repositories/:id", validateRepoId, (req, res) => {
  const { id } = req.params;

  const repoIndex = repositories.findIndex( repo => repo.id === id );

  if ( repoIndex < 0){
    return res.status(400).json({ error: 'Project not found.'});
  }

  repositories.splice(repoIndex, 1);

  return res.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repository = repositories.find(repo => repo.id === id);

  if(!repository){
    return response.status(400).json({error: 'Repo not found'});
  }

  repository.likes += 1;
  return response.json(repository);
});

module.exports = app;
