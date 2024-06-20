'use client'
import { sidebarLinks } from '@/constants'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const Sidebar = ({user}: SiderbarProps) => {

    const pathName = usePathname();
  return (
    <section className='sidebar'>
      <nav className='flex flex-col gap-4'>
        <Link href={"/"} className='cursor-pointer items-center gap-2 flex'>
            <Image src={'/icons/logo.svg'} 
            height={34} 
            width={34} 
            alt='Horizon logo'
            className='size-[24px] max-xl:size-14'
            />
            <h1 className='sidebar-logo'>Horizon</h1>
        </Link>
        {sidebarLinks.map((link) => {
            const isActive = pathName === link.route || pathName.startsWith(`${link.route}/`)

            return (
                <Link className={cn('sidebar-link', {
                    'bg-bank-gradient': isActive
                })} href={link.route} key={link.label}>
                    <div className='relative size-6'>
                        <Image 
                        src={link.imgURL}
                        alt={link.label}
                        fill
                        className={cn({'brightness-[3] invert-0' : isActive})}
                        />
                    </div>
                    <p className={cn('sidebar-label', {
                        '!text-white': isActive
                    })}>{link.label}</p>
                </Link>
            )
        })}
        USER
      </nav>
      FOOTER
    </section>
  )
}

export default Sidebar
