import type { Bookmark } from '@/app/(protected)/bookmarks/components/bookmarks-content';
import prisma from './prisma';

type IdInput = string | number | bigint;

function toBigIntId(value: IdInput) {
  return typeof value === 'bigint' ? value : BigInt(value);
}

function toNumberId(value: IdInput | null | undefined) {
  return value == null ? null : Number(value);
}

function toIsoString(value: Date | string | null | undefined) {
  if (!value) return value;
  return value instanceof Date ? value.toISOString() : value;
}

function userRow(user: any, includePassword = false) {
  if (!user) return user;

  return {
    id: toNumberId(user.id),
    email: user.email,
    username: user.username,
    ...(includePassword ? { password_hash: user.passwordHash } : {}),
    created_at: toIsoString(user.createdAt),
  };
}

function sessionRow(session: any) {
  if (!session) return session;

  return {
    id: toNumberId(session.id),
    user_id: toNumberId(session.userId),
    session_token: session.sessionToken,
    expires_at: toIsoString(session.expiresAt),
    created_at: toIsoString(session.createdAt),
  };
}

function schoolRow(school: any) {
  if (!school) return school;

  return {
    id: toNumberId(school.id),
    name: school.name,
    description: school.description,
    created_at: toIsoString(school.createdAt),
  };
}

function complaintRow(complaint: any, extras: Record<string, unknown> = {}) {
  if (!complaint) return complaint;

  return {
    id: toNumberId(complaint.id),
    user_id: toNumberId(complaint.userId),
    school_id: toNumberId(complaint.schoolId),
    title: complaint.title,
    content: complaint.content,
    is_public: complaint.isPublic,
    created_at: toIsoString(complaint.createdAt),
    school_name: complaint.school?.name,
    upvote_count: complaint._count?.upvotes ?? 0,
    comment_count: complaint._count?.comments ?? 0,
    ...extras,
  };
}

function commentRow(comment: any) {
  if (!comment) return comment;

  return {
    id: toNumberId(comment.id),
    complaint_id: toNumberId(comment.complaintId),
    user_id: toNumberId(comment.userId),
    content: comment.content,
    is_admin_reply: comment.isAdminReply,
    created_at: toIsoString(comment.createdAt),
    username: comment.user?.username,
  };
}

// Users
export async function createUser(email: string, passwordHash: string, username: string) {
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      username,
    },
  });

  return userRow(user);
}

export async function getUserByEmail(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  return userRow(user, true);
}

export async function getUserById(userId: IdInput) {
  const user = await prisma.user.findUnique({
    where: { id: toBigIntId(userId) },
  });

  return userRow(user);
}

// Sessions
export async function createSession(userId: IdInput, token: string, expiresAt: Date) {
  const session = await prisma.session.create({
    data: {
      userId: toBigIntId(userId),
      sessionToken: token,
      expiresAt,
    },
  });

  return sessionRow(session);
}

export async function getSessionByToken(token: string) {
  const session = await prisma.session.findFirst({
    where: {
      sessionToken: token,
      expiresAt: {
        gt: new Date(),
      },
    },
  });

  return sessionRow(session);
}

export async function deleteSession(token: string) {
  await prisma.session.deleteMany({
    where: { sessionToken: token },
  });
}

// Schools
export async function createSchool(name: string, description?: string) {
  const school = await prisma.school.create({
    data: {
      name,
      description: description || null,
    },
  });

  return schoolRow(school);
}

export async function getAllSchools() {
  const schools = await prisma.school.findMany({
    orderBy: { name: 'asc' },
  });

  return schools.map(schoolRow);
}

export async function getSchoolById(schoolId: string) {
  const school = await prisma.school.findUnique({
    where: { id: toBigIntId(schoolId) },
  });

  return schoolRow(school);
}

// School Followers
export async function followSchool(userId: number, schoolId: number) {
  const follower = await prisma.schoolFollower.upsert({
    where: {
      userId_schoolId: {
        userId: toBigIntId(userId),
        schoolId: toBigIntId(schoolId),
      },
    },
    update: {},
    create: {
      userId: toBigIntId(userId),
      schoolId: toBigIntId(schoolId),
    },
  });

  return {
    id: toNumberId(follower.id),
    user_id: toNumberId(follower.userId),
    school_id: toNumberId(follower.schoolId),
  };
}

