import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create system roles
  const roles = await createSystemRoles()
  console.log('✅ Created system roles')

  // Create sample organization
  const organization = await createSampleOrganization(roles.owner.id)
  console.log('✅ Created sample organization')

  // Create workflow templates
  await createWorkflowTemplates(organization.id)
  console.log('✅ Created workflow templates')

  console.log('🎉 Database seeding completed!')
}

async function createSystemRoles() {
  const roles = {
    owner: await prisma.role.upsert({
      where: { name: 'organization_owner' },
      update: {},
      create: {
        name: 'organization_owner',
        description: 'Full access to organization settings and data',
        level: 100,
        isSystem: true,
        permissions: {
          organization: ['read', 'write', 'delete'],
          teams: ['read', 'write', 'delete'],
          users: ['read', 'write', 'delete'],
          workflows: ['read', 'write', 'delete'],
          integrations: ['read', 'write', 'delete'],
          billing: ['read', 'write'],
          analytics: ['read']
        }
      }
    }),

    admin: await prisma.role.upsert({
      where: { name: 'organization_admin' },
      update: {},
      create: {
        name: 'organization_admin',
        description: 'Administrative access to organization features',
        level: 80,
        isSystem: true,
        permissions: {
          organization: ['read', 'write'],
          teams: ['read', 'write', 'delete'],
          users: ['read', 'write'],
          workflows: ['read', 'write', 'delete'],
          integrations: ['read', 'write'],
          analytics: ['read']
        }
      }
    }),

    teamLead: await prisma.role.upsert({
      where: { name: 'team_lead' },
      update: {},
      create: {
        name: 'team_lead',
        description: 'Lead and manage team activities',
        level: 60,
        isSystem: true,
        permissions: {
          teams: ['read', 'write'],
          users: ['read'],
          workflows: ['read', 'write'],
          integrations: ['read']
        }
      }
    }),

    member: await prisma.role.upsert({
      where: { name: 'team_member' },
      update: {},
      create: {
        name: 'team_member',
        description: 'Participate in team activities',
        level: 40,
        isSystem: true,
        permissions: {
          teams: ['read'],
          workflows: ['read'],
          responses: ['write']
        }
      }
    }),

    viewer: await prisma.role.upsert({
      where: { name: 'viewer' },
      update: {},
      create: {
        name: 'viewer',
        description: 'Read-only access to team data',
        level: 20,
        isSystem: true,
        permissions: {
          teams: ['read'],
          workflows: ['read']
        }
      }
    })
  }

  return roles
}

async function createSampleOrganization(ownerRoleId: string) {
  // Create demo user (you can update this with real user after authentication is set up)
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@autostandup.com' },
    update: {},
    create: {
      email: 'demo@autostandup.com',
      name: 'Demo User',
      emailVerified: new Date()
    }
  })

  // Create sample organization
  const organization = await prisma.organization.upsert({
    where: { slug: 'demo-org' },
    update: {},
    create: {
      name: 'Demo Organization',
      slug: 'demo-org',
      subdomain: 'demo',
      description: 'A sample organization for testing Auto Standup',
      planType: 'BUSINESS',
      timezone: 'America/New_York',
      createdBy: demoUser.id
    }
  })

  // Assign owner role to demo user
  await prisma.userRole.upsert({
    where: {
      userId_roleId_organizationId_teamId: {
        userId: demoUser.id,
        roleId: ownerRoleId,
        organizationId: organization.id,
        teamId: null
      }
    },
    update: {},
    create: {
      userId: demoUser.id,
      roleId: ownerRoleId,
      organizationId: organization.id
    }
  })

  // Create sample teams
  const engineeringTeam = await prisma.team.create({
    data: {
      name: 'Engineering',
      description: 'Software development team',
      color: '#3B82F6',
      organizationId: organization.id
    }
  })

  const designTeam = await prisma.team.create({
    data: {
      name: 'Design',
      description: 'Product design team',
      color: '#8B5CF6',
      organizationId: organization.id
    }
  })

  return organization
}

