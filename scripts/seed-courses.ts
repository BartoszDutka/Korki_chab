import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

function loadEnvFile() {
  const envPath = resolve(process.cwd(), '.env')
  const content = readFileSync(envPath, 'utf8')
  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    process.env[key] = value
  }
}

function requiredEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}. Add it to your local .env file.`)
  }
  return value
}

async function main() {
  loadEnvFile()
  const adminEmail = requiredEnv('SEED_ADMIN_EMAIL')
  const adminPassword = requiredEnv('SEED_ADMIN_PASSWORD')

  const { createUserWithEmailAndPassword, signInWithEmailAndPassword } = await import('firebase/auth')
  const { auth, db } = await import('../src/lib/firebase')
  const { seedCoursesData } = await import('../src/lib/seedCourses')

  try {
    await signInWithEmailAndPassword(auth, adminEmail, adminPassword)
  } catch {
    await createUserWithEmailAndPassword(auth, adminEmail, adminPassword)
  }

  const count = await seedCoursesData(db)
  if (count > 0) {
    console.log(`✓ Dodano lub opublikowano ${count} zajęć w Firestore.`)
  } else {
    console.log('Wszystkie przykładowe zajęcia są już w bazie.')
  }
}

main().catch((error) => {
  console.error('Błąd seedowania zajęć:', error)
  process.exit(1)
})
