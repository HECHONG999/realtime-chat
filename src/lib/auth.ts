import { NextAuthOptions } from 'next-auth'
import { UpstashRedisAdapter } from '@next-auth/upstash-redis-adapter'
import { db } from './db'
import GoogleProvider from 'next-auth/providers/google'
import GithubProvider from 'next-auth/providers/github'
import { fetchRedis } from '@/helpers/redis'

export const authOptions: NextAuthOptions = {
  adapter: UpstashRedisAdapter(db),
  session: {
    strategy: 'jwt',
  },

  pages: {
    signIn: '/login',
  },
  providers: [
    GoogleProvider({
      clientId: '760503475231-he1vcoh4aih2nsa8lels4qrpf4toggvh.apps.googleusercontent.com',
      clientSecret: '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',
    }),
    GithubProvider({
      clientId: '096ac699f576e6414c61',
      clientSecret: '633ddd1d0dbca07c11dd513be8668ea3d0554da7'
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
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
        picture: dbUser.image,
      }
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.email = token.email
        session.user.image = token.picture
      }

      return session
    },
    redirect() {
      return '/dashboard'
    },
  },
}
