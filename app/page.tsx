"use client";
import {useState} from "react";
import {pdfName} from "@/app/api/generate-pdf/route";

function Button({label, func}: { label: string; func: () => void }) {
    return (
        <>
            <button className="bg-neutral-200 font-medium rounded-3xl w-52 h-16 m-2.5 text-2xl active:bg-neutral-300"
                    onClick={func}>
                {label}
            </button>
        </>
    );
}

function PDFViewer({sourcename = undefined}: { sourcename?: string | undefined }) {
    if (!sourcename) {
        return null;
    }

    return (
        <div className="hidden lg:flex justify-center h-full mt-10">
            <iframe src={sourcename} className="w-3/5 h-96"/>
        </div>
    );
}

export default function Home() {
    const [activeOrientation, setActiveOrientation] = useState<"p" | "l">("p");
    const [pdfLink, setPdfLink] = useState<string | undefined>(undefined);


    function ToggleButton({label, id, rotate = false}: { label: string; id: "p" | "l"; rotate?: boolean; }) {
        const isActive: boolean = activeOrientation === id;
        const bgImage: string = `url('/${isActive ? "active-" : ""}${
            rotate ? "bg-landscape.svg" : "bg-portrait.svg"
        }')`;
        const buttonStyle: string = isActive
            ? "bg-neutral-800 text-neutral-200"
            : "bg-neutral-200 text-black";

        return (
            <>
                <button
                    style={{backgroundImage: bgImage}}
                    className={`bg-image ${buttonStyle} font-medium rounded-3xl w-24 h-16 m-2.5 text-sm `}
                    onClick={() => setActiveOrientation(id === "l" ? "l" : "p")}
                >
                    {label}
                </button>
            </>
        );
    }

    async function handleGeneratePDF(orientation: "p" | "l") {
        try {
            const res = await fetch(`/api/generate-pdf?orientation=${orientation}`);

            if (!res.ok) {
                console.error(`${res.status} ${res.statusText}`);
            }

            const blob = await res.blob();
            const url = URL.createObjectURL(blob);

            if (window.innerWidth < 1024) {
                const a = document.createElement("a");
                a.href = url;
                a.download = pdfName();
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            } else {
                setPdfLink(url);
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <div className="flex items-top justify-center h-16 mx-2.5">
                <p className="text-center text-2xl">
                    Create your weather forecast in the format you want
                </p>
            </div>
            <div className="grid justify-center">
                <div className="inline-flex">
                    <ToggleButton label="Portrait" id="p"/>
                    <ToggleButton label="Landscape" id="l" rotate={true}/>
                </div>
                <Button label="Create" func={() => handleGeneratePDF(activeOrientation)}/>
            </div>
            <PDFViewer sourcename={pdfLink}/>
        </>
    );
}