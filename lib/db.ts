import { Bookmark } from '@/app/(protected)/bookmarks/components/bookmarks-content';
import { sql } from '@vercel/postgres';

// Users
export async function createUser(email: string, passwordHash: string, username: string) {
  console.log('[db] createUser', { email, username });
  const result = await sql`
    INSERT INTO users (email, password_hash, username, created_at)
    VALUES (${email}, ${passwordHash}, ${username}, NOW())
    RETURNING id, email, username, created_at
  `;
  console.log('[db] createUser result', result.rows[0]);
  return result.rows[0];
}

export async function getUserByEmail(email: string) {
  console.log('[db] getUserByEmail', { email });
  const result = await sql`
    SELECT id, email, password_hash, username, created_at
    FROM users
    WHERE email = ${email}
    LIMIT 1
  `;
  console.log('[db] getUserByEmail result', result.rows[0] ?? null);
  return result.rows[0];
}

export async function getUserById(userId: string) {
  console.log('[db] getUserById', { userId });
  const result = await sql`
    SELECT id, email, username, created_at
    FROM users
    WHERE id = ${userId}
    LIMIT 1
  `;
  console.log('[db] getUserById result', result.rows[0] ?? null);
  return result.rows[0];
}

// Sessions
export async function createSession(userId: string, token: string, expiresAt: Date) {
  console.log('[db] createSession', { userId, expiresAt });
  const result = await sql`
    INSERT INTO sessions (user_id, session_token, expires_at, created_at)
    VALUES (${userId}, ${token}, ${expiresAt.toISOString()}, NOW())
    RETURNING id, user_id, session_token, expires_at
  `;
  console.log('[db] createSession result', result.rows[0]);
  return result.rows[0];
}

export async function getSessionByToken(token: string) {
  console.log('[db] getSessionByToken', { token: token.slice(0, 8) + '...' });
  const result = await sql`
    SELECT id, user_id, session_token, expires_at, created_at
    FROM sessions
    WHERE session_token = ${token} AND expires_at > NOW()
    LIMIT 1
  `;
  console.log('[db] getSessionByToken result', result.rows[0] ?? null);
  return result.rows[0];
}

export async function deleteSession(token: string) {
  console.log('[db] deleteSession', { token: token.slice(0, 8) + '...' });
  await sql`
    DELETE FROM sessions
    WHERE session_token = ${token}
  `;
  console.log('[db] deleteSession done');
}

// Schools
export async function createSchool(name: string, description?: string) {
  console.log('[db] createSchool', { name, description });
  const result = await sql`
    INSERT INTO schools (name, description, created_at)
    VALUES (${name}, ${description || null}, NOW())
    RETURNING id, name, description, created_at
  `;
  console.log('[db] createSchool result', result.rows[0]);
  return result.rows[0];
}

export async function getAllSchools() {
  console.log('[db] getAllSchools');
  const result = await sql`
    SELECT id, name, description, created_at
    FROM schools
    ORDER BY name ASC
  `;
  console.log('[db] getAllSchools result count', result.rows.length);
  return result.rows;
}

export async function getSchoolById(schoolId: string) {
  console.log('[db] getSchoolById', { schoolId });
  const result = await sql`
    SELECT id, name, description, created_at
    FROM schools
    WHERE id = ${schoolId}
    LIMIT 1
  `;
  console.log('[db] getSchoolById result', result.rows[0] ?? null);
  return result.rows[0];
}

// School Followers
export async function followSchool(userId: number, schoolId: number) {
  console.log('[db] followSchool', { userId, schoolId });
  const result = await sql`
    INSERT INTO school_followers (user_id, school_id, created_at)
    VALUES (${userId}, ${schoolId}, NOW())
    ON CONFLICT (user_id, school_id) DO NOTHING
    RETURNING id, user_id, school_id
  `;
  console.log('[db] followSchool result', result.rows[0] ?? 'conflict/no-op');
  return result.rows[0];
}

export async function unfollowSchool(userId: number, schoolId: number) {
  console.log('[db] unfollowSchool', { userId, schoolId });
  await sql`
    DELETE FROM school_followers
    WHERE user_id = ${userId} AND school_id = ${schoolId}
  `;
  console.log('[db] unfollowSchool done');
}

