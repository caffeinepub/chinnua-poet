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
    __kind__: "pendingReview";
    pendingReview: null;
} | {
    __kind__: "contentTooShort";
    contentTooShort: null;
} | {
    __kind__: "authorNameTooShort";
    authorNameTooShort: null;
} | {
    __kind__: "moderationRejected";
    moderationRejected: string;
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
export type SignalId = bigint;
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
export type ModerationId = bigint;
export type CommentResult = {
    __kind__: "pendingReview";
    pendingReview: null;
} | {
    __kind__: "moderationRejected";
    moderationRejected: string;
} | {
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
export interface ModerationEntry {
    id: ModerationId;
    status: ModerationStatus;
    content: string;
    contentType: string;
    authorName: string;
    author: Principal;
    timestamp: Time;
    riskLevel: string;
    reason: string;
}
export interface AboutContent {
    bio: string;
    poetryFragments: string;
    lastUpdated: Time;
    poetName: string;
    story: string;
}
export interface CallSignal {
    id: SignalId;
    data: string;
    toUser: Principal;
    timestamp: Time;
    consumed: boolean;
    fromUser: Principal;
    signalType: CallSignalType;
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
export interface PostComment {
    id: CommentId;
    text: string;
    authorName: string;
    author: Principal;
    timestamp: Time;
    postId: string;
}
export interface Theme {
    name: string;
    description: string;
}
export interface DirectMessage {
    id: MessageId;
    read: boolean;
    text: string;
    toUser: Principal;
    toUsername: string;
    timestamp: Time;
    fromUser: Principal;
    fromUsername: string;
}
export type NoteId = bigint;
export interface ModerationStats {
    pendingCount: bigint;
    approvedCount: bigint;
    rejectedCount: bigint;
}
export type CommentId = bigint;
export interface CommunityPoem {
    id: PoemId;
    title: string;
    content: string;
    suggestedTheme: Theme;
    authorName: string;
    author: Principal;
    timestamp: Time;
}
export type SendMessageResult = {
    __kind__: "textTooShort";
    textTooShort: null;
} | {
    __kind__: "success";
    success: DirectMessage;
} | {
    __kind__: "unauthorized";
    unauthorized: null;
};
export type PoemId = bigint;
export interface CallSettings {
    allowCalls: boolean;
}
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
export type MessageId = bigint;
export type ReplyResult = {
    __kind__: "pendingReview";
    pendingReview: null;
} | {
    __kind__: "commentNotFound";
    commentNotFound: null;
} | {
    __kind__: "moderationRejected";
    moderationRejected: string;
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
export interface AdminPoemEntry {
    id: PoemId;
    title: string;
    content: string;
    category: string;
}
export interface UserProfile {
    name: string;
}
export enum CallSignalType {
    iceCandidate = "iceCandidate",
    offer = "offer",
    answer = "answer",
    hangup = "hangup"
}
export enum ChangePasswordResult {
    passwordTooShort = "passwordTooShort",
    incorrectPassword = "incorrectPassword",
    success = "success"
}
export enum CommentDeleteResult {
    notFound = "notFound",
    success = "success",
    unauthorized = "unauthorized"
}
export enum DeleteResult {
    notFoundInAdminCollection = "notFoundInAdminCollection",
    notFoundInCommunityCollection = "notFoundInCommunityCollection",
    notFound = "notFound",
    notAdmin = "notAdmin",
    success = "success"
}
export enum ModerationStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected",
    needsReview = "needsReview"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addAdminPoem(title: string, content: string, category: string): Promise<AdminPoemResult>;
    addComment(postId: string, text: string, authorName: string): Promise<CommentResult>;
    addReply(commentId: CommentId, postId: string, text: string, authorName: string): Promise<ReplyResult>;
    approveModeratedContent(id: ModerationId): Promise<void>;
    assignRole(user: Principal, role: UserRole): Promise<void>;
    changeAdminPassword(currentPw: string, newPw: string): Promise<ChangePasswordResult>;
    checkAdminPassword(pw: string): Promise<boolean>;
    createNote(title: string, content: string, isPublic: boolean): Promise<NoteResult>;
    deleteAdminPoem(id: PoemId): Promise<DeleteResult>;
    deleteComment(commentId: CommentId): Promise<CommentDeleteResult>;
    deleteMyPoem(id: PoemId): Promise<PoemDeleteResult>;
    deleteNote(id: NoteId): Promise<NoteDeleteResult>;
    deleteReply(replyId: ReplyId): Promise<CommentDeleteResult>;
    getAboutContent(): Promise<AboutContent | null>;
    getAdminPassword(): Promise<string>;
    getAdminPoems(): Promise<Array<AdminPoemEntry>>;
    getCallSettings(user: Principal): Promise<CallSettings>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCommentsForPost(postId: string): Promise<Array<PostComment>>;
    getCommunityPoems(): Promise<Array<CommunityPoem>>;
    getConversationByUsername(user1: string, user2: string): Promise<Array<DirectMessage>>;
    getDisplayName(user: Principal): Promise<string | null>;
    getMessagesForUser(username: string): Promise<Array<DirectMessage>>;
    getModerationQueue(): Promise<Array<ModerationEntry>>;
    getModerationStats(): Promise<ModerationStats>;
    getMyNotes(): Promise<Array<UserNote>>;
    getMyPendingSignals(): Promise<Array<CallSignal>>;
    getMyPoems(): Promise<Array<CommunityPoem>>;
    getMyRole(): Promise<UserRole>;
    getPublicNotesForUser(user: Principal): Promise<Array<UserNote>>;
    getRepliesForComment(commentId: CommentId): Promise<Array<CommentReply>>;
    getUserPhotoUrl(user: Principal): Promise<string | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    login(): Promise<UserRole>;
    markDirectMessageRead(msgId: MessageId): Promise<void>;
    markSignalConsumed(signalId: SignalId): Promise<void>;
    rejectModeratedContent(id: ModerationId, reason: string): Promise<void>;
    resetAdminPassword(resetToken: string): Promise<ChangePasswordResult>;
    saveAboutContent(poetName: string, bio: string, story: string, poetryFragments: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    sendCallSignal(toUser: Principal, signalType: CallSignalType, data: string): Promise<SignalId>;
    sendDirectMessage(fromUsername: string, toUsername: string, text: string): Promise<SendMessageResult>;
    setCallSettings(allowCalls: boolean): Promise<void>;
    setDisplayName(name: string): Promise<void>;
    setUserPhotoUrl(url: string): Promise<void>;
    submitPoem(title: string, content: string, authorName: string): Promise<PoemResult>;
    updateAdminPoem(id: PoemId, title: string, content: string, category: string): Promise<AdminPoemResult>;
    updateNote(id: NoteId, title: string, content: string, isPublic: boolean): Promise<NoteResult>;
}
