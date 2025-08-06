export interface OrganisationPolicy {
  Organisation?: Organisation;
  OrgPolicyReference?: string;
  OrgPolicyCaseAssignedRole?: string;
  PrepopulateToUsersOrganisation?: string;
}

export interface Organisation {
  OrganisationID?: string;
  OrganisationName?: string;
}
