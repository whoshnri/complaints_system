import { cookies } from 'next/headers';
import { hash, compare } from 'bcryptjs';
import { createSession, getSessionByToken, deleteSession, getUserByEmail, getUserByUsername, createUser } from './db';

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
  const cookieStore = token ? null : await cookies();
  const sessionToken = token || cookieStore?.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionToken) {
    return null;
  }

  try {
    const session = await getSessionByToken(sessionToken);
    if (!session) {
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

export async function registerUser(email: string | null, username: string, password: string, role: string = 'student') {
  // Check if username already exists
  const existingUserByUsername = await getUserByUsername(username);
  if (existingUserByUsername) {
    throw new Error('Username already in use');
  }

  // Check if email already exists (if provided)
  if (email) {
    const existingUserByEmail = await getUserByEmail(email);
    if (existingUserByEmail) {
      throw new Error('Email already in use');
    }
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Create user
  const user = await createUser(email, passwordHash, username, role);

  // Create session
  await createSessionToken(user.id);

  return user;
}

export async function loginUser(usernameOrEmail: string, password: string) {
  // Try to get user by email first, then by username
  let user = usernameOrEmail.includes('@') 
    ? await getUserByEmail(usernameOrEmail)
    : await getUserByUsername(usernameOrEmail);

  // If not found by email, try username
  if (!user && usernameOrEmail.includes('@')) {
    user = await getUserByUsername(usernameOrEmail);
  }

  console.log(user);
  if (!user) {
    throw new Error('Invalid username/email or password');
  }

  // Verify password
  const isValidPassword = await verifyPassword(password, user.password_hash);
  if (!isValidPassword) {
    throw new Error('Invalid username/email or password');
  }

  // Create session
  await createSessionToken(user.id);

  return { id: user.id, email: user.email, username: user.username };
}
