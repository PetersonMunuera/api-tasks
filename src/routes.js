import { randomUUID } from 'node:crypto'
import { Database } from "./database.js"
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query

      const tasks = database.select('tasks', search ? {
        title: search,
        description: search,
      }: null)

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

        const taskToUpdate = database.getById('tasks', id)

        if (taskToUpdate) {
          const {
            title = taskToUpdate.title,
            description = taskToUpdate.description
          } = req.body

          database.update('tasks', id, {
            title,
            description,
            updated_at: new Date(),
          })

          return res.writeHead(200).end()
        } else {
          throw new Error('id not found')
        }
      } catch (error) {
        return res.writeHead(400).end(error.message)
      }
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      try {
        const { id } = req.params

        const taskToUpdate = database.getById('tasks', id)

        if (taskToUpdate) {

          database.update('tasks', id, {
            completed_at: taskToUpdate.completed_at ? null : new Date(),
            updated_at: new Date(),
          })

          return res.writeHead(200).end()
        } else {
          throw new Error('id not found')
        }
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

        const taskToDelete = database.getById('tasks', id)

        if (taskToDelete) {
          database.delete('tasks', id)
        } else {
          throw new Error('id not found')
        }

        return res.writeHead(204).end()
      } catch (error) {
        return res.writeHead(400).end(error.message)
      }
    }
  },
]