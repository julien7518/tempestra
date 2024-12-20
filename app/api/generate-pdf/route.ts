import {jsPDF} from 'jspdf';
import {NextRequest, NextResponse} from "next/server";

export function pdfName() {
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const date = today.getDate();
    return `meteo-${date}-${month}-${year}.pdf`;
}

async function fetchWeatherData() {
    const apiKey = "";
    const endpoint = `https://api.meteo-concept.com/api/forecast/daily/periods?token=${apiKey}&insee=75056`;

    const response = await fetch(endpoint);
    if (!response.ok) {
        throw new Error(`Erreur lors de la récupération des données météo : ${response.statusText}`);
    }

    return await response.json();
}

export async function GET(request: NextRequest) {
    try {
        const orientation: "p" | "l" =
            request.nextUrl.searchParams.get("orientation") === "l" ? "l" : "p";
        // const weatherData = await fetchWeatherData();
        const pdf = new jsPDF({
            orientation: orientation,
            unit: "mm",
            format: "a4",
        });

        const pageWidth = 210;
        const margin = 10;
        const dateColumnWidth = (pageWidth - 2 * margin)/4;
        const titleRowWidth = pageWidth - 2 * margin - dateColumnWidth;
        const midleRightBlock = margin + dateColumnWidth + titleRowWidth/2;

        pdf.setFontSize(32);
        pdf.text("Weather Forecast", pageWidth / 2, 19, {align: "center"});
        pdf.setFontSize(14);
        pdf.setDrawColor(255, 255, 255);
        pdf.setFillColor(229, 229, 229);
        pdf.roundedRect(margin + dateColumnWidth, 30, titleRowWidth, 15, 5, 5, 'F');
        pdf.roundedRect(margin, 50, dateColumnWidth - 5, 200, 5, 5, 'F');
        pdf.roundedRect(margin + dateColumnWidth, 50, titleRowWidth, 200, 5, 5, 'F');
        pdf.line(midleRightBlock, 33, midleRightBlock, 42);
        pdf.line(midleRightBlock, 55, midleRightBlock, 245);
        pdf.text("Morning", margin + dateColumnWidth + titleRowWidth/4, 39, {align: "center"});
        pdf.text("Afternoon", margin + dateColumnWidth + 3*titleRowWidth/4, 39, {align: "center"});

        pdf.setProperties({
            title: `Today's weather`,
            subject: "Weather Forecast",
            author: "Tempestra",
            keywords: "meteo, weather, forecast, pdf, tempestra",
            creator: "Tempestra",
        });

        const pdfData = pdf.output("arraybuffer");
        const fileName = `${pdfName()}.pdf`;
        return new NextResponse(Buffer.from(pdfData), {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="${fileName}"; filename*=UTF-8''${fileName}`,
            },
        });
    } catch (error) {
        console.error("Erreur lors de la génération du PDF :", error);
        return new NextResponse("Erreur interne du serveur !", {status: 500});
    }
}