export async function getUserFollowedSchools(userId: string) {
  console.log('[db] getUserFollowedSchools', { userId });
  const result = await sql`
    SELECT s.id, s.name, s.description, s.created_at
    FROM schools s
    INNER JOIN school_followers sf ON s.id = sf.school_id
    WHERE sf.user_id = ${userId}
    ORDER BY s.name ASC
  `;
  console.log('[db] getUserFollowedSchools result count', result.rows.length);
  return result.rows;
}

export async function isFollowingSchool(userId: string, schoolId: string) {
  console.log('[db] isFollowingSchool', { userId, schoolId });
  const result = await sql`
    SELECT 1
    FROM school_followers
    WHERE user_id = ${userId} AND school_id = ${schoolId}
    LIMIT 1
  `;
  const following = result.rows.length > 0;
  console.log('[db] isFollowingSchool result', following);
  return following;
}

export async function getComplaintsByFollowedSchools(userId: string, limit: number = 20, offset: number = 0) {
  console.log('[db] getComplaintsByFollowedSchools', { userId, limit, offset });
  const result = await sql`
    SELECT c.id, c.user_id, c.school_id, c.title, c.content, c.is_public,
           c.created_at, s.name as school_name,
           (SELECT COUNT(*) FROM upvotes WHERE complaint_id = c.id) as upvote_count,
           (SELECT COUNT(*) FROM comments WHERE complaint_id = c.id) as comment_count
    FROM complaints c
    INNER JOIN schools s ON c.school_id = s.id
    INNER JOIN school_followers sf ON c.school_id = sf.school_id
    WHERE sf.user_id = ${userId}
      AND c.is_public = true
      AND c.deleted_at IS NULL
    ORDER BY c.created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `;
  console.log('[db] getComplaintsByFollowedSchools result count', result.rows.length);
  return result.rows;
}

// Complaints
export async function createComplaint(
  userId: number,
  schoolId: number,
  title: string,
  content: string,
  isPublic: boolean = true
) {
  console.log('[db] createComplaint', { userId, schoolId, title, isPublic });
  const result = await sql`
    INSERT INTO complaints (user_id, school_id, title, content, is_public, created_at)
    VALUES (${userId}, ${schoolId}, ${title}, ${content}, ${isPublic}, NOW())
    RETURNING id, user_id, school_id, title, content, is_public, created_at
  `;
  console.log('[db] createComplaint result', result.rows[0]);
  return result.rows[0];
}

export async function getComplaintById(complaintId: number, userId?: number | null) {
  console.log('[db] getComplaintById', { complaintId, userId });
  const result = await sql`
    SELECT c.id, c.user_id, c.school_id, c.title, c.content, c.is_public, c.created_at,
           s.name as school_name,
           (SELECT COUNT(*) FROM upvotes WHERE complaint_id = c.id) as upvote_count,
           (SELECT COUNT(*) FROM comments WHERE complaint_id = c.id) as comment_count,
           CASE WHEN EXISTS(SELECT 1 FROM upvotes WHERE complaint_id = c.id AND user_id = ${userId || 0}) THEN true ELSE false END as user_upvoted,
           CASE WHEN EXISTS(SELECT 1 FROM bookmarks WHERE complaint_id = c.id AND user_id = ${userId || 0}) THEN true ELSE false END as user_bookmarked
    FROM complaints c
    INNER JOIN schools s ON c.school_id = s.id
    WHERE c.id = ${complaintId} AND c.deleted_at IS NULL
    LIMIT 1
  `;
  console.log('[db] getComplaintById result', result.rows[0] ?? null);
  return result.rows[0];
}

export async function getComplaints(
  schoolId?: string,
  limit: number = 20,
  offset: number = 0
) {
  console.log('[db] getComplaints', { schoolId, limit, offset });
  let query = `
    SELECT c.id, c.user_id, c.school_id, c.title, c.content, c.is_public, 
           c.created_at, s.name as school_name,
           (SELECT COUNT(*) FROM upvotes WHERE complaint_id = c.id) as upvote_count,
           (SELECT COUNT(*) FROM comments WHERE complaint_id = c.id) as comment_count
    FROM complaints c
    INNER JOIN schools s ON c.school_id = s.id
    WHERE c.deleted_at IS NULL AND c.is_public = true
  `;

  if (schoolId) {
    query += ` AND c.school_id = $1`;
  }

  query += ` ORDER BY c.created_at DESC LIMIT $${schoolId ? 2 : 1} OFFSET $${schoolId ? 3 : 2}`;

  const result = await sql.query(query, schoolId ? [schoolId, limit, offset] : [limit, offset]);
  console.log('[db] getComplaints result count', result.rows.length);
  return result.rows;
}

