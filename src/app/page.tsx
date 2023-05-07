import { db } from '@/lib/db'
import Button from '@/components/ui/Button'

export default async function Home() {
  await db.set('hello','helloeeee')
  return (
    <div className='min-h-screen'>
      <Button variant='gost' >Hello</Button>
    </div>
  )
}
