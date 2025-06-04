import { Organization, User, Team, Role, UserRole, Platform, PlanType } from '@prisma/client'

// Database types with relations
export type UserWithRoles = User & {
  userRoles: (UserRole & {
    role: Role
    organization?: Organization
    team?: Team
  })[]
}

export type OrganizationWithTeams = Organization & {
  teams: Team[]
  userRoles: (UserRole & {
    user: User
    role: Role
  })[]
}

export type TeamWithMembers = Team & {
  userRoles: (UserRole & {
    user: User
    role: Role
  })[]
}

// Workflow types
export interface WorkflowTrigger {
  type: 'schedule' | 'event' | 'date' | 'response'
  schedule?: string // Cron expression
  event?: string
  dateField?: string
  time?: string
  timezone?: string
}

export interface WorkflowAction {
  type: 'send_message' | 'send_survey' | 'generate_summary' | 'post_to_channel' | 'random_pairing' | 'schedule_meeting'
  template?: string
  questions?: Question[]
  channel?: string
  recipients?: string[]
  delay?: number
  pairCount?: number
  excludePreviousPairs?: boolean
  lookbackWeeks?: number
}

export interface Question {
  id: string
  text: string
  type: 'text' | 'scale' | 'choice' | 'boolean'
  required: boolean
  options?: string[]
  scale?: {
    min: number
    max: number
    labels?: string[]
  }
}

export interface WorkflowDefinition {
  type: 'workflow'
  triggers: WorkflowTrigger[]
  actions: WorkflowAction[]
  conditions?: WorkflowCondition[]
}

export interface WorkflowCondition {
  field: string
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than'
  value: unknown
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Form types
export interface CreateOrganizationData {
  name: string
  slug: string
  description?: string
  timezone: string
}

export interface CreateTeamData {
  name: string
  description?: string
  color?: string
}

export interface CreateWorkflowData {
  name: string
  description?: string
  definition: WorkflowDefinition
  teamId?: string
}

// Authentication types
export interface SessionUser extends Pick<User, 'id' | 'name' | 'email' | 'image'> {
  organizationId?: string | null
  role?: string | null
}

// Analytics types
export interface AnalyticsData {
  totalUsers: number
  activeWorkflows: number
  monthlyExecutions: number
  responseRate: number
  engagement: {
    date: string
    value: number
  }[]
}

// Integration types
export interface IntegrationConfig {
  platform: Platform
  credentials: Record<string, unknown>
  settings: Record<string, unknown>
}

// Subscription types
export interface SubscriptionInfo {
  planType: PlanType
  status: string
  currentPeriodEnd?: Date
  cancelAtPeriodEnd: boolean
  features: string[]
  limits: {
    users: number
    workflows: number
    executions: number
  }
}

// Multi-tenant context
export interface TenantContext {
  organizationId: string
  organization: Organization
  userRole: UserRole & {
    role: Role
  }
  permissions: string[]
}

// Webhook types
export interface WebhookEvent {
  type: string
  data: Record<string, unknown>
  timestamp: Date
  organizationId: string
}

export { Platform, PlanType } 