export async function unfollowSchool(userId: number, schoolId: number) {
  await prisma.schoolFollower.deleteMany({
    where: {
      userId: toBigIntId(userId),
      schoolId: toBigIntId(schoolId),
    },
  });
}

export async function getUserFollowedSchools(userId: string) {
  const followers = await prisma.schoolFollower.findMany({
    where: { userId: toBigIntId(userId) },
    include: { school: true },
    orderBy: { school: { name: 'asc' } },
  });

  return followers.map((follower) => schoolRow(follower.school));
}

export async function isFollowingSchool(userId: string, schoolId: string) {
  const count = await prisma.schoolFollower.count({
    where: {
      userId: toBigIntId(userId),
      schoolId: toBigIntId(schoolId),
    },
  });

  return count > 0;
}

export async function getComplaintsByFollowedSchools(userId: string, limit: number = 20, offset: number = 0) {
  const complaints = await prisma.complaint.findMany({
    where: {
      isPublic: true,
      deletedAt: null,
      school: {
        followers: {
          some: {
            userId: toBigIntId(userId),
          },
        },
      },
    },
    include: {
      school: true,
      _count: {
        select: {
          upvotes: true,
          comments: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset,
  });

  return complaints.map((complaint) => complaintRow(complaint));
}

// Complaints
export async function createComplaint(
  userId: number,
  schoolId: number,
  title: string,
  content: string,
  isPublic: boolean = true
) {
  const complaint = await prisma.complaint.create({
    data: {
      userId: toBigIntId(userId),
      schoolId: toBigIntId(schoolId),
      title,
      content,
      isPublic,
    },
    include: {
      school: true,
      _count: {
        select: {
          upvotes: true,
          comments: true,
        },
      },
    },
  });

  return complaintRow(complaint);
}

export async function getComplaintById(complaintId: number, userId?: number | null) {
  const complaint = await prisma.complaint.findFirst({
    where: {
      id: toBigIntId(complaintId),
      deletedAt: null,
    },
    include: {
      school: true,
      _count: {
        select: {
          upvotes: true,
          comments: true,
        },
      },
    },
  });

  if (!complaint) return null;

  const [userUpvoted, userBookmarked] = userId
    ? await Promise.all([
        hasUpvoted(String(complaintId), String(userId)),
        hasBookmarked(String(complaintId), String(userId)),
      ])
    : [false, false];

  return complaintRow(complaint, {
    user_upvoted: userUpvoted,
    user_bookmarked: userBookmarked,
  });
}

export async function getComplaints(
  schoolId?: string,
  limit: number = 20,
  offset: number = 0
) {
  const complaints = await prisma.complaint.findMany({
    where: {
      deletedAt: null,
      isPublic: true,
      ...(schoolId ? { schoolId: toBigIntId(schoolId) } : {}),
    },
    include: {
      school: true,
      _count: {
        select: {
          upvotes: true,
          comments: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset,
  });

  return complaints.map((complaint) => complaintRow(complaint));
}

export async function getComplaintsByUser(userId: string) {
  const complaints = await prisma.complaint.findMany({
    where: {
      userId: toBigIntId(userId),
      deletedAt: null,
    },
    orderBy: { createdAt: 'desc' },
  });

  return complaints.map((complaint) => complaintRow(complaint));
}

export async function deleteComplaint(complaintId: string) {
  await prisma.complaint.updateMany({
    where: { id: toBigIntId(complaintId) },
    data: { deletedAt: new Date() },
  });
}

// Comments
export async function createComment(
  complaintId: string,
  userId: string,
  content: string,
  isAdminReply: boolean = false
) {
  const comment = await prisma.comment.create({
    data: {
      complaintId: toBigIntId(complaintId),
      userId: toBigIntId(userId),
      content,
      isAdminReply,
    },
  });

  return commentRow(comment);
}

export async function getCommentsByComplaint(complaintId: string) {
  const comments = await prisma.comment.findMany({
    where: {
      complaintId: toBigIntId(complaintId),
      deletedAt: null,
    },
    orderBy: { createdAt: 'asc' },
  });

  return comments.map(commentRow);
}

export async function deleteComment(commentId: string) {
  await prisma.comment.updateMany({
    where: { id: toBigIntId(commentId) },
    data: { deletedAt: new Date() },
  });
}

// Upvotes
export async function addUpvote(complaintId: string, userId: string) {
  const upvote = await prisma.upvote.upsert({
    where: {
      userId_complaintId: {
        userId: toBigIntId(userId),
        complaintId: toBigIntId(complaintId),
      },
    },
    update: {},
    create: {
      userId: toBigIntId(userId),
      complaintId: toBigIntId(complaintId),
    },
  });

  return {
    id: toNumberId(upvote.id),
    complaint_id: toNumberId(upvote.complaintId),
    user_id: toNumberId(upvote.userId),
  };
}

export async function removeUpvote(complaintId: string, userId: string) {
  await prisma.upvote.deleteMany({
    where: {
      complaintId: toBigIntId(complaintId),
      userId: toBigIntId(userId),
    },
  });
}

export async function hasUpvoted(complaintId: string, userId: string) {
  const count = await prisma.upvote.count({
    where: {
      complaintId: toBigIntId(complaintId),
      userId: toBigIntId(userId),
    },
  });

  return count > 0;
}

export async function getUpvoteCount(complaintId: string) {
  return prisma.upvote.count({
    where: { complaintId: toBigIntId(complaintId) },
  });
}

// Bookmarks
export async function addBookmark(complaintId: string, userId: string) {
  const bookmark = await prisma.bookmark.upsert({
    where: {
      userId_complaintId: {
        userId: toBigIntId(userId),
        complaintId: toBigIntId(complaintId),
      },
    },
    update: {},
    create: {
      userId: toBigIntId(userId),
      complaintId: toBigIntId(complaintId),
    },
  });

  return {
    id: toNumberId(bookmark.id),
    complaint_id: toNumberId(bookmark.complaintId),
    user_id: toNumberId(bookmark.userId),
  };
}

export async function hasBookmarked(complaintId: string, userId: string) {
  const count = await prisma.bookmark.count({
    where: {
      complaintId: toBigIntId(complaintId),
      userId: toBigIntId(userId),
    },
  });

  return count > 0;
}

export async function getUserBookmarks(userId: IdInput) {
  const bookmarks = await prisma.bookmark.findMany({
    where: {
      userId: toBigIntId(userId),
      complaint: {
        deletedAt: null,
      },
    },
    include: {
      complaint: {
        include: {
          school: true,
          _count: {
            select: {
              upvotes: true,
              comments: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return bookmarks.map((bookmark) => complaintRow(bookmark.complaint)) as Bookmark[];
}

// Comments with user info
export async function getComments(complaintId: number) {
  const comments = await prisma.comment.findMany({
    where: {
      complaintId: toBigIntId(complaintId),
      deletedAt: null,
    },
    include: {
      user: true,
    },
    orderBy: { createdAt: 'asc' },
  });

  return comments.map(commentRow);
}

// Upvotes with type compatibility
export async function upvoteComplaint(complaintId: number, userId: number) {
  const upvote = await addUpvote(String(complaintId), String(userId));
  return upvote ? { id: upvote.id } : upvote;
}

// Bookmarks with type compatibility
export async function bookmarkComplaint(complaintId: number, userId: number) {
  const bookmark = await addBookmark(String(complaintId), String(userId));
  return bookmark ? { id: bookmark.id } : bookmark;
}

export async function removeBookmark(complaintId: number, userId: number) {
  await prisma.bookmark.deleteMany({
    where: {
      complaintId: toBigIntId(complaintId),
      userId: toBigIntId(userId),
    },
  });
}

// Session helpers
export async function getUserIdFromSession(sessionToken: string) {
  const session = await prisma.session.findFirst({
    where: {
      sessionToken,
      expiresAt: {
        gt: new Date(),
      },
    },
    select: {
      userId: true,
    },
  });

  return toNumberId(session?.userId);
}

// Search
export async function searchComplaints(query: string, limit: number = 20) {
  const complaints = await prisma.complaint.findMany({
    where: {
      deletedAt: null,
      isPublic: true,
      OR: [
        {
          title: {
            contains: query,
            mode: 'insensitive',
          },
        },
        {
          content: {
            contains: query,
            mode: 'insensitive',
          },
        },
      ],
    },
    include: {
      school: true,
      _count: {
        select: {
          upvotes: true,
          comments: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  return complaints.map((complaint) => complaintRow(complaint));
}
