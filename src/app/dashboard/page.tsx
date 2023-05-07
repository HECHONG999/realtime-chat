import {FC} from 'react'
import Button from '@/components/Button'
import { getServerSession } from 'next-auth'
interface pageProps {

}
const page= async ({}) => {
    const session = await getServerSession()
    return <div className='min-h-screen'>
        {JSON.stringify(session)}
    </div>
}

export default page