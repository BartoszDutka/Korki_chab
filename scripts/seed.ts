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

function printRulesHint() {
  console.error(
    '\nBrak uprawnień Firestore. Opublikuj reguły w konsoli Firebase:\n' +
      '  https://console.firebase.google.com/project/korki-c0e8c/firestore/rules\n' +
      'Skopiuj zawartość pliku firestore.rules z projektu i kliknij „Opublikuj”.\n' +
      'Potem uruchom ponownie: npm run seed\n',
  )
}

async function ensureAdminAuth(
  signIn: typeof import('firebase/auth').signInWithEmailAndPassword,
  createUser: typeof import('firebase/auth').createUserWithEmailAndPassword,
  auth: import('firebase/auth').Auth,
  adminEmail: string,
  adminPassword: string,
) {
  console.log('Logowanie do Firebase...')
  try {
    await signIn(auth, adminEmail, adminPassword)
    console.log('Zalogowano jako administrator.')
  } catch {
    try {
      await createUser(auth, adminEmail, adminPassword)
      console.log('Utworzono konto administratora.')
    } catch (error) {
      throw new Error(
        `Nie można zalogować ani utworzyć admina (${adminEmail}). Włącz Email/Password w Firebase Authentication.`,
        { cause: error },
      )
    }
  }
}

async function main() {
  loadEnvFile()
  const adminEmail = requiredEnv('SEED_ADMIN_EMAIL')
  const adminPassword = requiredEnv('SEED_ADMIN_PASSWORD')

  const { createUserWithEmailAndPassword, signInWithEmailAndPassword } = await import('firebase/auth')
  const { auth, db } = await import('../src/lib/firebase')
  const { seedInitialData, isDatabaseEmpty } = await import('../src/lib/seedData')

  await ensureAdminAuth(signInWithEmailAndPassword, createUserWithEmailAndPassword, auth, adminEmail, adminPassword)

  let empty = false
  try {
    empty = await isDatabaseEmpty(db)
  } catch (error) {
    const code = (error as { code?: string }).code
    if (code === 'unavailable' || code === 'not-found') {
      console.error(
        'Firestore nie jest dostępny. Utwórz bazę w konsoli Firebase:\n' +
          '  https://console.firebase.google.com/project/korki-c0e8c/firestore',
      )
      process.exit(1)
    }
    if (code === 'permission-denied') {
      printRulesHint()
      process.exit(1)
    }
    throw error
  }

  if (!empty) {
    console.log('Baza już zawiera dane — seed pominięty.')
    return
  }

  console.log('Tworzenie danych przykładowych...')
  try {
    const created = await seedInitialData(db)

    if (created) {
      console.log('✓ Dane przykładowe zostały utworzone w Firestore.')
      console.log(`  Panel admin: /admin/login`)
      console.log(`  E-mail: ${adminEmail}`)
    } else {
      console.log('Seed nie utworzył danych (baza nie była pusta).')
    }
  } catch (error) {
    const code = (error as { code?: string }).code
    if (code === 'permission-denied') {
      printRulesHint()
      process.exit(1)
    }
    throw error
  }
}

main().catch((error) => {
  console.error('Błąd seedowania:', error)
  process.exit(1)
})
