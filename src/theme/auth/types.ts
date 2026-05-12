export interface BudgetEntity {
  id: string;
  name: string;
  unitId: string;
  entitySectorId: string;
}

export interface Role {
  id: string;
  name: string;
}

export interface AppModule {
  moduleId: string;
  shortName: string;
  fullName: string;
  icon: string;
  to: string;
  isActive: boolean;
  permit: string;
  orderNo: number;
  menues: unknown[];
}

export interface SelectedBudgetEntity extends BudgetEntity {
  roles: Role[];
  modules: AppModule[];
}

export interface AssignedEntitySector {
  id: string;
  sectorId: number;
  sector: string;
  name: string;
  entityId: string;
  unitId: string;
  isLocked: boolean;
  canUseTrainingModule: boolean;
  permissions: Record<string, boolean>;
  budgetEntities: BudgetEntity[];
  selectedBudgetEntity: SelectedBudgetEntity[];
}

export interface VerifyMeResponse {
  userId: string;
  lastName: string;
  firstName: string;
  email: string;
  phoneNumber: string;
  nid: string;
  passportNumber: string | null;
  rssbNumber: string;
  dn: string;
  assignedEntitySectors: AssignedEntitySector[];
  selectedEntitySector: AssignedEntitySector | null;
}

/** Payload delivered to the `onAuthChange` callback on AppShell / AuthProvider */
export interface AuthChangePayload {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  selectedEntitySector: AssignedEntitySector | null;
}

export interface SsoAuthConfig {
  /** Base URL of the SSO server, e.g. "http://sso.localtest.me:8000/" */
  ssoBaseUrl: string;
  /** Service name used in the SSO redirect, e.g. "Internship Portal" */
  serviceName: string;
  /** HMAC signing secret (falls back to VITE_API_SIGNING_SECRET) */
  signingSecret?: string;
  /** App client ID (falls back to VITE_APP_ID) */
  clientId?: string;
  /** Enable pako decompression of SSO responses (falls back to VITE_API_ENCRYPTION_ENABLED) */
  encryptionEnabled?: boolean;
}

export interface SigningConfig {
  signingSecret: string;
  clientId: string;
}
