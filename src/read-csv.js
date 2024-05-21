import { parse } from 'csv-parse'
import fs from 'node:fs'

const filePath = new URL('../tasks-to-create.csv', import.meta.url)

async function processFile() {
  const parser = fs
    .createReadStream(filePath)
    .pipe(parse({
      fromLine: 2
    }))

  for await (const record of parser) {
    console.log(record)
    
    await fetch('http://localhost:3333/tasks', {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        title: record[0],
        description: record[1],
      })
    })
  }
}

(async () => await processFile())()