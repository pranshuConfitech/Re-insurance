import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server'

import { auth } from '../../../../libs/auth'

export const config = {
  api: {
    bodyParser: false // Disable bodyParser for raw data handling
  }
}

export async function GET(req: NextRequest) {
  return proxyHandler(req)
}

export async function POST(req: NextRequest) {
  return proxyHandler(req)
}

export async function PUT(req: NextRequest) {
  return proxyHandler(req)
}
export async function PATCH(req: NextRequest) {
  return proxyHandler(req)
}
export async function DELETE(req: NextRequest) {
  return proxyHandler(req)
}

async function proxyHandler(req: NextRequest) {
  try {
    console.log('🔹 Proxy API Init')

    // ✅ Construct target URL
    const REMOTE_API = process.env.REMOTE_API?.replace(/\/$/, '') // Remove trailing slash
    console.log('REMOTE_API from env:', REMOTE_API);
    const url = new URL(req.url)
    const pathSegments = url.pathname.replace(/^\/bapi\//, '') // Remove "/bapi/"
    let targetURL = `${REMOTE_API}/${pathSegments}`

    // ✅ Preserve query parameters
    const queryParams = url.searchParams.toString()

    if (queryParams) {
      targetURL += `?${queryParams}`
    }

    console.log('🔹 Proxying to:', targetURL)
    console.log("Content Type = ", req.headers.get('Content-Type'));

    // ✅ Extract headers & remove host
    const proxyHeaders: HeadersInit = new Headers()

    proxyHeaders.delete('host')

    // // ✅ Extract cookies manually
    // const cookieHeader = req.headers.get('cookie') || ''
    // if (cookieHeader) proxyHeaders.set('Cookie', cookieHeader)

    // ✅ Get session for authentication
    const session: any = await auth()

    if (session?.accessToken) {
      proxyHeaders.set('Authorization', `Bearer ${session.accessToken}`)

    }

    if (req.headers.get('Content-Type')) {
      proxyHeaders.set('Content-Type', `${req.headers.get('Content-Type')}`)
    }

    // ✅ Handle body parsing
    let body: BodyInit | null = null

    if (!['GET', 'HEAD'].includes(req.method)) {
      body = await req.blob() // Fix for Next.js App Router
    }

    // ✅ Make request to backend
    const backendResponse = await fetch(targetURL, {
      method: req.method,
      headers: Object.fromEntries(proxyHeaders),
      body
    })

    // ✅ Forward response headers
    const responseHeaders = new Headers(backendResponse.headers)

    responseHeaders.delete('content-encoding') // Prevent gzip issues

    return new NextResponse(backendResponse.body, {
      status: backendResponse.status,
      headers: responseHeaders
    })
  } catch (error) {
    console.error('❌ Proxy Error:', error)

    return NextResponse.json({ error: 'Proxy request failed.', details: (error as Error).message }, { status: 500 })
  }
}
