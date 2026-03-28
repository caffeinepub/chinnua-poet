import Map "mo:core/Map";
import Text "mo:core/Text";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // Auth system state
  let accessControlState = AccessControl.initState();

  // Authorization roles
  include MixinAuthorization(accessControlState);

  // Admin password (stored in backend for cross-browser sync)
  var adminPassword : Text = "chinnua2025";

  // Data Types
  public type PoemId = Nat;
  public type NoteId = Nat;
  public type CommentId = Nat;
  public type ReplyId = Nat;
  public type SignalId = Nat;
  public type ModerationId = Nat;

  public type Theme = {
    name : Text;
    description : Text;
  };

  public type AboutContent = {
    poetName : Text;
    bio : Text;
    story : Text;
    poetryFragments : Text;
    lastUpdated : Time.Time;
  };

  public type ModerationStatus = {
    #pending;
    #approved;
    #rejected;
    #needsReview;
  };

  public type ModerationEntry = {
    id : ModerationId;
    contentType : Text;
    content : Text;
    author : Principal;
    authorName : Text;
    status : ModerationStatus;
    reason : Text;
    riskLevel : Text;
    timestamp : Time.Time;
  };

  public type ModerationCheckResult = {
    status : ModerationStatus;
    reason : Text;
    riskLevel : Text;
  };

  public type ModerationStats = {
    pendingCount : Nat;
    approvedCount : Nat;
    rejectedCount : Nat;
  };

  public type CommunityPoem = {
    id : PoemId;
    title : Text;
    content : Text;
    author : Principal;
    authorName : Text;
    timestamp : Time.Time;
    suggestedTheme : Theme;
  };

  public type AdminPoem = {
    title : Text;
    content : Text;
    category : Text;
  };

  public type AdminPoemEntry = {
    id : PoemId;
    title : Text;
    content : Text;
    category : Text;
  };

  public type UserNote = {
    id : NoteId;
    title : Text;
    content : Text;
    author : Principal;
    createdAt : Time.Time;
    updatedAt : Time.Time;
    isPublic : Bool;
  };

  public type PostComment = {
    id : CommentId;
    postId : Text;
    author : Principal;
    authorName : Text;
    text : Text;
    timestamp : Time.Time;
  };

  public type CommentReply = {
    id : ReplyId;
    commentId : CommentId;
    postId : Text;
    author : Principal;
    authorName : Text;
    text : Text;
    timestamp : Time.Time;
  };

  public type UserProfile = {
    name : Text;
  };

  public type CallSignalType = {
    #offer;
    #answer;
    #iceCandidate;
    #hangup;
  };

  public type CallSignal = {
    id : SignalId;
    fromUser : Principal;
    toUser : Principal;
    signalType : CallSignalType;
    data : Text;
    timestamp : Time.Time;
    consumed : Bool;
  };

  public type CallSettings = {
    allowCalls : Bool;
  };

  // Result Types
  public type PoemResult = {
    #success : CommunityPoem;
    #themeNameTooShort;
    #titleTooShort;
    #contentTooShort;
    #authorNameTooShort;
    #notFound;
    #unauthorized;
    #moderationRejected : Text;
    #pendingReview;
  };

  public type AdminPoemResult = {
    #success : AdminPoemEntry;
    #titleTooShort;
    #contentTooShort;
    #categoryTooShort;
    #notFound;
    #notAdmin;
  };

  public type AdminResult = {
    #success;
    #notAdmin;
    #notFound;
  };

  public type PoemDeleteResult = {
    #success;
    #notFound;
    #unauthorized;
  };

  public type DeleteResult = {
    #success;
    #notAdmin;
    #notFound;
    #notFoundInCommunityCollection;
    #notFoundInAdminCollection;
  };

  public type ChangePasswordResult = {
    #success;
    #incorrectPassword;
    #passwordTooShort;
  };

  public type NoteResult = {
    #success : UserNote;
    #titleTooShort;
    #contentTooShort;
    #notFound;
    #unauthorized;
  };

  public type NoteDeleteResult = {
    #success;
    #notFound;
    #unauthorized;
  };

  public type CommentResult = {
    #success : PostComment;
    #textTooShort;
    #unauthorized;
    #moderationRejected : Text;
    #pendingReview;
  };

  public type ReplyResult = {
    #success : CommentReply;
    #textTooShort;
    #commentNotFound;
    #unauthorized;
    #moderationRejected : Text;
    #pendingReview;
  };

  public type CommentDeleteResult = {
    #success;
    #notFound;
    #unauthorized;
  };

  // State
  let communityPoems = Map.empty<PoemId, CommunityPoem>();
  let adminPoems = Map.empty<PoemId, AdminPoem>();
  let displayNames = Map.empty<Principal, Text>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let userPhotoUrls = Map.empty<Principal, Text>();
  let userNotes = Map.empty<NoteId, UserNote>();
  let postComments = Map.empty<CommentId, PostComment>();
  let commentReplies = Map.empty<ReplyId, CommentReply>();
  let callSignals = Map.empty<SignalId, CallSignal>();
  let callSettings = Map.empty<Principal, CallSettings>();
  let moderationQueue = Map.empty<ModerationId, ModerationEntry>();
  let userViolations = Map.empty<Principal, Nat>();
  let userPostCount = Map.empty<Principal, Nat>();
  var aboutContent : ?AboutContent = null;
  var nextPoemId = 1;
  var nextNoteId = 1;
  var nextCommentId = 1;
  var nextReplyId = 1;
  var nextSignalId = 1;
  var nextModerationId = 1;

  // Helper Functions
  func comparePoemsByTimestamp(a : CommunityPoem, b : CommunityPoem) : Order.Order {
    if (a.timestamp > b.timestamp) {
      #less;
    } else if (a.timestamp < b.timestamp) {
      #greater;
    } else {
      #equal;
    };
  };

  func compareNotesByCreatedAt(a : UserNote, b : UserNote) : Order.Order {
    if (a.createdAt > b.createdAt) {
      #less;
    } else if (a.createdAt < b.createdAt) {
      #greater;
    } else {
      #equal;
    };
  };

  func compareCommentsByTimestamp(a : PostComment, b : PostComment) : Order.Order {
    if (a.timestamp < b.timestamp) {
      #less;
    } else if (a.timestamp > b.timestamp) {
      #greater;
    } else {
      #equal;
    };
  };

  func compareRepliesByTimestamp(a : CommentReply, b : CommentReply) : Order.Order {
    if (a.timestamp < b.timestamp) {
      #less;
    } else if (a.timestamp > b.timestamp) {
      #greater;
    } else {
      #equal;
    };
  };

  func compareSignalsByTimestamp(a : CallSignal, b : CallSignal) : Order.Order {
    if (a.timestamp < b.timestamp) {
      #less;
    } else if (a.timestamp > b.timestamp) {
      #greater;
    } else {
      #equal;
    };
  };

  func compareModerationByTimestamp(a : ModerationEntry, b : ModerationEntry) : Order.Order {
    if (a.timestamp < b.timestamp) {
      #less;
    } else if (a.timestamp > b.timestamp) {
      #greater;
    } else {
      #equal;
    };
  };

  func minTextLength(text : Text, minLength : Nat) : Bool {
    if (text.size() < minLength) { return false };
    true;
  };

  // Moderation Logic (The Silent Guardian)
  func checkContent(content : Text, author : Principal) : ModerationCheckResult {
    let lower = content.toLower();

    // Get user trust data
    let violations = switch (userViolations.get(author)) {
      case (?v) { v };
      case (null) { 0 };
    };
    let postCount = switch (userPostCount.get(author)) {
      case (?c) { c };
      case (null) { 0 };
    };
    let isTrusted = postCount >= 5 and violations == 0;
    let isStrictMode = violations >= 2 or postCount < 3;

    // HIGH RISK keywords - auto reject
    let highRiskWords = ["kill yourself", "kys", "go die", "i hate you", "you should die", "f**k you", "fuck you", "you're worthless", "youre worthless", "piece of shit", "piece of garbage"];
    for (word in highRiskWords.vals()) {
      if (lower.contains(#text(word))) {
        return {
          status = #rejected;
          reason = "Content contains harmful or abusive language";
          riskLevel = "high";
        };
      };
    };

    // MEDIUM RISK keywords
    let mediumRiskWords = ["spam", "buy now", "click here", "free money", "winner", "limited offer", "subscribe", "follow me", "dm me", "check my", "visit my"];
    for (word in mediumRiskWords.vals()) {
      if (lower.contains(#text(word))) {
        let status = if (isStrictMode) { #needsReview } else if (isTrusted) { #approved } else { #needsReview };
        return {
          status = status;
          reason = "Content may contain promotional material";
          riskLevel = "medium";
        };
      };
    };

    // Repetitive content check (spam pattern)
    if (content.size() > 10) {
      var sameCount = 0;
      var firstChar : Char = 'a';
      var isFirst = true;
      for (c in content.chars()) {
        if (isFirst) { firstChar := c; isFirst := false };
        if (c == firstChar) { sameCount += 1 };
      };
      if (sameCount * 3 > content.size()) {
        return {
          status = #needsReview;
          reason = "Content appears to be repetitive or spam-like";
          riskLevel = "medium";
        };
      };
    };

    // Approved
    { status = #approved; reason = "Content meets community guidelines"; riskLevel = "low" };
  };

  // About Content Management
  public query func getAboutContent() : async ?AboutContent {
    aboutContent;
  };

  public shared ({ caller }) func saveAboutContent(poetName : Text, bio : Text, story : Text, poetryFragments : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can save about content");
    };
    aboutContent := ?{
      poetName;
      bio;
      story;
      poetryFragments;
      lastUpdated = Time.now();
    };
  };

  // Admin Password Management
  // Public check — no auth required (needed for login screen to verify password)
  public query func checkAdminPassword(pw : Text) : async Bool {
    pw == adminPassword;
  };

  // Legacy: kept for backward compat but no longer requires admin auth for login
  public query func getAdminPassword() : async Text {
    adminPassword;
  };

  public shared ({ caller }) func changeAdminPassword(currentPw : Text, newPw : Text) : async ChangePasswordResult {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can change the admin password");
    };
    if (currentPw != adminPassword) { return #incorrectPassword };
    if (newPw.size() < 6) { return #passwordTooShort };
    adminPassword := newPw;
    #success;
  };

  // Reset password — NO admin auth required so locked-out admins can recover
  public shared func resetAdminPassword(resetToken : Text) : async ChangePasswordResult {
    if (resetToken != "CHINNUA_RESET_2026") { return #incorrectPassword };
    adminPassword := "chinnua2025";
    #success;
  };

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func setUserPhotoUrl(url : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can set their photo");
    };
    userPhotoUrls.add(caller, url);
  };

  public query func getUserPhotoUrl(user : Principal) : async ?Text {
    userPhotoUrls.get(user);
  };

  // Moderation Queue Management
  public query ({ caller }) func getModerationQueue() : async [ModerationEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view the moderation queue");
    };
    let entries = moderationQueue.values().filter(func(e) {
      switch (e.status) {
        case (#pending) { true };
        case (#needsReview) { true };
        case (_) { false };
      };
    }).toArray();
    entries.sort(compareModerationByTimestamp);
  };

  public shared ({ caller }) func approveModeratedContent(id : ModerationId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can approve moderated content");
    };
    switch (moderationQueue.get(id)) {
      case (null) {};
      case (?entry) {
        let updated : ModerationEntry = {
          id = entry.id;
          contentType = entry.contentType;
          content = entry.content;
          author = entry.author;
          authorName = entry.authorName;
          status = #approved;
          reason = entry.reason;
          riskLevel = entry.riskLevel;
          timestamp = entry.timestamp;
        };
        moderationQueue.add(id, updated);
        // If it's a poem, publish it to community poems
        if (entry.contentType == "poem") {
          let theme = suggestTheme(entry.content);
          let poemId = nextPoemId;
          let poem : CommunityPoem = {
            id = poemId;
            title = "Community Poem";
            content = entry.content;
            author = entry.author;
            authorName = entry.authorName;
            timestamp = entry.timestamp;
            suggestedTheme = theme;
          };
          communityPoems.add(poemId, poem);
          nextPoemId += 1;
        };
        // Increment post count
        let currentCount = switch (userPostCount.get(entry.author)) {
          case (?c) { c };
          case (null) { 0 };
        };
        userPostCount.add(entry.author, currentCount + 1);
      };
    };
  };

  public shared ({ caller }) func rejectModeratedContent(id : ModerationId, reason : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can reject moderated content");
    };
    switch (moderationQueue.get(id)) {
      case (null) {};
      case (?entry) {
        let updated : ModerationEntry = {
          id = entry.id;
          contentType = entry.contentType;
          content = entry.content;
          author = entry.author;
          authorName = entry.authorName;
          status = #rejected;
          reason;
          riskLevel = entry.riskLevel;
          timestamp = entry.timestamp;
        };
        moderationQueue.add(id, updated);
        // Increment violations
        let currentViolations = switch (userViolations.get(entry.author)) {
          case (?v) { v };
          case (null) { 0 };
        };
        userViolations.add(entry.author, currentViolations + 1);
      };
    };
  };

  public query ({ caller }) func getModerationStats() : async ModerationStats {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view moderation stats");
    };
    var pending = 0;
    var approved = 0;
    var rejected = 0;
    for (entry in moderationQueue.values()) {
      switch (entry.status) {
        case (#pending) { pending += 1 };
        case (#needsReview) { pending += 1 };
        case (#approved) { approved += 1 };
        case (#rejected) { rejected += 1 };
      };
    };
    { pendingCount = pending; approvedCount = approved; rejectedCount = rejected };
  };

  // Poem Submission (with moderation)
  public shared ({ caller }) func submitPoem(title : Text, content : Text, authorName : Text) : async PoemResult {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only logged-in users can submit poems");
    };
    if (not minTextLength(title, 3)) { return #titleTooShort };
    if (not minTextLength(content, 10)) { return #contentTooShort };
    if (not minTextLength(authorName, 2)) { return #authorNameTooShort };

    let fullContent = title # " " # content;
    let modResult = checkContent(fullContent, caller);

    switch (modResult.status) {
      case (#rejected) {
        return #moderationRejected(modResult.reason);
      };
      case (#needsReview) {
        let modId = nextModerationId;
        let entry : ModerationEntry = {
          id = modId;
          contentType = "poem";
          content = title # "\n\n" # content;
          author = caller;
          authorName;
          status = #needsReview;
          reason = modResult.reason;
          riskLevel = modResult.riskLevel;
          timestamp = Time.now();
        };
        moderationQueue.add(modId, entry);
        nextModerationId += 1;
        return #pendingReview;
      };
      case (#approved) {
        let theme = suggestTheme(content);
        let poemId = nextPoemId;
        let poem : CommunityPoem = {
          id = poemId;
          title;
          content;
          author = caller;
          authorName;
          timestamp = Time.now();
          suggestedTheme = theme;
        };
        communityPoems.add(poemId, poem);
        nextPoemId += 1;
        let currentCount = switch (userPostCount.get(caller)) {
          case (?c) { c };
          case (null) { 0 };
        };
        userPostCount.add(caller, currentCount + 1);
        #success(poem);
      };
      case (#pending) {
        return #pendingReview;
      };
    };
  };

  // Admin Poem Management
  public shared ({ caller }) func addAdminPoem(title : Text, content : Text, category : Text) : async AdminPoemResult {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add admin poems");
    };
    if (not minTextLength(title, 3)) { return #titleTooShort };
    if (not minTextLength(content, 10)) { return #contentTooShort };
    if (not minTextLength(category, 3)) { return #categoryTooShort };

    let poemId = nextPoemId;
    let poem : AdminPoem = {
      title;
      content;
      category;
    };

    adminPoems.add(poemId, poem);
    nextPoemId += 1;

    #success({ id = poemId; title; content; category });
  };

  public query ({ caller }) func getAdminPoems() : async [AdminPoemEntry] {
    adminPoems.entries().map(func(entry : (PoemId, AdminPoem)) : AdminPoemEntry {
      let (id, p) = entry;
      { id; title = p.title; content = p.content; category = p.category }
    }).toArray();
  };

  public shared ({ caller }) func updateAdminPoem(id : PoemId, title : Text, content : Text, category : Text) : async AdminPoemResult {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update admin poems");
    };
    if (not adminPoems.containsKey(id)) { return #notFound };
    if (not minTextLength(title, 3)) { return #titleTooShort };
    if (not minTextLength(content, 10)) { return #contentTooShort };
    if (not minTextLength(category, 3)) { return #categoryTooShort };

    let stored : AdminPoem = { title; content; category };
    adminPoems.add(id, stored);
    #success({ id; title; content; category });
  };

  public shared ({ caller }) func deleteAdminPoem(id : PoemId) : async DeleteResult {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete admin poems");
    };
    if (not adminPoems.containsKey(id)) { return #notFoundInAdminCollection };
    adminPoems.remove(id);
    #success;
  };

  // Community Poem Management
  public query ({ caller }) func getCommunityPoems() : async [CommunityPoem] {
    let poemsArray = communityPoems.values().toArray();
    poemsArray.sort(comparePoemsByTimestamp);
  };

  public query ({ caller }) func getMyPoems() : async [CommunityPoem] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only logged-in users can view their poems");
    };
    communityPoems.values().filter(func(p) { p.author == caller }).toArray();
  };

  public shared ({ caller }) func deleteMyPoem(id : PoemId) : async PoemDeleteResult {
    let poem = switch (communityPoems.get(id)) {
      case (null) { return #notFound };
      case (?poem) { poem };
    };

    if (AccessControl.isAdmin(accessControlState, caller)) {
      communityPoems.remove(id);
      return #success;
    };

    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only logged-in users can delete poems");
    };

    if (poem.author != caller) {
      return #unauthorized;
    };

    communityPoems.remove(id);
    #success;
  };

  // User Notes
  public shared ({ caller }) func createNote(title : Text, content : Text, isPublic : Bool) : async NoteResult {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only logged-in users can create notes");
    };
    if (not minTextLength(title, 1)) { return #titleTooShort };
    if (not minTextLength(content, 1)) { return #contentTooShort };

    let noteId = nextNoteId;
    let now = Time.now();
    let note : UserNote = {
      id = noteId;
      title;
      content;
      author = caller;
      createdAt = now;
      updatedAt = now;
      isPublic;
    };

    userNotes.add(noteId, note);
    nextNoteId += 1;
    #success(note);
  };

  public shared ({ caller }) func updateNote(id : NoteId, title : Text, content : Text, isPublic : Bool) : async NoteResult {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only logged-in users can update notes");
    };
    let existing = switch (userNotes.get(id)) {
      case (null) { return #notFound };
      case (?n) { n };
    };
    if (existing.author != caller) { return #unauthorized };
    if (not minTextLength(title, 1)) { return #titleTooShort };
    if (not minTextLength(content, 1)) { return #contentTooShort };

    let updated : UserNote = {
      id;
      title;
      content;
      author = caller;
      createdAt = existing.createdAt;
      updatedAt = Time.now();
      isPublic;
    };
    userNotes.add(id, updated);
    #success(updated);
  };

  public shared ({ caller }) func deleteNote(id : NoteId) : async NoteDeleteResult {
    let note = switch (userNotes.get(id)) {
      case (null) { return #notFound };
      case (?n) { n };
    };
    if (note.author != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      return #unauthorized;
    };
    userNotes.remove(id);
    #success;
  };

  public query ({ caller }) func getMyNotes() : async [UserNote] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only logged-in users can view their notes");
    };
    let notes = userNotes.values().filter(func(n) { n.author == caller }).toArray();
    notes.sort(compareNotesByCreatedAt);
  };

  public query func getPublicNotesForUser(user : Principal) : async [UserNote] {
    let notes = userNotes.values().filter(func(n) { n.author == user and n.isPublic }).toArray();
    notes.sort(compareNotesByCreatedAt);
  };

  // Comments (with moderation)
  public shared ({ caller }) func addComment(postId : Text, text : Text, authorName : Text) : async CommentResult {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only logged-in users can comment");
    };
    if (not minTextLength(text, 1)) { return #textTooShort };

    let modResult = checkContent(text, caller);
    switch (modResult.status) {
      case (#rejected) { return #moderationRejected(modResult.reason) };
      case (#needsReview) {
        let modId = nextModerationId;
        let entry : ModerationEntry = {
          id = modId;
          contentType = "comment";
          content = text;
          author = caller;
          authorName;
          status = #needsReview;
          reason = modResult.reason;
          riskLevel = modResult.riskLevel;
          timestamp = Time.now();
        };
        moderationQueue.add(modId, entry);
        nextModerationId += 1;
        return #pendingReview;
      };
      case (_) {
        let commentId = nextCommentId;
        let comment : PostComment = {
          id = commentId;
          postId;
          author = caller;
          authorName;
          text;
          timestamp = Time.now();
        };
        postComments.add(commentId, comment);
        nextCommentId += 1;
        #success(comment);
      };
    };
  };

  public shared ({ caller }) func addReply(commentId : CommentId, postId : Text, text : Text, authorName : Text) : async ReplyResult {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only logged-in users can reply");
    };
    if (not postComments.containsKey(commentId)) { return #commentNotFound };
    if (not minTextLength(text, 1)) { return #textTooShort };

    let modResult = checkContent(text, caller);
    switch (modResult.status) {
      case (#rejected) { return #moderationRejected(modResult.reason) };
      case (#needsReview) {
        let modId = nextModerationId;
        let authorName = switch (displayNames.get(caller)) {
          case (?name) { name };
          case (null) { "Anonymous" };
        };
        let entry : ModerationEntry = {
          id = modId;
          contentType = "reply";
          content = text;
          author = caller;
          authorName;
          status = #needsReview;
          reason = modResult.reason;
          riskLevel = modResult.riskLevel;
          timestamp = Time.now();
        };
        moderationQueue.add(modId, entry);
        nextModerationId += 1;
        return #pendingReview;
      };
      case (_) {
        let replyId = nextReplyId;
        let authorName = switch (displayNames.get(caller)) {
          case (?name) { name };
          case (null) { "Anonymous" };
        };
        let reply : CommentReply = {
          id = replyId;
          commentId;
          postId;
          author = caller;
          authorName;
          text;
          timestamp = Time.now();
        };
        commentReplies.add(replyId, reply);
        nextReplyId += 1;
        #success(reply);
      };
    };
  };

  public query func getCommentsForPost(postId : Text) : async [PostComment] {
    let comments = postComments.values().filter(func(c) { c.postId == postId }).toArray();
    comments.sort(compareCommentsByTimestamp);
  };

  public query func getRepliesForComment(commentId : CommentId) : async [CommentReply] {
    let replies = commentReplies.values().filter(func(r) { r.commentId == commentId }).toArray();
    replies.sort(compareRepliesByTimestamp);
  };

  public shared ({ caller }) func deleteComment(commentId : CommentId) : async CommentDeleteResult {
    let comment = switch (postComments.get(commentId)) {
      case (null) { return #notFound };
      case (?c) { c };
    };
    if (comment.author != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      return #unauthorized;
    };
    let replyIds = commentReplies.keys().filter(func(rId) {
      switch (commentReplies.get(rId)) {
        case (?r) { r.commentId == commentId };
        case (null) { false };
      }
    }).toArray();
    for (rId in replyIds.vals()) {
      commentReplies.remove(rId);
    };
    postComments.remove(commentId);
    #success;
  };

  public shared ({ caller }) func deleteReply(replyId : ReplyId) : async CommentDeleteResult {
    let reply = switch (commentReplies.get(replyId)) {
      case (null) { return #notFound };
      case (?r) { r };
    };
    if (reply.author != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      return #unauthorized;
    };
    commentReplies.remove(replyId);
    #success;
  };

  // WebRTC Signaling
  public shared ({ caller }) func sendCallSignal(toUser : Principal, signalType : CallSignalType, data : Text) : async SignalId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only logged-in users can send call signals");
    };
    let signalId = nextSignalId;
    let signal : CallSignal = {
      id = signalId;
      fromUser = caller;
      toUser;
      signalType;
      data;
      timestamp = Time.now();
      consumed = false;
    };
    callSignals.add(signalId, signal);
    nextSignalId += 1;
    signalId;
  };

  public query ({ caller }) func getMyPendingSignals() : async [CallSignal] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only logged-in users can get call signals");
    };
    let signals = callSignals.values().filter(func(s) { s.toUser == caller and not s.consumed }).toArray();
    signals.sort(compareSignalsByTimestamp);
  };

  public shared ({ caller }) func markSignalConsumed(signalId : SignalId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only logged-in users can consume call signals");
    };
    switch (callSignals.get(signalId)) {
      case (null) {};
      case (?signal) {
        if (signal.toUser == caller) {
          let updated : CallSignal = {
            id = signal.id;
            fromUser = signal.fromUser;
            toUser = signal.toUser;
            signalType = signal.signalType;
            data = signal.data;
            timestamp = signal.timestamp;
            consumed = true;
          };
          callSignals.add(signalId, updated);
        };
      };
    };
  };

  // Call Settings
  public shared ({ caller }) func setCallSettings(allowCalls : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only logged-in users can set call settings");
    };
    callSettings.add(caller, { allowCalls });
  };

  public query func getCallSettings(user : Principal) : async CallSettings {
    switch (callSettings.get(user)) {
      case (?settings) { settings };
      case (null) { { allowCalls = true } };
    };
  };

  // Theme Suggestion
  func suggestTheme(content : Text) : Theme {
    let lowerContent = content.toLower();

    if (lowerContent.contains(#text("sad")) or lowerContent.contains(#text("pain")) or lowerContent.contains(#text("grief"))) {
      return {
        name = "Moonlit Grief";
        description = "Themes of sorrow, loss, and emotional pain";
      };
    } else if (lowerContent.contains(#text("love")) or lowerContent.contains(#text("heart")) or lowerContent.contains(#text("romance"))) {
      return {
        name = "Burning Rose";
        description = "Themes of love, passion, and romance";
      };
    } else if (lowerContent.contains(#text("journey")) or lowerContent.contains(#text("life")) or lowerContent.contains(#text("soul"))) {
      return {
        name = "Wandering Soul";
        description = "Themes of life, self-discovery, and existentialism";
      };
    } else if (lowerContent.contains(#text("nature")) or lowerContent.contains(#text("earth")) or lowerContent.contains(#text("sun"))) {
      return {
        name = "Earthsong";
        description = "Themes of nature, environment, and the natural world";
      };
    } else {
      return {
        name = "Midnight Echo";
        description = "Themes of mystery, the unknown, and introspection";
      };
    };
  };

  // Display Name Management
  public shared ({ caller }) func setDisplayName(name : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only logged-in users can set their display name");
    };
    if (not minTextLength(name, 2)) { Runtime.trap("Display name too short") };
    displayNames.add(caller, name);
  };

  public query ({ caller }) func getDisplayName(user : Principal) : async ?Text {
    displayNames.get(user);
  };
};
