import type {Metadata} from "next";
import {Inter} from "next/font/google";
import Image from "next/image";
import "./globals.css";
import Link from "next/link";
import React from "react";
import {Analytics} from "@vercel/analytics/react";
import {SpeedInsights} from "@vercel/speed-insights/next"

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "Tempestra - Weather Forecast PDF Generator",
    description: "Tempestra is an intuitive and powerful weather forecast application designed to generate high-quality, customizable PDFs. From accurate weather data to personalized styles, it helps you stay informed and prepared.",
    keywords: "weather, forecast, meteo, PDF generator, Tempestra, weather app, weather PDF, download weather, forecast app, météo, weather report, jsPDF",
    authors: [{name: "Julien7518", url: "https://github.com/julien7518"}],
    creator: "Julien7518",
    publisher: "Tempestra",
    applicationName: "Tempestra - Your Weather PDF Assistant",
    category: "Web Application, Weather Forecasting, Productivity",
    icons: {
        icon: "/favicon.ico",
        apple: "/apple-icon.png",
    },
    robots: {
        index: true,
        follow: true,
        nocache: false,
    },
    openGraph: {
        type: "website",
        url: "https://tempestra-pdf.vercel.app",
        title: "Tempestra - Generate Weather Forecast PDFs",
        description: "Create stunning and accurate weather forecast PDFs easily with Tempestra. Select orientations, preview reports, and download directly.",
        siteName: "Tempestra",
        images: [
            {
                url: "https://tempestra-pdf.vercel.app/apple-icon.png",
                alt: "Tempestra - Weather Forecast PDF Generator",
                width: 150,
                height: 79,
            }
        ],
        locale: "en_US",
    },
    twitter: {
        card: "summary_large_image",
        title: "Tempestra - Weather Forecast PDF Generator",
        description: "Generate accurate, customizable weather forecast PDFs for personal or professional use with Tempestra.",
        creator: "@julien7518",
        site: "@tempestrapdf",
        images: ["https://tempestra-pdf.vercel.app/apple-icon.png"],
    }
};

export default function RootLayout({children}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en">
        <Analytics/>
        <SpeedInsights/>
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
