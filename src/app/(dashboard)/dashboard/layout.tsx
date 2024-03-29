import { FC, ReactNode } from 'react'
import Link from 'next/link'
import {Icons} from '@/components/Icons'
import { SidebarOption } from '@/types/typings'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import SignOutButton from '@/components/SignOutButton'
import FriendRequestSidebarOptions from '@/components/FriendRequestSidebarOptions'
import { fetchRedis } from '@/helpers/redis'
import { getFriendsByUserId } from '@/helpers/get-friends-user-id'
import SidebarChatList from '@/components/SidebarChatList'
import MobileChatLayout from  '@/components/MobileChatLayout'

interface layoutProps {
    children: ReactNode
}
const sidebarOptions: SidebarOption[] = [
    {
      id: 1,
      name: 'Add friend',
      href: '/dashboard/add',
      Icon: 'UserPlus',
    },
  ]
const layout = async({children}:layoutProps) => {
    const session = await getServerSession(authOptions)
    console.log('session=====', session)
    if(!session) notFound()
    const friends = await getFriendsByUserId(session.user.id);
    console.log('friends', friends)

    const unseenRequestCount = (await fetchRedis(
      'smembers',
      `user:${session?.user?.id}:incoming_friend_requests`
      ) as User[]).length

    return (
      <div className='flex w-full h-screen bg-white'>
          <div className='md:hidden'>
            <MobileChatLayout session={session} friends={friends} sidebarOptions={sidebarOptions} unseenRequestCount={unseenRequestCount}/>
          </div>

          <div className='flex-col hidden w-full h-full max-w-xs px-6 overflow-y-auto bg-white border-r border-gray-200 md:flex grow gap-y-5'>
              <Link href='/dashboard' className='flex items-center h-16 shrink-0'>
                  <Icons.Logo className='h-8'></Icons.Logo>
              </Link>

              {friends.length > 0 ? (
                <div className='text-xs font-semibold leading-6 text-gray-400'>
                  Your chats
                </div>
              ) : null}

              <nav className='flex flex-col flex-1 '>
                  <ul className='flex flex-col flex-1 gap-y-7'>
                      <li>
                      <SidebarChatList sessionId={session.user.id} friends={friends} />
                      </li>
                      <li>
                          <div className='text-xs font-semibold leading-6 text-gray-400'>
                              Overview
                          </div>
                          <ul className='mt-2 -mx-2 space-y-1'>
                          {sidebarOptions.map((option) => {
                              const Icon = Icons[option.Icon]
                              return (
                                  <li key={option.id}>
                                  <Link
                                      href={option.href}
                                      className='flex gap-3 p-2 text-sm font-semibold leading-6 text-gray-700 rounded-md hover:text-indigo-600 hover:bg-gray-50 group'>
                                      <span className='text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white'>
                                      <Icon className='w-4 h-4' />
                                      </span>

                                      <span className='truncate'>{option.name}</span>
                                  </Link>
                                  </li>
                              )
                          })}

                          <li>
                              <FriendRequestSidebarOptions sessionId={session?.user?.id} initialUnseenRequestCount={unseenRequestCount}/>
                          </li>
                          </ul>
                      </li>

                      <li className='flex items-center mt-auto -mx-6'>
                <div className='flex items-center flex-1 px-6 py-3 text-sm font-semibold leading-6 text-gray-900 gap-x-4'>
                  <div className='relative w-8 h-8 bg-gray-50'>
                    <Image
                      fill
                      referrerPolicy='no-referrer'
                      className='rounded-full'
                      src={session?.user?.image || ''}
                      alt='Your profile picture'
                    />
                  </div>

                  <span className='sr-only'>Your profile</span>
                  <div className='flex flex-col'>
                    <span aria-hidden='true'>{session?.user?.name}</span>
                    <span className='text-xs text-zinc-400' aria-hidden='true'>
                      {session?.user?.email}
                    </span>
                  </div>
                </div>

                <SignOutButton className='h-full aspect-square' />
              </li>
                  </ul>
              </nav>
          </div>
          <aside className='container w-full max-h-screen px-10 py-16 md:py-12'>
          {children}
        </aside>
      </div>
    )
}

export default layout
