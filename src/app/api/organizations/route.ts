import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { ApiResponse } from '@/types'

export async function GET() {
  try {
    const organizations = await db.organization.findMany({
      include: {
        teams: true,
        _count: {
          select: {
            userRoles: true,
            workflows: true,
          },
        },
      },
    })

    const response: ApiResponse = {
      success: true,
      data: organizations,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching organizations:', error)
    
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch organizations',
    }

    return NextResponse.json(response, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, slug, description, timezone, createdBy } = body

    // Validate required fields
    if (!name || !slug || !createdBy) {
      const response: ApiResponse = {
        success: false,
        error: 'Missing required fields: name, slug, createdBy',
      }
      return NextResponse.json(response, { status: 400 })
    }

    // Check if slug is already taken
    const existingOrg = await db.organization.findUnique({
      where: { slug },
    })

    if (existingOrg) {
      const response: ApiResponse = {
        success: false,
        error: 'Organization slug already exists',
      }
      return NextResponse.json(response, { status: 409 })
    }

    // Create organization
    const organization = await db.organization.create({
      data: {
        name,
        slug,
        description,
        timezone: timezone || 'UTC',
        createdBy,
      },
      include: {
        teams: true,
        creator: true,
      },
    })

    // Assign owner role to creator
    const ownerRole = await db.role.findUnique({
      where: { name: 'organization_owner' },
    })

    if (ownerRole) {
      await db.userRole.create({
        data: {
          userId: createdBy,
          roleId: ownerRole.id,
          organizationId: organization.id,
        },
      })
    }

    const response: ApiResponse = {
      success: true,
      data: organization,
      message: 'Organization created successfully',
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error('Error creating organization:', error)
    
    const response: ApiResponse = {
      success: false,
      error: 'Failed to create organization',
    }

    return NextResponse.json(response, { status: 500 })
  }
} 