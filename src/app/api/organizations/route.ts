import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/types";

export async function GET() {
  try {
    const organizations = await prisma.organization.findMany({
      include: {
        teams: true,
        _count: {
          select: {
            userRoles: true,
            workflows: true,
          },
        },
      },
    });

    const response: ApiResponse = {
      success: true,
      data: organizations,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching organizations:", error);

    const response: ApiResponse = {
      success: false,
      error: "Failed to fetch organizations",
    };

    return NextResponse.json(response, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, description, timezone, createprismay } = body;

    // Validate required fields
    if (!name || !slug || !createprismay) {
      const response: ApiResponse = {
        success: false,
        error: "Missing required fields: name, slug, createprismay",
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Check if slug is already taken
    const existingOrg = await prisma.organization.findUnique({
      where: { slug },
    });

    if (existingOrg) {
      const response: ApiResponse = {
        success: false,
        error: "Organization slug already exists",
      };
      return NextResponse.json(response, { status: 409 });
    }

    // Create organization
    const organization = await prisma.organization.create({
      data: {
        name,
        slug,
        description,
        timezone: timezone || "UTC",
        createprismay,
      },
      include: {
        teams: true,
        creator: true,
      },
    });

    // Assign owner role to creator
    const ownerRole = await prisma.role.findUnique({
      where: { name: "organization_owner" },
    });

    if (ownerRole) {
      await prisma.userRole.create({
        data: {
          userId: createprismay,
          roleId: ownerRole.id,
          organizationId: organization.id,
        },
      });
    }

    const response: ApiResponse = {
      success: true,
      data: organization,
      message: "Organization created successfully",
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Error creating organization:", error);

    const response: ApiResponse = {
      success: false,
      error: "Failed to create organization",
    };

    return NextResponse.json(response, { status: 500 });
  }
}
