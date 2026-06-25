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

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL ?? 'admin@centrumchabowka.pl'
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? 'Chabowka2026!'

async function main() {
  loadEnvFile()

  const { createUserWithEmailAndPassword, signInWithEmailAndPassword } = await import('firebase/auth')
  const { auth, db } = await import('../src/lib/firebase')
  const { seedCoursesData } = await import('../src/lib/seedCourses')

  try {
    await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD)
  } catch {
    await createUserWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD)
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
