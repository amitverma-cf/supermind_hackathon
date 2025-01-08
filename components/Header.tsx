import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarTrigger,
} from "@/components/ui/menubar"
import { AlignJustify, ArrowUpRight, Download, University } from "lucide-react"
import Link from "next/link"

export function Header() {
    return (
        <Menubar className="fixed bottom-0 lg:bottom-8 w-full lg:left-1/3 lg:w-fit mx-auto inset-x-0 h-14 lg:border-2 gap-4 px-4 shadow-xl border-black justify-between lg:justify-evenly rounded-none lg:rounded-md dark:border-white z-50 transition-transform">
            <University className="text-red-500 -mt-1" />
            <div className={`hidden md:flex gap-6`}>
                <MenubarMenu>
                    <Link href={"https://github.com/amitverma-cf/supermind_hackathon"}>Github <ArrowUpRight className="inline transition-opacity" /></Link>
                </MenubarMenu>
                <MenubarMenu>
                    <Link href={"https://youtube.com"}>Watch Video <ArrowUpRight className="inline transition-opacity" /></Link>
                </MenubarMenu>
                <MenubarMenu>
                    <MenubarTrigger className="cursor-pointer">More</MenubarTrigger>
                    <MenubarContent>
                        <MenubarItem >
                            <Link href="/data.csv" download="data.csv">Download CSV <Download className="inline" /></Link>
                        </MenubarItem>
                        <MenubarSeparator />
                        <MenubarItem className="text-center font-bold">
                            Team Members
                        </MenubarItem>
                        <MenubarSeparator />
                        <MenubarItem >
                            <Link href={"https://www.linkedin.com/in/amve-me"}>Amit Verma <ArrowUpRight className="inline" /></Link>
                        </MenubarItem>
                        <MenubarItem >
                            <Link href={"https://www.linkedin.com/in/prithviraj6544/"}>Prithviraj Patil <ArrowUpRight className="inline" /></Link>
                        </MenubarItem>
                    </MenubarContent>
                </MenubarMenu>
            </div>
            <div className="block md:hidden">
                <MenubarMenu>
                    <MenubarTrigger> <AlignJustify /> </MenubarTrigger>
                    <MenubarContent>
                        <MenubarItem >
                            <Link href={"https://github.com/amitverma-cf/supermind_hackathon"}>Github <ArrowUpRight className="inline" /></Link>
                        </MenubarItem>
                        <MenubarItem >
                            <Link href={"https://youtube.com"}>Watch Video <ArrowUpRight className="inline" /></Link>
                        </MenubarItem>
                        <MenubarItem >
                            <Link href="/data.csv" download="data.csv">Download CSV <Download className="inline" /></Link>
                        </MenubarItem>
                        <MenubarSeparator />
                        <MenubarItem className="text-center font-bold">
                            Team Members
                        </MenubarItem>
                        <MenubarSeparator />
                        <MenubarItem >
                            <Link href={"https://www.linkedin.com/in/amve-me"}>Amit Verma <ArrowUpRight className="inline" /></Link>
                        </MenubarItem>
                        <MenubarItem >
                            <Link href={"https://www.linkedin.com/in/prithviraj6544/"}>Prithviraj Patil <ArrowUpRight className="inline" /></Link>
                        </MenubarItem>
                    </MenubarContent>
                </MenubarMenu>
            </div>
        </Menubar>
    )
}
