import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { ApiResponse } from '@/types'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    if (!email || !password) {
      const response: ApiResponse = {
        success: false,
        error: 'Missing email or password',
      }
      return NextResponse.json(response, { status: 400 })
    }

    const existing = await db.user.findUnique({ where: { email } })
    if (existing) {
      const response: ApiResponse = {
        success: false,
        error: 'User already exists',
      }
      return NextResponse.json(response, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await db.user.create({
      data: { name, email, hashedPassword },
    })

    const response: ApiResponse = {
      success: true,
      data: { id: user.id, email: user.email },
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error('Error registering user:', error)
    const response: ApiResponse = {
      success: false,
      error: 'Failed to register user',
    }
    return NextResponse.json(response, { status: 500 })
  }
}
