import { FC } from 'react'
import { fetchRedis } from '@/helpers/redis';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import ChatInput from "@/components/ChatInput"
import Messages from '@/components/Messages'
import { messageArrayValidator } from '@/lib/validations/message';
import Button from "@/components/ui/Button";
interface pageProps {
  params: {
    chatId: string
  }
}

async function getChatMessages(chatId:string) {
  try{
    const results: string[] = await fetchRedis(
      'zrange',
      `chat:${chatId}:messages`,
      0,
      -1
    )
    const dbMessages = results.map((message) => JSON.parse(message) as Message)
    const reversedDbMessages = dbMessages.reverse()

    const messages = messageArrayValidator.parse(reversedDbMessages)

    return messages
  }catch (error) {
    notFound()
  }
}

const page  = async({params}: pageProps) => {
    const chatId = params.chatId
    const session = await getServerSession(authOptions)
    if(!session) notFound()
    const {user} = session
    const [userId1, userId2] = chatId.split('--')

    if(user.id !== userId1 && user.id !== userId2) {
        notFound()
    }
    // get currently chat user id
    const chatPartnerId = user.id === userId1 ? userId2 : userId1
    // get currently partner
    const chatPartnerRow = (await fetchRedis(
        'get',
        `user:${chatPartnerId}`
    )) as string
    const chatPartner = JSON.parse(chatPartnerRow) as User
    const initialMessages = await getChatMessages(chatId)
    return  (
        <div className='flex-1 justify-between flex flex-col h-full max-h-[calc(100vh-6rem)]'>
      <div className='flex justify-between py-3 border-b-2 border-gray-200 sm:items-center'>
        <div className='relative flex items-center space-x-4'>
          <div className='relative'>
            <div className='relative w-8 h-8 sm:w-12 sm:h-12'>
              <Image
                fill
                referrerPolicy='no-referrer'
                src={chatPartner.image}
                alt={`${chatPartner.name} profile picture`}
                className='rounded-full'
              />
            </div>
          </div>

          <div className='flex flex-col leading-tight'>
            <div className='flex items-center text-xl'>
              <span className='mr-3 font-semibold text-gray-700'>
                {chatPartner.name}
              </span>
            </div>

            <span className='text-sm text-gray-600'>{chatPartner.email}</span>
          </div>
        </div>
          <div>
              <Button>
                  查看好友詳情
              </Button>
          </div>
      </div>

      <Messages
        chatId={chatId}
        chatPartner={chatPartner}
        sessionImg={session.user.image}
        sessionId={session.user.id}
        initialMessages={initialMessages}
      />

      <ChatInput chatId={chatId} chatPartner={chatPartner} />
    </div>
    )
}

export default page
