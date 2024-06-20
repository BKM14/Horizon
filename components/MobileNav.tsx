'use client'
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetClose
} from "@/components/ui/sheet"
import { sidebarLinks } from "@/constants"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import React from 'react'



const MobileNav = ({user}: MobileNavProps) => {
    const pathName = usePathname();
  return (
    <section className="w-full max-w-[264px]">
        <Sheet>
            <SheetTrigger>
                <Image src='/icons/hamburger.svg' width={30} height={30} alt="menu" className="pointer"></Image>
            </SheetTrigger>
            <SheetContent side='left' className='border-none bg-white'>
                <Link href={"/"} className='cursor-pointer items-center gap-1 flex px-4'>
                <Image src={'/icons/logo.svg'} 
                height={34} 
                width={34} 
                alt='Horizon logo'
                />
                <h1 className='text-26 font-ibm-plex-serif font-bold text-black-1'>Horizon</h1>
            </Link>
            <div className="mobilenav-sheet">
                <SheetClose asChild>
                    <nav className="flex h-full flex-col gap-6 pt-16 text-white">
                        {sidebarLinks.map((link) => {
                        const isActive = pathName === link.route || pathName.startsWith(`${link.route}/`)

                        return (
                            <SheetClose asChild key={link.route}>
                                <Link className={cn('mobilenav-sheet_close w-full', {
                                    'bg-bank-gradient': isActive
                                })} href={link.route} key={link.label}>
                                        <Image 
                                        src={link.imgURL}
                                        alt={link.label}
                                        height={20}
                                        width={20}
                                        className={cn({'brightness-[3] invert-0' : isActive})}
                                        />
                                    <p className={cn('text-16 font-semibold text-black-2', {
                                        '!text-white': isActive
                                    })}>{link.label}</p>
                                </Link>
                        </SheetClose>
                    )})}
                    USER
                    </nav>
                </SheetClose>
                FOOTER
            </div>
            </SheetContent>
        </Sheet>

    </section>
  )
}
export default MobileNav
