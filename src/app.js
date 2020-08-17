const express = require('express')
const cors = require('cors')
const { uuid } = require('uuidv4')

const app = express()

app.use(express.json())
app.use(cors())

const repositories = []

app.get('/repositories', (request, response) => {
  return response.json(repositories)
})

app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body
  const repository = {
    id: uuid(),
    title: title,
    url: url,
    techs: techs,
    likes: 0,
  }
  repositories.push(repository)

  return response.status(201).json(repository)
})

app.put('/repositories/:id', (request, response) => {
  const { id } = request.params
  const { title, url, techs } = request.body

  const findRepoIndex = repositories.findIndex((repo) => repo.id === id)

  if (findRepoIndex < 0) {
    return response.status(400).json({ error: 'Repository not found' })
  }

  repositories[findRepoIndex].title = title
  repositories[findRepoIndex].url = url
  repositories[findRepoIndex].techs = techs

  return response.json(repositories[findRepoIndex])
})

app.delete('/repositories/:id', (request, response) => {
  const { id } = request.params
  const findRepoIndex = repositories.findIndex((repo) => repo.id === id)

  if (findRepoIndex < 0) {
    return response.status(400).json({ error: 'Repository not found' })
  }

  repositories.splice(findRepoIndex, 1)

  return response.status(204).send()
})

app.post('/repositories/:id/like', (request, response) => {
  const { id } = request.params

  const findRepoIndex = repositories.findIndex((repo) => repo.id === id)

  if (findRepoIndex < 0) {
    return response.status(400).json({ error: 'Repository not found' })
  }

  repositories[findRepoIndex].likes++

  return response.json({ likes: repositories[findRepoIndex].likes })
})

module.exports = app
