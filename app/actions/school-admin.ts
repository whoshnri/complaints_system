'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import {
  createAdminCommentForSchool,
  getComplaintForSchoolAdmin,
  getComments,
  getComplaintsBySchoolForAdmin,
  getSchoolDashboardData,
  getUserBySessionToken,
} from '@/lib/db';

const COOKIE_NAME = 'voiceit_session';

async function getCurrentSchoolAccount() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(COOKIE_NAME)?.value;
  if (!sessionToken) return null;

  const user = await getUserBySessionToken(sessionToken);
  if (!user || (user.role !== 'school' && !user.is_school_account) || !user.school_id) {
    return null;
  }

  return user;
}

export async function getSchoolDashboardAction() {
  try {
    const schoolAccount = await getCurrentSchoolAccount();
    if (!schoolAccount) return { data: null, error: 'School account access required' };

    const dashboard = await getSchoolDashboardData(schoolAccount.school_id);
    return { data: { ...dashboard, schoolAccount }, error: null };
  } catch (error) {
    console.error('Error loading school dashboard:', error);
    return { data: null, error: 'Failed to load school dashboard' };
  }
}

export async function getSchoolComplaintsAction() {
  try {
    const schoolAccount = await getCurrentSchoolAccount();
    if (!schoolAccount) return { data: null, error: 'School account access required' };

    const complaints = await getComplaintsBySchoolForAdmin(schoolAccount.school_id);
    return { data: { complaints, schoolAccount }, error: null };
  } catch (error) {
    console.error('Error loading school complaints:', error);
    return { data: null, error: 'Failed to load school complaints' };
  }
}

export async function getSchoolComplaintDetailAction(complaintId: number) {
  try {
    const schoolAccount = await getCurrentSchoolAccount();
    if (!schoolAccount) return { data: null, error: 'School account access required' };

    const [complaint, comments] = await Promise.all([
      getComplaintForSchoolAdmin(complaintId, schoolAccount.school_id),
      getComments(complaintId),
    ]);
    if (!complaint) return { data: null, error: 'Complaint not found for your school' };

    return { data: { complaint, comments, schoolAccount }, error: null };
  } catch (error) {
    console.error('Error loading school complaint detail:', error);
    return { data: null, error: 'Failed to load complaint detail' };
  }
}

export async function createAdminResponseAction(complaintId: number, content: string) {
  try {
    const schoolAccount = await getCurrentSchoolAccount();
    if (!schoolAccount) return { data: null, error: 'School account access required' };
    if (!schoolAccount.verified_school) {
      return { data: null, error: 'Your school account is pending verification. You can review complaints, but responses are read-only for now.' };
    }
    if (!content || content.trim().length === 0) {
      return { data: null, error: 'Official response cannot be empty' };
    }

    const comment = await createAdminCommentForSchool(
      complaintId,
      schoolAccount.id,
      schoolAccount.school_id,
      content.trim()
    );
    if (!comment) return { data: null, error: 'Complaint not found for your school' };

    revalidatePath('/school/dashboard');
    revalidatePath('/school/complaints');
    revalidatePath(`/complaint/${complaintId}`);

    return { data: comment, error: null };
  } catch (error) {
    console.error('Error posting official response:', error);
    return { data: null, error: 'Failed to post official response' };
  }
}
