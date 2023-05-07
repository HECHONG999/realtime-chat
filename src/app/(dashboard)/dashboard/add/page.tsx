import { FC } from 'react'
import AddFriendButton from '@/components/AddFriendButton'


const page: FC = ({}) => {
  return <div className='mt-8'>
    <h1 className='mb-8 text-5xl font-bold '>Add a friend</h1>
    <AddFriendButton/>
  </div>
}

export default page