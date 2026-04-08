import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";

module {
  public type UserRole = { #admin; #user; #guest };

  public type AccessControlState = {
    var adminPrincipal : ?Principal;
    roles : Map.Map<Principal, UserRole>;
  };

  public func initState() : AccessControlState {
    {
      var adminPrincipal = null;
      roles = Map.empty<Principal, UserRole>();
    };
  };

  // First non-anonymous caller becomes admin; all others become users
  public func ensureRegistered(state : AccessControlState, caller : Principal) {
    if (caller.isAnonymous()) { return };
    switch (state.adminPrincipal) {
      case (null) {
        state.adminPrincipal := ?caller;
        state.roles.add(caller, #admin);
      };
      case (?_) {
        if (state.roles.get(caller) == null) {
          state.roles.add(caller, #user);
        };
      };
    };
  };

  public func getUserRole(state : AccessControlState, caller : Principal) : UserRole {
    if (caller.isAnonymous()) { return #guest };
    switch (state.roles.get(caller)) {
      case (?role) { role };
      case (null) { #guest };
    };
  };

  public func isAdmin(state : AccessControlState, caller : Principal) : Bool {
    getUserRole(state, caller) == #admin;
  };

  public func hasPermission(state : AccessControlState, caller : Principal, required : UserRole) : Bool {
    let role = getUserRole(state, caller);
    switch (required) {
      case (#guest) { true };
      case (#user) { role == #user or role == #admin };
      case (#admin) { role == #admin };
    };
  };

  public func assignRole(state : AccessControlState, caller : Principal, user : Principal, role : UserRole) {
    if (not isAdmin(state, caller)) { Runtime.trap("Unauthorized: Only admins can assign roles") };
    state.roles.add(user, role);
  };
};
