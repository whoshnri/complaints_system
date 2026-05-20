'use server';

import { cookies } from 'next/headers';
import {
  getComplaints,
  getComplaintsByFollowedSchools,
  getAllSchools,
  getComplaintById,
  getComments,
  upvoteComplaint,
  removeUpvote,
  bookmarkComplaint,
  removeBookmark,
  getUserIdFromSession,
  createComplaint,
  searchComplaints,
  followSchool,
  unfollowSchool,
  getUserFollowedSchools,
  isFollowingSchool,
} from '@/lib/db';
import { Complaint } from '../(protected)/feed/components/feed-content';

const COOKIE_NAME = 'voiceit_session';

async function getAuthedUserId() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(COOKIE_NAME)?.value;
  if (!sessionToken) return null;
  return await getUserIdFromSession(sessionToken);
}

// Feed
export async function getFeedAction() {
  try {
    const userId = await getAuthedUserId();
    if (!userId) {
      return { data: [], error: 'Not authenticated', empty: false };
    }
    const complaints = await getComplaintsByFollowedSchools(String(userId), 30, 0);
    return { data: complaints as Complaint[], error: null, empty: complaints.length === 0 };
  } catch (error) {
    console.error('Error fetching feed:', error);
    return { data: [], error: 'Failed to load feed', empty: false };
  }
}

// All complaints (for unauthenticated or future use)
export async function getComplaintsAction(schoolId?: string) {
  try {
    const complaints = await getComplaints(schoolId, 20, 0);
    return { data: complaints, error: null };
  } catch (error) {
    console.error('Error fetching complaints:', error);
    return { data: null, error: 'Failed to load complaints' };
  }
}

export async function getSchoolsAction() {
  try {
    const schools = await getAllSchools();
    return { data: schools, error: null };
  } catch (error) {
    console.error('Error fetching schools:', error);
    return { data: null, error: 'Failed to load schools' };
  }
}

export async function getFollowedSchoolsAction() {
  try {
    const userId = await getAuthedUserId();
    if (!userId) return { data: [], error: 'Not authenticated' };
    const schools = await getUserFollowedSchools(String(userId));
    return { data: schools, error: null };
  } catch (error) {
    console.error('Error fetching followed schools:', error);
    return { data: null, error: 'Failed to load followed schools' };
  }
}

export async function followSchoolAction(schoolId: number) {
  try {
    const userId = await getAuthedUserId();
    if (!userId) return { data: null, error: 'Not authenticated' };
    await followSchool(userId, schoolId);
    return { data: { success: true }, error: null };
  } catch (error) {
    console.error('Error following school:', error);
    return { data: null, error: 'Failed to follow school' };
  }
}

export async function unfollowSchoolAction(schoolId: number) {
  try {
    const userId = await getAuthedUserId();
    if (!userId) return { data: null, error: 'Not authenticated' };
    await unfollowSchool(userId, schoolId);
    return { data: { success: true }, error: null };
  } catch (error) {
    console.error('Error unfollowing school:', error);
    return { data: null, error: 'Failed to unfollow school' };
  }
}

export async function getComplaintByIdAction(complaintId: number) {
  try {
    const userId = await getAuthedUserId();
    const complaint = await getComplaintById(complaintId, userId);
    return { data: complaint, error: null };
  } catch (error) {
    console.error('Error fetching complaint:', error);
    return { data: null, error: 'Failed to load complaint' };
  }
}

export async function getCommentsAction(complaintId: number) {
  try {
    const comments = await getComments(complaintId);
    return { data: comments, error: null };
  } catch (error) {
    console.error('Error fetching comments:', error);
    return { data: null, error: 'Failed to load comments' };
  }
}

export async function upvoteComplaintAction(complaintId: number) {
  try {
    const userId = await getAuthedUserId();
    if (!userId) return { data: null, error: 'Not authenticated' };
    await upvoteComplaint(complaintId, userId);
    return { data: { success: true }, error: null };
  } catch (error) {
    console.error('Error upvoting complaint:', error);
    return { data: null, error: 'Failed to upvote' };
  }
}

export async function removeUpvoteAction(complaintId: string) {
  try {
    const userId = await getAuthedUserId();
    if (!userId) return { data: null, error: 'Not authenticated' };
    await removeUpvote(complaintId, String(userId));
    return { data: { success: true }, error: null };
  } catch (error) {
    console.error('Error removing upvote:', error);
    return { data: null, error: 'Failed to remove upvote' };
  }
}

export async function bookmarkComplaintAction(complaintId: number) {
  try {
    const userId = await getAuthedUserId();
    if (!userId) return { data: null, error: 'Not authenticated' };
    await bookmarkComplaint(complaintId, userId);
    return { data: { success: true }, error: null };
  } catch (error) {
    console.error('Error bookmarking complaint:', error);
    return { data: null, error: 'Failed to bookmark' };
  }
}

export async function removeBookmarkAction(complaintId: number) {
  try {
    const userId = await getAuthedUserId();
    if (!userId) return { data: null, error: 'Not authenticated' };
    await removeBookmark(complaintId, userId);
    return { data: { success: true }, error: null };
  } catch (error) {
    console.error('Error removing bookmark:', error);
    return { data: null, error: 'Failed to remove bookmark' };
  }
}

export async function createComplaintAction(
  schoolId: number,
  title: string,
  description: string,
  isPublic: boolean = true,
  category?: string
) {
  try {
    const userId = await getAuthedUserId();
    if (!userId) return { data: null, error: 'Not authenticated' };

    if (!title || title.trim().length === 0) return { data: null, error: 'Title is required' };
    if (!description || description.trim().length === 0) return { data: null, error: 'Description is required' };
    if (title.length > 200) return { data: null, error: 'Title must be less than 200 characters' };

    const complaint = await createComplaint(userId, schoolId, title, description, isPublic, category);
    return { data: complaint, error: null };
  } catch (error) {
    console.error('Error creating complaint:', error);
    return { data: null, error: 'Failed to create complaint' };
  }
}

export async function searchComplaintsAction(query: string) {
  try {
    if (!query || query.trim().length === 0) return { data: [], error: null };
    const results = await searchComplaints(query, 50);
    const enrichedResults = results.map((complaint: any) => ({
      ...complaint,
      upvote_count: complaint.upvote_count || 0,
      comment_count: complaint.comment_count || 0,
    }));
    return { data: enrichedResults, error: null };
  } catch (error) {
    console.error('Error searching complaints:', error);
    return { data: [], error: 'Failed to search complaints' };
  }
}