async function createWorkflowTemplates(organizationId: string) {
  const templates = [
    {
      name: 'Daily Standup',
      description: 'Automated daily team check-ins with custom questions',
      category: 'Team Communication',
      config: {
        type: 'workflow',
        triggers: [
          {
            type: 'schedule',
            schedule: '0 9 * * 1-5', // 9 AM on weekdays
            timezone: 'America/New_York'
          }
        ],
        actions: [
          {
            type: 'send_survey',
            questions: [
              {
                id: 'yesterday',
                text: 'What did you accomplish yesterday?',
                type: 'text',
                required: true
              },
              {
                id: 'today',
                text: 'What are you working on today?',
                type: 'text',
                required: true
              },
              {
                id: 'blockers',
                text: 'Any blockers or help needed?',
                type: 'text',
                required: false
              },
              {
                id: 'mood',
                text: 'How are you feeling today?',
                type: 'scale',
                scale: { min: 1, max: 5, labels: ['😞', '😐', '😊', '😄', '🚀'] },
                required: false
              }
            ]
          },
          {
            type: 'generate_summary',
            delay: 60 // Wait 1 hour for responses
          },
          {
            type: 'post_to_channel',
            channel: '#daily-standup'
          }
        ]
      },
      isPublic: true,
      isOfficial: true
    },
    {
      name: 'Weekly Retrospective',
      description: 'Weekly team reflection and improvement planning',
      category: 'Team Communication',
      config: {
        type: 'workflow',
        triggers: [
          {
            type: 'schedule',
            schedule: '0 16 * * 5', // 4 PM on Fridays
            timezone: 'America/New_York'
          }
        ],
        actions: [
          {
            type: 'send_survey',
            questions: [
              {
                id: 'went_well',
                text: 'What went well this week?',
                type: 'text',
                required: true
              },
              {
                id: 'could_improve',
                text: 'What could we improve?',
                type: 'text',
                required: true
              },
              {
                id: 'action_items',
                text: 'What action items should we prioritize next week?',
                type: 'text',
                required: false
              }
            ]
          }
        ]
      },
      isPublic: true,
      isOfficial: true
    },
    {
      name: 'Birthday Celebration',
      description: 'Automated birthday wishes and team celebrations',
      category: 'Team Building',
      config: {
        type: 'workflow',
        triggers: [
          {
            type: 'date',
            dateField: 'birthday',
            time: '09:00'
          }
        ],
        actions: [
          {
            type: 'send_message',
            template: '🎉 Happy Birthday {{user.name}}! Hope you have a wonderful day! 🎂',
            recipients: ['team']
          },
          {
            type: 'send_survey',
            questions: [
              {
                id: 'birthday_message',
                text: 'Share a birthday message for {{user.name}}!',
                type: 'text',
                required: false
              }
            ]
          }
        ]
      },
      isPublic: true,
      isOfficial: true
    },
    {
      name: 'Virtual Coffee Chat',
      description: 'Random teammate pairing for casual conversations',
      category: 'Team Building',
      config: {
        type: 'workflow',
        triggers: [
          {
            type: 'schedule',
            schedule: '0 10 * * 3', // 10 AM on Wednesdays
            timezone: 'America/New_York'
          }
        ],
        actions: [
          {
            type: 'random_pairing',
            pairCount: 2,
            excludePreviousPairs: true,
            lookbackWeeks: 4
          },
          {
            type: 'send_message',
            template: '☕ You\'ve been paired with {{partner.name}} for this week\'s virtual coffee! Schedule a 15-30 min chat and get to know each other better.',
            recipients: ['pairs']
          }
        ]
      },
      isPublic: true,
      isOfficial: true
    }
  ]

  for (const template of templates) {
    await prisma.template.upsert({
      where: {
        organizationId_name: {
          organizationId: organizationId,
          name: template.name
        }
      },
      update: {},
      create: {
        ...template,
        organizationId: organizationId
      }
    })
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 