export async function getComplaintsByUser(userId: string) {
  console.log('[db] getComplaintsByUser', { userId });
  const result = await sql`
    SELECT id, user_id, school_id, title, content, is_public, created_at
    FROM complaints
    WHERE user_id = ${userId} AND deleted_at IS NULL
    ORDER BY created_at DESC
  `;
  console.log('[db] getComplaintsByUser result count', result.rows.length);
  return result.rows;
}

export async function deleteComplaint(complaintId: string) {
  console.log('[db] deleteComplaint', { complaintId });
  await sql`
    UPDATE complaints
    SET deleted_at = NOW()
    WHERE id = ${complaintId}
  `;
  console.log('[db] deleteComplaint done');
}

// Comments
export async function createComment(
  complaintId: string,
  userId: string,
  content: string,
  isAdminReply: boolean = false
) {
  console.log('[db] createComment', { complaintId, userId, isAdminReply });
  const result = await sql`
    INSERT INTO comments (complaint_id, user_id, content, is_admin_reply, created_at)
    VALUES (${complaintId}, ${userId}, ${content}, ${isAdminReply}, NOW())
    RETURNING id, complaint_id, user_id, content, is_admin_reply, created_at
  `;
  console.log('[db] createComment result', result.rows[0]);
  return result.rows[0];
}

export async function getCommentsByComplaint(complaintId: string) {
  console.log('[db] getCommentsByComplaint', { complaintId });
  const result = await sql`
    SELECT id, complaint_id, user_id, content, is_admin_reply, created_at
    FROM comments
    WHERE complaint_id = ${complaintId} AND deleted_at IS NULL
    ORDER BY created_at ASC
  `;
  console.log('[db] getCommentsByComplaint result count', result.rows.length);
  return result.rows;
}

export async function deleteComment(commentId: string) {
  console.log('[db] deleteComment', { commentId });
  await sql`
    UPDATE comments
    SET deleted_at = NOW()
    WHERE id = ${commentId}
  `;
  console.log('[db] deleteComment done');
}

// Upvotes
export async function addUpvote(complaintId: string, userId: string) {
  console.log('[db] addUpvote', { complaintId, userId });
  const result = await sql`
    INSERT INTO upvotes (complaint_id, user_id, created_at)
    VALUES (${complaintId}, ${userId}, NOW())
    ON CONFLICT (complaint_id, user_id) DO NOTHING
    RETURNING id, complaint_id, user_id
  `;
  console.log('[db] addUpvote result', result.rows[0] ?? 'conflict/no-op');
  return result.rows[0];
}

export async function removeUpvote(complaintId: string, userId: string) {
  console.log('[db] removeUpvote', { complaintId, userId });
  await sql`
    DELETE FROM upvotes
    WHERE complaint_id = ${complaintId} AND user_id = ${userId}
  `;
  console.log('[db] removeUpvote done');
}

export async function hasUpvoted(complaintId: string, userId: string) {
  console.log('[db] hasUpvoted', { complaintId, userId });
  const result = await sql`
    SELECT 1
    FROM upvotes
    WHERE complaint_id = ${complaintId} AND user_id = ${userId}
    LIMIT 1
  `;
  const upvoted = result.rows.length > 0;
  console.log('[db] hasUpvoted result', upvoted);
  return upvoted;
}

export async function getUpvoteCount(complaintId: string) {
  console.log('[db] getUpvoteCount', { complaintId });
  const result = await sql`
    SELECT COUNT(*) as count
    FROM upvotes
    WHERE complaint_id = ${complaintId}
  `;
  const count = parseInt(result.rows[0].count);
  console.log('[db] getUpvoteCount result', count);
  return count;
}

// Bookmarks
export async function addBookmark(complaintId: string, userId: string) {
  console.log('[db] addBookmark', { complaintId, userId });
  const result = await sql`
    INSERT INTO bookmarks (complaint_id, user_id, created_at)
    VALUES (${complaintId}, ${userId}, NOW())
    ON CONFLICT (complaint_id, user_id) DO NOTHING
    RETURNING id, complaint_id, user_id
  `;
  console.log('[db] addBookmark result', result.rows[0] ?? 'conflict/no-op');
  return result.rows[0];
}

