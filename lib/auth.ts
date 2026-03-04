import { cookies } from 'next/headers';
import { hash, compare } from 'bcryptjs';
import { createSession, getSessionByToken, deleteSession, getUserByEmail, createUser } from './db';

const SESSION_COOKIE_NAME = 'voiceit_session';
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return compare(password, hash);
}

export async function generateSessionToken(): Promise<string> {
  return require('crypto').randomBytes(32).toString('hex');
}

export async function createSessionToken(userId: string): Promise<string> {
  const token = await generateSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_DURATION);

  await createSession(userId, token, expiresAt);

  // Set HTTP-only cookie
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION / 1000,
    path: '/',
  });

  return token;
}

export async function getSessionUser(token?: string) {
  try {
    const cookieStore = await cookies();
    const sessionToken = token || cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionToken) {
      return null;
    }

    const session = await getSessionByToken(sessionToken);
    if (!session) {
      // Token invalid or expired, clear cookie
      cookieStore.delete(SESSION_COOKIE_NAME);
      return null;
    }

    return session;
  } catch (error) {
    console.error('Error getting session user:', error);
    return null;
  }
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    await deleteSession(token);
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function registerUser(email: string, username: string, password: string) {
  // Check if user already exists
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    throw new Error('Email already in use');
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Create user
  const user = await createUser(email, passwordHash, username);

  // Create session
  await createSessionToken(user.id);

  return user;
}

export async function loginUser(email: string, password: string) {
  // Get user
  const user = await getUserByEmail(email);
  console.log(user);
  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Verify password
  const isValidPassword = await verifyPassword(password, user.password_hash);
  if (!isValidPassword) {
    throw new Error('Invalid email or password');
  }

  // Create session
  await createSessionToken(user.id);

  return { id: user.id, email: user.email, username: user.username };
}
