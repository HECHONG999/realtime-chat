'use client'
import { chatHrefConstructor } from '@/lib/utils'
import { FC, useState } from 'react'

interface SidebarChatListProps {
  friends: User []
  sessionId: string
}

const SidebarChatList: FC<SidebarChatListProps> = ({friends, sessionId}) => {
  const [unseenMessages, setUnseenMessages] = useState<Message[]>([])
  const [activeChats, setactiveChats] = useState<User[]>(friends)
  return (
    <ul role='list' className='max-h-[25rem] overflow-y-auto -mx-2 space-y-1'>
    {
        activeChats.sort().map((friend) => {
            const unseenMessagesCount = unseenMessages.filter((unseenMsg) => {
                return unseenMsg.senderId === friend.id
              }).length

              return (
                <li key={friend.id}>
                  <a
                    href={`/dashboard/chat/${chatHrefConstructor(
                      sessionId,
                      friend.id
                    )}`}
                    className='flex items-center p-2 text-sm font-semibold leading-6 text-gray-700 rounded-md hover:text-indigo-600 hover:bg-gray-50 group gap-x-3'>
                    {friend.name}
                    {unseenMessagesCount > 0 ? (
                      <div className='flex items-center justify-center w-4 h-4 text-xs font-medium text-white bg-indigo-600 rounded-full'>
                        {unseenMessagesCount}
                      </div>
                    ) : null}
                  </a>
                </li>
              )
        })
       
    }
  </ul>
  )
}

export default SidebarChatList