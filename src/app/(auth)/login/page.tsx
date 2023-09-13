'use client'

import Button from '@/components/ui/Button'
import { useState } from 'react'
import { signIn,getCsrfToken } from 'next-auth/react'
import { toast} from 'react-hot-toast'
import {router} from "next/client";
const  Login  = () =>  {
  const [isLoading, setIsLoading] = useState<boolean>(false)
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
   async function loginWithGoogle() {
    setIsLoading(true);
    try{
         signIn('google')
    }catch(error) {
      toast.error('Something went wrong with your login')
    }finally {
      setIsLoading(false)
    }
  }
  async function loginWithGithub() {
    setIsLoading(true);
    try{
         signIn('github')
    }catch(error) {
      toast.error('Something went wrong with your login')
    }finally {
      setIsLoading(false)
    }
  }
    const handleSubmit = async (event:any) => {
        event.preventDefault();
        if(username === '' || email === '') {
            toast.error('请完善表单信息')
            return
        }
        const csrfToken = await getCsrfToken()
        // const response = await fetch('/api/auth/callback/credentials', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({
        //         csrfToken,
        //         email,
        //         username,
        //         password
        //     })
        // });
         signIn("Credentials", { username, password ,email,callbackUrl: `${window.location.origin}/dashboard`, redirect: false  }).then(function(result) {
            router.push(result?.url as string)
        }).catch(err => {
            alert("Failed to register: " + err.toString())
        });;
        // handle response
    };

    return (
    <div className='flex items-center justify-center min-h-screen px-4 py-12 sm:px-6 lg:px-8'>
      <div className='flex flex-col items-center w-full max-w-md space-y-8'>
        <div className='flex flex-col items-center gap-8'>
          logo
          <h2 className='mt-6 text-3xl font-bold tracking-tight text-center text-gray-900'> Sign in to your account</h2>
        </div>
          <div className='flex flex-col items-center gap-8 w-full'>
              <form onSubmit={handleSubmit} className='flex-col items-stretch'>
                  <p className='flex-row justify-center my-2.5'>
                      <label className='mr-2 inline-block w-20' >用户名</label>
                      <input name="username" type="text" value={username} onChange={e => setUsername(e.target.value)} />
                  </p>
                 <p className='flex-row justify-center my-2.5'>
                     <label className='mr-2 inline-block w-20'> 邮箱</label>
                     <input name="username" type="text" value={email} onChange={e => setEmail(e.target.value)} />
                 </p>
                  <p className='flex-row justify-center my-2.5'>
                      <label className='mr-2 inline-block w-20'>密码</label>
                      <input name="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                  </p>
                  <Button onClick={handleSubmit}  isLoading={isLoading} className='w-full max-w-sm max-auto' type='button'  >login</Button>
              </form>
          </div>
        <Button onClick={loginWithGoogle} isLoading={isLoading} className='w-full max-w-sm max-auto' type='button'  >
        {isLoading ? null : (
              <svg
                className='w-4 h-4 mr-2'
                aria-hidden='true'
                focusable='false'
                data-prefix='fab'
                data-icon='github'
                role='img'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'>
                <path
                  d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                  fill='#4285F4'
                />
                <path
                  d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                  fill='#34A853'
                />
                <path
                  d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                  fill='#FBBC05'
                />
                <path
                  d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                  fill='#EA4335'
                />
                <path d='M1 1h22v22H1z' fill='none' />
              </svg>
            )}
            Google
        </Button>

        <Button onClick={loginWithGithub} isLoading={isLoading} className='w-full max-w-sm max-auto' type='button'  >
        {isLoading ? null : (
              <svg
                className='w-4 h-4 mr-2'
                aria-hidden='true'
                focusable='false'
                data-prefix='fab'
                data-icon='github'
                role='img'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'>
                <path
                  d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                  fill='#4285F4'
                />
                <path
                  d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                  fill='#34A853'
                />
                <path
                  d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                  fill='#FBBC05'
                />
                <path
                  d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                  fill='#EA4335'
                />
                <path d='M1 1h22v22H1z' fill='none' />
              </svg>
            )}
            github
        </Button>
      </div>
    </div>
  )
}
export default Login
