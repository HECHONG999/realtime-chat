import { NextAuthOptions } from "next-auth";
import {UpstashRedisAdapter} from '@next-auth/upstash-redis-adapter'
import { db } from "./db";
import  GoogleProvider from 'next-auth/providers/google'
import GithubProvider from 'next-auth/providers/github'

import { fetchRedis } from '@/helpers/redis'

export const authOptions: NextAuthOptions = {
    adapter: UpstashRedisAdapter(db),
    session: {
        strategy: 'jwt'
    },
    pages: {
        signIn: '/login'
    },
    providers: [
        GoogleProvider({
            clientId: '760503475231-m3njpenar6dpg1apjqh7lo4qfbgecdoo.apps.googleusercontent.com',
            clientSecret: 'AIzaSyASM_idCs8GkMB6loyJJmEfRIIJGBWPfSg',
            httpOptions: {
                timeout: 40000,
              }
        }),
        GithubProvider({
            clientId: '096ac699f576e6414c61',
            clientSecret: '7e90eb3ea66baab754737ee43c47e751716d29ba'
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
