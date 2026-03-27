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
  public type Theme = {
    name : Text;
    description : Text;
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

  // Stored type (no id - stable variable compatibility)
  public type AdminPoem = {
    title : Text;
    content : Text;
    category : Text;
  };

  // Return type (includes id for frontend use)
  public type AdminPoemEntry = {
    id : PoemId;
    title : Text;
    content : Text;
    category : Text;
  };

  public type PoemResult = {
    #success : CommunityPoem;
    #themeNameTooShort;
    #titleTooShort;
    #contentTooShort;
    #authorNameTooShort;
    #notFound;
    #unauthorized;
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

  public type UserProfile = {
    name : Text;
  };

  // State
  let communityPoems = Map.empty<PoemId, CommunityPoem>();
  let adminPoems = Map.empty<PoemId, AdminPoem>();
  let displayNames = Map.empty<Principal, Text>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var nextPoemId = 1;

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

  func minTextLength(text : Text, minLength : Nat) : Bool {
    if (text.size() < minLength) { return false };
    true;
  };

  // Admin Password Management
  public query func getAdminPassword() : async Text {
    adminPassword;
  };

  public shared func changeAdminPassword(currentPw : Text, newPw : Text) : async ChangePasswordResult {
    if (currentPw != adminPassword) { return #incorrectPassword };
    if (newPw.size() < 6) { return #passwordTooShort };
    adminPassword := newPw;
    #success;
  };

  // User Profile Management (required by frontend)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Poem Submission
  public shared ({ caller }) func submitPoem(title : Text, content : Text, authorName : Text) : async PoemResult {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only logged-in users can submit poems");
    };
    if (not minTextLength(title, 3)) { return #titleTooShort };
    if (not minTextLength(content, 10)) { return #contentTooShort };
    if (not minTextLength(authorName, 2)) { return #authorNameTooShort };

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

    #success(poem);
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
