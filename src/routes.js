import { randomUUID } from 'node:crypto'
import { Database } from "./database.js"

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: '/tasks',
    handler: (req, res) => {
      const tasks = database.select('tasks')

      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'POST',
    path: '/tasks',
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
]