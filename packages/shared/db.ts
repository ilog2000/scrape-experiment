import dotenv from 'dotenv'
import pgtools from 'pgtools'
import { Pool } from 'pg'
import { AdDetails, DbRecord } from './models'

dotenv.config()

const DB_NAME = process.env.DB_NAME || 'scrapedb'
const DB_HOST = process.env.DB_HOST || 'localhost'
const DB_PORT = process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432
const DB_USER = process.env.DB_USER || 'postgres'
const DB_PASSWORD = process.env.DB_PASSWORD || ''

const opts = {
  database: DB_NAME,
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  ssl: false,
}

export const pool = new Pool(opts)

export async function createDatabase(): Promise<void> {
  try {
    await pgtools.createdb(
      {
        user: DB_USER,
        host: DB_HOST,
        password: DB_PASSWORD,
        port: DB_PORT,
      },
      DB_NAME,
    )
  } catch (err) {
    console.error(err)
  }
}

export async function databaseExists(): Promise<boolean> {
  try {
    const res = await pool.query(
      `SELECT datname FROM pg_catalog.pg_database WHERE lower(datname) = lower('${DB_NAME}');`,
    )
    return res && res.rows.length > 0
  } catch (err) {
    console.error(err)
    return false
  }
}

export async function createTable(): Promise<void> {
  try {
    await pool.query('CREATE TABLE IF NOT EXISTS ads ( id TEXT NOT NULL PRIMARY KEY, data JSONB NOT NULL );')
  } catch (err) {
    console.error(err)
  }
}

export async function setData(id: string, data: AdDetails): Promise<void> {
  try {
    await pool.query(
      `INSERT INTO ads (id, data) VALUES ('${id}', '${JSON.stringify(
        data,
      )}') ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data;`,
    )
  } catch (err) {
    console.error(err)
  }
}

export async function setDataArray(records: DbRecord[]): Promise<void> {
  try {
    const head = 'INSERT INTO ads (id, data) VALUES '
    const tail = ' ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data;'
    const values = records.map((r) => `('${r.id}', '${JSON.stringify(r.data)}')`).join(',')
    console.log(head + values + tail)
    await pool.query(head + values + tail)
  } catch (err) {
    console.error(err)
  }
}

export async function getData(pageNumber: number = 0, pageSize: number = 20): Promise<DbRecord[]> {
  try {
    const res = await pool.query(`SELECT data FROM ads ORDER BY id OFFSET ${pageNumber * pageSize} LIMIT ${pageSize};`)
    return res.rows.map((row) => ({ id: row.data.id, data: { ...row.data } as AdDetails }) as DbRecord)
  } catch (err) {
    console.error(err)
    return []
  }
}

export async function getDataById(id: string): Promise<DbRecord | null> {
  try {
    const res = await pool.query(`SELECT data FROM ads WHERE id=${id};`)
    return res && res.rows.length > 0 ? ({ id, data: { ...res.rows[0].data } as AdDetails } as DbRecord) : null
  } catch (err) {
    console.error(err)
    return null
  }
}
