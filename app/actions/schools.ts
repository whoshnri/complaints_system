'use server';

import { cookies } from 'next/headers';
import { followSchool, unfollowSchool, getUserIdFromSession } from '@/lib/db';

export async function followSchoolAction(schoolId: number) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session')?.value;

    if (!sessionToken) {
      return { data: null, error: 'Not authenticated' };
    }

    const userId = await getUserIdFromSession(sessionToken);
    if (!userId) {
      return { data: null, error: 'Session expired' };
    }

    await followSchool(userId, schoolId);
    return { data: { success: true }, error: null };
  } catch (error) {
    console.error('Error following school:', error);
    return { data: null, error: 'Failed to follow school' };
  }
}

export async function unfollowSchoolAction(schoolId: number) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session')?.value;

    if (!sessionToken) {
      return { data: null, error: 'Not authenticated' };
    }

    const userId = await getUserIdFromSession(sessionToken);
    if (!userId) {
      return { data: null, error: 'Session expired' };
    }

    await unfollowSchool(userId, schoolId);
    return { data: { success: true }, error: null };
  } catch (error) {
    console.error('Error unfollowing school:', error);
    return { data: null, error: 'Failed to unfollow school' };
  }
}
