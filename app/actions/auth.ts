'use server';

import { redirect, unstable_rethrow } from 'next/navigation';
import { registerUser, registerSchoolAccount, loginUser, loginSchoolAccount, logout as logoutUser } from '@/lib/auth';

const SAFE_AUTH_ERRORS = new Set([
  'Email already in use',
  'Username already in use',
  'Invalid username or password',
  'School account access required',
  'School account is not linked to a school profile',
]);

function handleAuthError(error: unknown, context: string) {
  unstable_rethrow(error);

  if (error instanceof Error && SAFE_AUTH_ERRORS.has(error.message)) {
    return { error: error.message };
  }

  console.error(`${context} failed`, {
    errorType: error instanceof Error ? error.name : typeof error,
  });

  return { error: 'Something went wrong. Please try again.' };
}

export async function signUp(formData: FormData) {
  try {
    const email = (formData.get('email') as string) || '';
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    // Validation
    if (!username || !password || !confirmPassword) {
      return { error: 'Username and password fields are required' };
    }

    if (password !== confirmPassword) {
      return { error: 'Passwords do not match' };
    }

    if (password.length < 8) {
      return { error: 'Password must be at least 8 characters' };
    }

    if (username.length < 2 || username.length > 30) {
      return { error: 'Username must be between 2 and 30 characters' };
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return { error: 'Invalid email address' };
      }
    }

    // Register user
    await registerUser(username, password, email || undefined);

    // Redirect to feed
    redirect('/feed');
  } catch (error) {
    return handleAuthError(error, 'Sign up');
  }
}

export async function signIn(formData: FormData) {
  try {
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    // Validation
    if (!username || !password) {
      return { error: 'Username and password are required' };
    }

    // Login user
    await loginUser(username, password);

    // Redirect to feed
    redirect('/feed');
  } catch (error) {
    return handleAuthError(error, 'Sign in');
  }
}

export async function schoolSignIn(formData: FormData) {
  try {
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    if (!username || !password) {
      return { error: 'Username and password are required' };
    }

    await loginSchoolAccount(username, password);

    redirect('/school/dashboard');
  } catch (error) {
    return handleAuthError(error, 'School sign in');
  }
}

export async function schoolSignUp(formData: FormData) {
  try {
    const email = ((formData.get('email') as string) || '').trim();
    const schoolName = ((formData.get('schoolName') as string) || '').trim();
    const faculty = ((formData.get('faculty') as string) || '').trim();
    const description = ((formData.get('description') as string) || '').trim();
    const username = ((formData.get('username') as string) || '').trim();
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (!schoolName || !username || !password || !confirmPassword) {
      return { error: 'School name, username, and password fields are required' };
    }

    if (password !== confirmPassword) {
      return { error: 'Passwords do not match' };
    }

    if (password.length < 8) {
      return { error: 'Password must be at least 8 characters' };
    }

    if (username.length < 2 || username.length > 30) {
      return { error: 'Username must be between 2 and 30 characters' };
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return { error: 'Invalid email address' };
      }
    }

    await registerSchoolAccount(
      schoolName,
      faculty || undefined,
      description || undefined,
      username,
      password,
      email || undefined
    );
    redirect('/school-login?created=1');
  } catch (error) {
    return handleAuthError(error, 'School sign up');
  }
}

export async function logout() {
  try {
    await logoutUser();
    redirect('/login');
  } catch (error) {
    console.error('Logout error:', error);
    redirect('/login');
  }
}

export async function logoutAction() {
  try {
    await logoutUser();
    redirect('/login');
  } catch (error) {
    console.error('Logout error:', error);
    redirect('/login');
  }
}
