import { NextAuthOptions } from 'next-auth'
import { UpstashRedisAdapter } from '@next-auth/upstash-redis-adapter'
import { db } from './db'
import GoogleProvider from 'next-auth/providers/google'
import GithubProvider from 'next-auth/providers/github'
import Credentials from 'next-auth/providers/credentials'
import { fetchRedis } from '@/helpers/redis'
import axios from "axios";
import {v4 as uuidv4} from "uuid";
import {el} from "date-fns/locale";

// @ts-ignore
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
    }),
    Credentials({
      name: 'Credentials',
      credentials: {
        username: {label: "Username", type: "text" },
        password: {  label: "Password", type: "password" },
        email: {label: 'Email', type:'email'}
      },
      //@ts-ignore
      authorize: async (credentials) => {
        // 在这个函数中，你需要自行编写匹配用户名和密码的代码
        // 如果成功，应返回一个User对象；否则返回null

        const uuid = uuidv4()
         const userData = {
           name:credentials?.username,
           image:'https://lh3.googleusercontent.com/a/ACg8ocJLZ2Y_UyTGdI37pplSAUYoc4RWQoc870PNbTGvKHrf=s96-c',
           email: credentials?.email,
           emailVerified:null,
           id: uuid,
           customId: uuid
         }
        return  Promise.resolve(userData)
         const result =await db.get(`user:email:${credentials?.email}`)
       if(result) {
         const user = await db.get(`user:${result}`)
         return Promise.resolve(user)
       }else {
         await db.set(`user:email:${credentials?.email}`,uuid)
          await db.set(`user:${uuid}`, JSON.stringify(userData))
          await db.set(` user:account:by-user-id:${uuid}`,`user:account:google:${uuidv4()}`)
         return Promise.resolve(userData)
       }
      }
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
        session.user.id = token.id ? token.id : token.id
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
