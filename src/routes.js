import { randomUUID } from 'node:crypto'
import { Database } from "./database.js"
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const tasks = database.select('tasks')

      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      try {
        const { title, description } = req.body

        if (title && description) {
          const task = {
            id: randomUUID(),
            title,
            description,
            completed_at: null,
            created_at: new Date(),
            updated_at: new Date(),
          }

          database.insert('tasks', task)

          return res.writeHead(201).end()
        } else {
          throw new Error('title and description required')
        }
      } catch (error) {
        return res.writeHead(400).end(error.message)
      }
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      try {
        const { id } = req.params
        const { title, description } = req.body

        database.update('tasks', id, {
          title, 
          description,
          updated_at: new Date(),
        })
        
        return res.writeHead(200).end()
      } catch (error) {
        return res.writeHead(400).end(error.message)
      }
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      try {
        const { id } = req.params

        database.delete('tasks', id)
        return res.writeHead(204).end()
      } catch (error) {
        return res.writeHead(400).end(error.message)
      }
    }
  },
]