export async function hasBookmarked(complaintId: string, userId: string) {
  console.log('[db] hasBookmarked', { complaintId, userId });
  const result = await sql`
    SELECT 1
    FROM bookmarks
    WHERE complaint_id = ${complaintId} AND user_id = ${userId}
    LIMIT 1
  `;
  const bookmarked = result.rows.length > 0;
  console.log('[db] hasBookmarked result', bookmarked);
  return bookmarked;
}

export async function getUserBookmarks(userId: string) {
  console.log('[db] getUserBookmarks', { userId });
  const result = await sql`
    SELECT c.id, c.user_id, c.school_id, c.title, c.content, c.is_public, 
           c.created_at, s.name as school_name
    FROM complaints c
    INNER JOIN bookmarks b ON c.id = b.complaint_id
    INNER JOIN schools s ON c.school_id = s.id
    WHERE b.user_id = ${userId} AND c.deleted_at IS NULL
    ORDER BY b.created_at DESC
  `;
  console.log('[db] getUserBookmarks result count', result.rows.length);
  return result.rows as Bookmark[];
}

// Comments with user info
export async function getComments(complaintId: number) {
  console.log('[db] getComments', { complaintId });
  const result = await sql`
    SELECT c.id, c.complaint_id, c.user_id, c.content, c.is_admin_reply, c.created_at,
           u.username
    FROM comments c
    LEFT JOIN users u ON c.user_id = u.id
    WHERE c.complaint_id = ${complaintId} AND c.deleted_at IS NULL
    ORDER BY c.created_at ASC
  `;
  console.log('[db] getComments result count', result.rows.length);
  return result.rows;
}

// Upvotes with type compatibility
export async function upvoteComplaint(complaintId: number, userId: number) {
  console.log('[db] upvoteComplaint', { complaintId, userId });
  const result = await sql`
    INSERT INTO upvotes (complaint_id, user_id, created_at)
    VALUES (${complaintId}, ${userId}, NOW())
    ON CONFLICT (complaint_id, user_id) DO NOTHING
    RETURNING id
  `;
  console.log('[db] upvoteComplaint result', result.rows[0] ?? 'conflict/no-op');
  return result.rows[0];
}

// Bookmarks with type compatibility
export async function bookmarkComplaint(complaintId: number, userId: number) {
  console.log('[db] bookmarkComplaint', { complaintId, userId });
  const result = await sql`
    INSERT INTO bookmarks (complaint_id, user_id, created_at)
    VALUES (${complaintId}, ${userId}, NOW())
    ON CONFLICT (complaint_id, user_id) DO NOTHING
    RETURNING id
  `;
  console.log('[db] bookmarkComplaint result', result.rows[0] ?? 'conflict/no-op');
  return result.rows[0];
}

export async function removeBookmark(complaintId: number, userId: number) {
  console.log('[db] removeBookmark', { complaintId, userId });
  await sql`
    DELETE FROM bookmarks
    WHERE complaint_id = ${complaintId} AND user_id = ${userId}
  `;
  console.log('[db] removeBookmark done');
}

// Session helpers
export async function getUserIdFromSession(sessionToken: string) {
  console.log('[db] getUserIdFromSession', { token: sessionToken.slice(0, 8) + '...' });
  const result = await sql`
    SELECT user_id
    FROM sessions
    WHERE session_token = ${sessionToken} AND expires_at > NOW()
    LIMIT 1
  `;
  const userId = result.rows[0]?.user_id || null;
  console.log('[db] getUserIdFromSession result', userId);
  return userId;
}

// Search
export async function searchComplaints(query: string, limit: number = 20) {
  console.log('[db] searchComplaints', { query, limit });
  const result = await sql`
    SELECT c.id, c.user_id, c.school_id, c.title, c.content, c.is_public, c.created_at,
           s.name as school_name,
           (SELECT COUNT(*) FROM upvotes WHERE complaint_id = c.id) as upvote_count,
           (SELECT COUNT(*) FROM comments WHERE complaint_id = c.id) as comment_count
    FROM complaints c
    INNER JOIN schools s ON c.school_id = s.id
    WHERE (c.title ILIKE ${'%' + query + '%'} OR c.content ILIKE ${'%' + query + '%'})
      AND c.deleted_at IS NULL
      AND c.is_public = true
    ORDER BY c.created_at DESC
    LIMIT ${limit}
  `;
  console.log('[db] searchComplaints result count', result.rows.length);
  return result.rows;
}
