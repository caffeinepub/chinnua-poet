import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type PoemResult = {
    __kind__: "contentTooShort";
    contentTooShort: null;
} | {
    __kind__: "authorNameTooShort";
    authorNameTooShort: null;
} | {
    __kind__: "titleTooShort";
    titleTooShort: null;
} | {
    __kind__: "notFound";
    notFound: null;
} | {
    __kind__: "themeNameTooShort";
    themeNameTooShort: null;
} | {
    __kind__: "success";
    success: CommunityPoem;
} | {
    __kind__: "unauthorized";
    unauthorized: null;
};
export type NoteId = bigint;
export type Time = bigint;
export type NoteResult = {
    __kind__: "contentTooShort";
    contentTooShort: null;
} | {
    __kind__: "titleTooShort";
    titleTooShort: null;
} | {
    __kind__: "notFound";
    notFound: null;
} | {
    __kind__: "success";
    success: UserNote;
} | {
    __kind__: "unauthorized";
    unauthorized: null;
};
export interface CommunityPoem {
    id: PoemId;
    title: string;
    content: string;
    suggestedTheme: Theme;
    authorName: string;
    author: Principal;
    timestamp: Time;
}
export type CommentResult = {
    __kind__: "textTooShort";
    textTooShort: null;
} | {
    __kind__: "success";
    success: PostComment;
} | {
    __kind__: "unauthorized";
    unauthorized: null;
};
export type ReplyId = bigint;
export type PoemId = bigint;
export type CommentId = bigint;
export type SignalId = bigint;
export type AdminPoemResult = {
    __kind__: "contentTooShort";
    contentTooShort: null;
} | {
    __kind__: "categoryTooShort";
    categoryTooShort: null;
} | {
    __kind__: "titleTooShort";
    titleTooShort: null;
} | {
    __kind__: "notFound";
    notFound: null;
} | {
    __kind__: "notAdmin";
    notAdmin: null;
} | {
    __kind__: "success";
    success: AdminPoemEntry;
};
export interface UserNote {
    id: NoteId;
    title: string;
    content: string;
    createdAt: Time;
    author: Principal;
    updatedAt: Time;
    isPublic: boolean;
}
export interface CommentReply {
    id: ReplyId;
    commentId: CommentId;
    text: string;
    authorName: string;
    author: Principal;
    timestamp: Time;
    postId: string;
}
export type ReplyResult = {
    __kind__: "commentNotFound";
    commentNotFound: null;
} | {
    __kind__: "textTooShort";
    textTooShort: null;
} | {
    __kind__: "success";
    success: CommentReply;
} | {
    __kind__: "unauthorized";
    unauthorized: null;
};
export interface PostComment {
    id: CommentId;
    text: string;
    authorName: string;
    author: Principal;
    timestamp: Time;
    postId: string;
}
export interface AdminPoemEntry {
    id: PoemId;
    title: string;
    content: string;
    category: string;
}
export interface Theme {
    name: string;
    description: string;
}
export interface UserProfile {
    name: string;
}
export type CallSignalType = {
    __kind__: "offer";
} | {
    __kind__: "answer";
} | {
    __kind__: "iceCandidate";
} | {
    __kind__: "hangup";
};
export interface CallSignal {
    id: SignalId;
    fromUser: Principal;
    toUser: Principal;
    signalType: CallSignalType;
    data: string;
    timestamp: Time;
    consumed: boolean;
}
export interface CallSettings {
    allowCalls: boolean;
}
export enum ChangePasswordResult {
    passwordTooShort = "passwordTooShort",
    incorrectPassword = "incorrectPassword",
    success = "success"
}
export enum DeleteResult {
    notFoundInAdminCollection = "notFoundInAdminCollection",
    notFoundInCommunityCollection = "notFoundInCommunityCollection",
    notFound = "notFound",
    notAdmin = "notAdmin",
    success = "success"
}
export enum PoemDeleteResult {
    notFound = "notFound",
    success = "success",
    unauthorized = "unauthorized"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum CommentDeleteResult {
    notFound = "notFound",
    success = "success",
    unauthorized = "unauthorized"
}
export enum NoteDeleteResult {
    notFound = "notFound",
    success = "success",
    unauthorized = "unauthorized"
}
export interface backendInterface {
    addAdminPoem(title: string, content: string, category: string): Promise<AdminPoemResult>;
    addComment(postId: string, text: string, authorName: string): Promise<CommentResult>;
    addReply(commentId: CommentId, postId: string, text: string, authorName: string): Promise<ReplyResult>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    changeAdminPassword(currentPw: string, newPw: string): Promise<ChangePasswordResult>;
    createNote(title: string, content: string, isPublic: boolean): Promise<NoteResult>;
    deleteAdminPoem(id: PoemId): Promise<DeleteResult>;
    deleteComment(commentId: CommentId): Promise<CommentDeleteResult>;
    deleteMyPoem(id: PoemId): Promise<PoemDeleteResult>;
    deleteNote(id: NoteId): Promise<NoteDeleteResult>;
    deleteReply(replyId: ReplyId): Promise<CommentDeleteResult>;
    getAdminPassword(): Promise<string>;
    getAdminPoems(): Promise<Array<AdminPoemEntry>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCommentsForPost(postId: string): Promise<Array<PostComment>>;
    getCommunityPoems(): Promise<Array<CommunityPoem>>;
    getDisplayName(user: Principal): Promise<string | null>;
    getMyNotes(): Promise<Array<UserNote>>;
    getMyPoems(): Promise<Array<CommunityPoem>>;
    getPublicNotesForUser(user: Principal): Promise<Array<UserNote>>;
    getRepliesForComment(commentId: CommentId): Promise<Array<CommentReply>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    resetAdminPassword(resetToken: string): Promise<ChangePasswordResult>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setUserPhotoUrl(url: string): Promise<void>;
    getUserPhotoUrl(user: Principal): Promise<string | null>;
    setDisplayName(name: string): Promise<void>;
    submitPoem(title: string, content: string, authorName: string): Promise<PoemResult>;
    updateAdminPoem(id: PoemId, title: string, content: string, category: string): Promise<AdminPoemResult>;
    updateNote(id: NoteId, title: string, content: string, isPublic: boolean): Promise<NoteResult>;
    sendCallSignal(toUser: Principal, signalType: CallSignalType, data: string): Promise<SignalId>;
    getMyPendingSignals(): Promise<Array<CallSignal>>;
    markSignalConsumed(signalId: SignalId): Promise<void>;
    setCallSettings(allowCalls: boolean): Promise<void>;
    getCallSettings(user: Principal): Promise<CallSettings>;
    getAboutContent(): Promise<AboutContent | null>;
    saveAboutContent(poetName: string, bio: string, story: string, poetryFragments: string): Promise<void>;
    getModerationQueue(): Promise<Array<ModerationEntry>>;
    approveModeratedContent(id: bigint): Promise<void>;
    rejectModeratedContent(id: bigint, reason: string): Promise<void>;
    getModerationStats(): Promise<ModerationStats>;
    sendDirectMessage(fromUsername: string, toUsername: string, text: string): Promise<SendMessageResult>;
    getMessagesForUser(username: string): Promise<Array<DirectMessage>>;
    getConversationByUsername(user1: string, user2: string): Promise<Array<DirectMessage>>;
    markDirectMessageRead(msgId: bigint): Promise<void>;
}


// Direct Messages
export interface DirectMessage {
  id: bigint;
  fromUser: Principal;
  fromUsername: string;
  toUser: Principal;
  toUsername: string;
  text: string;
  timestamp: bigint;
  read: boolean;
}

export type SendMessageResult =
  | { success: DirectMessage }
  | { textTooShort: null }
  | { unauthorized: null };


// About Content
export interface AboutContent {
  poetName: string;
  bio: string;
  story: string;
  poetryFragments: string;
  lastUpdated: bigint;
}

// Moderation
export type ModerationStatus =
  | { __kind__: "pending" }
  | { __kind__: "approved" }
  | { __kind__: "rejected" }
  | { __kind__: "needsReview" };

export interface ModerationEntry {
  id: bigint;
  contentType: string;
  content: string;
  author: Principal;
  authorName: string;
  status: ModerationStatus;
  reason: string;
  riskLevel: string;
  timestamp: bigint;
}

export interface ModerationStats {
  pendingCount: bigint;
  approvedCount: bigint;
  rejectedCount: bigint;
}
