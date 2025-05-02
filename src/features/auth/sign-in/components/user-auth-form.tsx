import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { loginThunk } from '@/store/slices/authSlice'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Icons } from '../../../../components/icons'

export function UserAuthForm() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector((state) => state.auth)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const result = await dispatch(loginThunk(formData))
    if (loginThunk.fulfilled.match(result)) {
      navigate({ to: '/' })
    }
  }

  return (
    <div className='grid gap-6'>
      <form onSubmit={handleSubmit}>
        <div className='grid gap-2'>
          <div className='grid gap-1'>
            <Label htmlFor='email'>Email</Label>
            <Input
              id='email'
              name='email'
              placeholder='name@example.com'
              type='email'
              autoCapitalize='none'
              autoComplete='email'
              autoCorrect='off'
              disabled={loading}
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className='grid gap-1'>
            <Label htmlFor='password'>Password</Label>
            <Input
              id='password'
              name='password'
              placeholder='Enter your password'
              type='password'
              autoComplete='current-password'
              disabled={loading}
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          {error && <div className='text-sm text-red-500'>{error}</div>}
          <Button disabled={loading}>
            {loading && <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />}
            Sign In
          </Button>
        </div>
      </form>
      <div className='relative'>
        <div className='absolute inset-0 flex items-center'>
          <span className='w-full border-t' />
        </div>
        <div className='relative flex justify-center text-xs uppercase'>
          <span className='bg-background text-muted-foreground px-2'>
            Or continue with
          </span>
        </div>
      </div>
      <Button variant='outline' type='button' disabled={loading}>
        {loading ? (
          <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
        ) : (
          <Icons.gitHub className='mr-2 h-4 w-4' />
        )}{' '}
        Github
      </Button>
    </div>
  )
}
