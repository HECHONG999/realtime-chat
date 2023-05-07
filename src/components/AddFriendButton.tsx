'use client'
import { FC, useState } from 'react'
import Button from './Button'
import { useForm, Resolver } from "react-hook-form";
import z from 'zod'
import { addFriendValidator } from '@/lib/validations/add-friend';
import {zodResolver} from '@hookform/resolvers/zod'
import axios , { AxiosError } from 'axios';
type FormData = z.infer<typeof addFriendValidator>
interface AddFriendButtonProps {}

const AddFriendButton: FC<AddFriendButtonProps> = ({}) => {
    const [showSuccessState, setShowSuccessState] = useState<boolean>(false)
    const { register, handleSubmit, setError, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(addFriendValidator)
    });
    const addFriend = async (email:string) => {
        try{
            const validatedEmail = addFriendValidator.parse({email}) // get email value after zod parse
            // /api/friends/add nextjs 强制约定 在app 下 创建的 api 路由
            await axios.post('/api/friends/add', {
                email: validatedEmail,
              })
        
              setShowSuccessState(true)
        }catch(error) {
            if( error instanceof z.ZodError) {
                setError('email', {message: error.message})
                return
            }
            if(error instanceof AxiosError) {
                setError('email', { message: error.response?.data })
                return
            }
            setError('email', { message: 'Something went wrong.' })
        }
    }
    const onSubmit = (data: FormData) => {
        addFriend(data.email)
    }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className='max-w-sm'>
        <label htmlFor="email" className='block text-sm font-medium leading-6 text-gray-900'>
            Add friend by E-Mail
        </label>
        <div className='flex gap-4 mt-2'>
            <input
            {...register('email')}
            type='text'
            className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
            placeholder='you@example.com'
            />
            <Button>Add</Button>
        </div>
        <p className='mt-1 text-sm text-red-600'>{errors.email?.message}</p>
        {showSuccessState ? (
        <p className='mt-1 text-sm text-green-600'>Friend request sent!</p>
      ) : null}
    </form>
  )
}

export default AddFriendButton