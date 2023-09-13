/**
* Date: 2023/09/13 13:37
* Author: chonghe
* Email: chong@intrii.com
* Copyright: (c) 2023, 英荟科技有限公司
*/
import { getToken } from 'next-auth/jwt'
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
    async function middleware(req) {
        const pathname = req.nextUrl.pathname

        // Manage route protection
        const isAuth = await getToken({ req })
        const isLoginPage = pathname.startsWith('/login')

        const sensitiveRoutes = ['/dashboard']
        const isAccessingSensitiveRoute = sensitiveRoutes.some((route) =>
            pathname.startsWith(route)
        )

        if (isLoginPage) {
            if (isAuth) {
                return NextResponse.redirect(new URL('/dashboard', req.url))
            }

            return NextResponse.next()
        }

        if (!isAuth && isAccessingSensitiveRoute) {
            return NextResponse.redirect(new URL('/login', req.url))
        }

        if (pathname === '/') {
            return NextResponse.redirect(new URL('/dashboard', req.url))
        }
    },
    {
        callbacks: {
            async authorized() {
                return true
            },
        },
    }
)

export const config = {
    matchter: ['/', '/login', '/dashboard/:path*'],
}
