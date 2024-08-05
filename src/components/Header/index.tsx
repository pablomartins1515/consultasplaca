import React from 'react';

import Link from "next/link";
import Logo from "../Logo";
import { PiList } from "react-icons/pi";

const Header = () => {
    return (
        <>

            <div className="w-full py-3.5 grid grid-flow-col bg-zinc-100 border-b border-zinc-100 justify-center items-center text-center">
                <div className="pl-7 row-start-1 row-span-1 ">
                    <>
                        <Link href="/"></Link>
                        <Logo />
                    </>
                </div>
                </div>
            </>
            );
}

            export default Header;