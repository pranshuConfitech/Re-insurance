import { randomUUID } from 'crypto'
import { existsSync } from 'fs'
import { mkdir, readFile, unlink, writeFile } from 'fs/promises'
import path from 'path'

export type StoredTokens = {
  accessToken: string
  refreshToken: string
  idToken?: string
  accessTokenExpires: number
}

type TokenCache = Map<string, StoredTokens>

const globalForTokens = globalThis as typeof globalThis & { __authTokenCache?: TokenCache }

if (!globalForTokens.__authTokenCache) {
  globalForTokens.__authTokenCache = new Map()
}

const cache = globalForTokens.__authTokenCache
const STORE_DIR = path.join(process.cwd(), '.auth-tokens')

async function ensureDir() {
  if (!existsSync(STORE_DIR)) {
    await mkdir(STORE_DIR, { recursive: true })
  }
}

function filePath(id: string) {
  return path.join(STORE_DIR, `${id}.json`)
}

export function createTokenId() {
  return randomUUID()
}

export async function saveTokens(id: string, tokens: StoredTokens) {
  cache.set(id, tokens)
  await ensureDir()
  await writeFile(filePath(id), JSON.stringify(tokens), 'utf8')
}

export async function getTokens(id: string): Promise<StoredTokens | null> {
  const cached = cache.get(id)

  if (cached) {
    return cached
  }

  try {
    const raw = await readFile(filePath(id), 'utf8')
    const tokens = JSON.parse(raw) as StoredTokens

    cache.set(id, tokens)

    return tokens
  } catch {
    return null
  }
}

export async function deleteTokens(id: string) {
  cache.delete(id)

  try {
    await unlink(filePath(id))
  } catch {
    // already removed
  }
}

export function stripTokenSecrets<T extends Record<string, unknown>>(token: T): T {
  delete token.accessToken
  delete token.refreshToken
  delete token.idToken

  return token
}
