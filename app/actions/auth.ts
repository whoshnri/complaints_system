'use server';

import { redirect } from 'next/navigation';
import { registerUser, loginUser, logout as logoutUser } from '@/lib/auth';

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
    const message = error instanceof Error ? error.message : 'An error occurred';
    return { error: message };
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
    const message = error instanceof Error ? error.message : 'An error occurred';
    console.log(error);
    return { error: message };
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
