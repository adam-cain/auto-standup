/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

export interface User {
  id: string
  email: string
  name: string | null
  hashedPassword: string | null
  image: string | null
}

export interface Organization {
  id: string
  name: string
}

export interface Team {
  id: string
  name: string
}

export interface Role {
  id: string
  name: string
}

export interface UserRole {
  id: string
  userId: string
  organizationId: string | null
  teamId: string | null
  roleId: string
}

export type Platform = string
export type PlanType = string

export class PrismaClient {
  user: any
  userRole: any
  role: any
  organization: any
  team: any
  account: any
  session: any
  template: any
  verificationToken: any
  constructor(_: any = {}) {}
  async $disconnect(): Promise<void> {}
}

