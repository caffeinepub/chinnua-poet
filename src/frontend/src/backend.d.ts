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
    setDisplayName(name: string): Promise<void>;
    submitPoem(title: string, content: string, authorName: string): Promise<PoemResult>;
    updateAdminPoem(id: PoemId, title: string, content: string, category: string): Promise<AdminPoemResult>;
    updateNote(id: NoteId, title: string, content: string, isPublic: boolean): Promise<NoteResult>;
}
