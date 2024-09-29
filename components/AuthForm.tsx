'use client'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {Form} from "@/components/ui/form"
import CustomInput from './CustomInput'
import { authFormSchema } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { signIn, signUp } from '@/lib/actions/user.actions'
import PlaidLink from './ui/PlaidLink'

const AuthForm = ({type}: {type: string}) => {

    const router = useRouter();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const formSchema = authFormSchema(type);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
        email: "",
        password: ""
        },
    })
    
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setIsLoading(true)
        try {
            if (type === 'sign-up') {

                const userData = {
                    firstName: data.firstName!,
                    lastName: data.lastName!,
                    address1: data.address1!,
                    city: data.city!,
                    state: data.state!,
                    postalCode: data.postalCode!,
                    dateOfBirth: data.dateOfBirth!,
                    ssn: data.ssn!,
                    email: data.email,
                    password: data.password
                }

                const newUser = await signUp(userData);
                setUser(newUser);
                
            } else if (type === 'sign-in') {
                const response = await signIn({
                    email: data.email,
                    password: data.password
                })

                if (response) router.push('/')
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }

return (
    <section className='auth-form'>
        <header className='flex flex-col gap-5 md:gap-8'>
            <Link href={"/"} className='cursor-pointer items-center gap-1 flex'>
                <Image src={'/icons/logo.svg'} 
                height={34} 
                width={34} 
                alt='Horizon logo'
                />
                <h1 className='text-26 font-ibm-plex-serif font-bold text-black-1'>Horizon</h1>
            </Link>
            <div className='flex flex-col gap-1 md:gap-3'>
                <h1 className='text-24 lg:text-36 font-semibold text-gray-900'>
                    {user ? 'Link Account' : type === 'sign-in' ? 'Sign in' : 'Sign up'}
                </h1>
                <p className='text-16 font-normal text-gray-600'>
                    {user ? 'Link your account to get started' : "Please enter your details"}
                </p>
            </div>
        </header>
        {user ? (
            <div className='flex flex-col gap-4'>
                <PlaidLink user={user} variant={"primary"}/>
            </div>
        ): <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                    {type === 'sign-up' && (
                        <>  
                            <div className='flex gap-4'>
                                <CustomInput control={form.control} name={'firstName'} placeholder={'Enter your first name'} label={"First Name"}
                                type='text'/>
                                <CustomInput control={form.control} name={'lastName'} placeholder={'Enter your last name'} label={"Last Name"}
                            type='text'/>
                            </div>
                            <CustomInput control={form.control} name={'address1'} placeholder={'Enter your specific address'} label={"Address"}
                            type='text'/>
                            <CustomInput control={form.control} name={'city'} placeholder={'Enter your city'} label={"City"}
                            type='text'/>
                            <div className='flex gap-4'>
                                <CustomInput control={form.control} name={'state'} placeholder={'ex: NY'} label={"State"}
                                type='text'/>
                                <CustomInput control={form.control} name={'postalCode'} placeholder={'ex: 11101'} label={"Postal Code"}
                                type='text'/>
                            </div>
                            <div className='flex gap-4'>
                                <CustomInput control={form.control} name={'dateOfBirth'} placeholder={'yyyy-mm-dd'} label={"Date of Birth"}
                                type='text'/>
                                <CustomInput control={form.control} name={'ssn'} placeholder={'ex: 1234'} label={"SSN"}
                                type='text'/>
                            </div>
                        </>
                    )}

                    <CustomInput control={form.control} name={'email'} placeholder={'Enter your email'} label={"Email"}
                    type='text'></CustomInput>

                    <CustomInput control={form.control} name={'password'} placeholder={'Enter your password'} label={"Password"}
                    type='password'></CustomInput>

                    <div className='flex flex-col gap-4'>
                        <Button type="submit" disabled={isLoading} className='form-btn'>
                            {isLoading ? (
                                <>
                                <Loader2 size={20} className='animate-spin'></Loader2> &nbsp;
                                Loading...
                                </>
                            ): type === 'sign-in' ? "Sign in" : "Sign up"}
                        </Button>
                    </div>
                    
                </form>
            </Form>

            <footer className='flex justify-center gap-1'>
                <p className='text-14 font-normal text-gray-600'>{type == 'sign-in' ? "Don't have an account? " : "Already have an account"}</p>
                <Link href={type == 'sign-in' ? '/sign-up' : '/sign-in'} className='form-link'>{
                    type == 'sign-in' ? 'Sign up' : "Sign in"
                }</Link>
            </footer>
        </>
    }        
    </section>
  )
}

export default AuthForm
