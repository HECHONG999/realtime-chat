import { NextAuthOptions } from "next-auth";
import {UpstashRedisAdapter} from '@next-auth/upstash-redis-adapter'
import { db } from "./db";
import  GoogleProvider from 'next-auth/providers/google'
import { fetchRedis } from '@/helpers/redis'

export const authOptions: NextAuthOptions = {
    adapter: UpstashRedisAdapter(db),
    session: {
        strategy: 'jwt'
    },
    secret:'111',
    pages: {
        signIn: '/login'
    },
    providers: [
        GoogleProvider({
            clientId: '760503475231-m3njpenar6dpg1apjqh7lo4qfbgecdoo.apps.googleusercontent.com',
            clientSecret: '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',
            httpOptions: {
                timeout: 40000,
              }
        })
    ],
    callbacks: {
        async jwt ({token, user}) {
            const dbUserResult = (await fetchRedis('get', `user:${token.id}`)) as
            | string
            | null
    
          if (!dbUserResult) {
            if (user) {
              token.id = user!.id
            }
    
            return token
          }
    
          const dbUser = JSON.parse(dbUserResult) as User
            return {
                id: dbUser.id,
                name: dbUser.name,
                email: dbUser.email,
                picture: dbUser.image
            }
        },
        async session({session, token}) {
            console.log('session==', session)
            if(token) {
                session.user.id  = token.id;
                session.user.email = token.email;
                session.user.name = token.name;
                session.user.image = token.picture
            }
            return session;
        },
        redirect() {
            return '/dashboard'
        }
    },
}

function getGoogleCredentials () {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    console.log('client', clientId)
    if(!clientId || clientId.length === 0) {
        throw new Error('Missing GOOGLE_CLIENT_ID')
    }
    if(!clientSecret || clientSecret.length === 0) {
        throw new Error('Missing GOOGLE_CLIENT_SECRET')
    }
    debugger
    return {
        clientId,
        clientSecret
    }
}
