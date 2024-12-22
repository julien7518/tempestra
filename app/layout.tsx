import type {Metadata} from "next";
import {Inter} from "next/font/google";
import Image from "next/image";
import "./globals.css";
import Link from "next/link";
import React from "react";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "Tempestra",
    description: "Tempestra is the app which helps you to generate weather forecast",
};

export default function RootLayout({children}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <header>
            <div
                className="pt-2 h-14 border border-neutral fixed bg-white top-5 left-5 right-5 items-center rounded-3xl">
                <Link href="/">
                    <div className="inline-flex items-center ml-5">
                        <Image
                            src="/favicon.ico"
                            alt="Tempestra logo"
                            height={0}
                            width={0}
                            className="w-8 h-auto"
                        />
                        <h1 className="text-xl font-medium ml-2 mr-5">Tempestra</h1>
                    </div>
                </Link>
            </div>
            <hr className="border-0 h-36 bg-gradient-to-b from-neutral-200"/>
        </header>

        {children}

        <footer className="flex w-screen justify-around text-sm text-gray-500 py-10">
            <p>Made by <a className="underline" target="_blank" href="https://github.com/julien7518">me</a></p>
        </footer>
        </body>
        </html>
    );
}
