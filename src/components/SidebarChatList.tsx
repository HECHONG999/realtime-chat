'use client'
import { chatHrefConstructor, toPusherKey } from '@/lib/utils'
import { FC, useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { pusherClient } from '@/lib/pusher'
import toast from 'react-hot-toast'
import UnseenChatToast from './UnseenChatToast'

interface SidebarChatListProps {
  friends: User []
  sessionId: string
}

interface ExtendedMessage extends Message {
  senderImg: string
  senderName: string
}

const SidebarChatList: FC<SidebarChatListProps> = ({friends, sessionId}) => {
  const router = useRouter()
  const pathname = usePathname()
  const [unseenMessages, setUnseenMessages] = useState<Message[]>([])
  const [activeChats, setactiveChats] = useState<User[]>(friends)

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:chats`))
    pusherClient.bind('new_message', newMessageChatHandler)

    pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`))
    pusherClient.bind('new_friend', newFriendHandler)
  })
  const newFriendHandler = (newFriend: User) => {
    console.log("received new user", newFriend)
    setactiveChats((prev) => [...prev, newFriend])
  }

  const newMessageChatHandler = (message: ExtendedMessage) => {
    //whether show notify
    const shouldNotify = pathname !== `/dashboard/chat/${chatHrefConstructor(sessionId, message.senderId)}`
    if (!shouldNotify) return

    // 显示通知处理
      // should be notified
      toast.custom((t) => (
        <UnseenChatToast
          t={t}
          sessionId={sessionId}
          senderId={message.senderId}
          senderImg={message.senderImg}
          senderMessage={message.text}
          senderName={message.senderName}
        />
      ))

      setUnseenMessages((prev) => [...prev, message])
  }
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