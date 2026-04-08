import Map "mo:core/Map";
import Principal "mo:core/Principal";

module {
  // Old types (copied from .old/src/backend — accessControlState shape)
  public type OldUserRole = { #admin; #guest; #user };

  public type OldAccessControlState = {
    var adminAssigned : Bool;
    userRoles : Map.Map<Principal, OldUserRole>;
  };

  // New types (matching authorization.mo)
  public type NewUserRole = { #admin; #guest; #user };

  public type NewAccessControlState = {
    var adminPrincipal : ?Principal;
    roles : Map.Map<Principal, NewUserRole>;
  };

  // Old actor stable state shape (fields that need migration)
  public type OldActor = {
    accessControlState : OldAccessControlState;
  };

  // New actor stable state shape (only the fields being changed)
  public type NewActor = {
    accessControlState : NewAccessControlState;
  };

  public func run(old : OldActor) : NewActor {
    // Find the admin principal by scanning userRoles for #admin
    var adminPrincipal : ?Principal = null;
    for ((p, role) in old.accessControlState.userRoles.entries()) {
      switch (role) {
        case (#admin) { adminPrincipal := ?p };
        case (_) {};
      };
    };

    let newRoles = Map.empty<Principal, NewUserRole>();
    for ((p, role) in old.accessControlState.userRoles.entries()) {
      newRoles.add(p, role);
    };

    {
      accessControlState = {
        var adminPrincipal = adminPrincipal;
        roles = newRoles;
      };
    };
  };
};
