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
export type Time = bigint;
export interface CommunityPoem {
    id: PoemId;
    title: string;
    content: string;
    suggestedTheme: Theme;
    authorName: string;
    author: Principal;
    timestamp: Time;
}
export interface AdminPoem {
    id: PoemId;
    title: string;
    content: string;
    category: string;
}
export type PoemId = bigint;
export interface Theme {
    name: string;
    description: string;
}
export interface UserProfile {
    name: string;
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
    success: AdminPoem;
};
export type ChangePasswordResult = {
    __kind__: "success";
    success: null;
} | {
    __kind__: "incorrectPassword";
    incorrectPassword: null;
} | {
    __kind__: "passwordTooShort";
    passwordTooShort: null;
};
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
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    changeAdminPassword(currentPw: string, newPw: string): Promise<ChangePasswordResult>;
    deleteAdminPoem(id: PoemId): Promise<DeleteResult>;
    deleteMyPoem(id: PoemId): Promise<PoemDeleteResult>;
    getAdminPassword(): Promise<string>;
    getAdminPoems(): Promise<Array<AdminPoem>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCommunityPoems(): Promise<Array<CommunityPoem>>;
    getDisplayName(user: Principal): Promise<string | null>;
    getMyPoems(): Promise<Array<CommunityPoem>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setDisplayName(name: string): Promise<void>;
    submitPoem(title: string, content: string, authorName: string): Promise<PoemResult>;
    updateAdminPoem(id: PoemId, title: string, content: string, category: string): Promise<AdminPoemResult>;
}
