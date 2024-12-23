import {jsPDF} from 'jspdf';
import {NextRequest, NextResponse} from "next/server";

function pdfName() {
    const today = new Date();
    const month: number = today.getMonth() + 1;
    const year: number = today.getFullYear();
    const date: number = today.getDate();
    return `meteo-${date}-${month}-${year}.pdf`;
}

function formatDate(dateString: string) {
    const date = new Date(dateString);

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const dayShort = days[date.getUTCDay()];
    const dayOfMonth = date.getUTCDate();

    return `${dayShort} ${dayOfMonth}`;
}

function cToF(t: number) {
    return Math.round(t * 9 / 5 + 32);
}

function codeToImage(code: number) {
    if (code >= 0 && code <= 2) {
        return "sunny.png";
    } else if (code >= 3 && code <= 7) {
        return "cloudy.png";
    } else if ((code >= 10 && code <= 16) || (code >= 70 && code <= 78) || (code >= 30 && code <= 48) || (code >= 210 && code <= 212) || (code >= 230 && code <= 232)) {
        return "rainy.png";
    } else if ((code >= 20 && code <= 22) || (code >= 60 && code <= 68) || (code >= 220 && code <= 222) || (code === 235)) {
        return "snowy.png";
    } else if (code >= 100 && code <= 142) {
        return "stormy.png";
    } else {
        throw new Error("Code inconnu");
    }
}

async function convertImageToBase64(imageUrl: string) {
    try {
        const response = await fetch(imageUrl);
        if (!response.ok) {
             console.error(`Image introuvable : ${response.statusText}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString("base64");
        return `data:image/png;base64,${base64}`;
    } catch (error) {
        throw new Error(`Erreur lors de la conversion de l'image en base64 : ${error}`);
    }
}

async function fetchWeatherData() {
    const apiKey = "036d9564a550f68c54d450fa74a501bd3631748a3cfdc6c4c547e38f4504b062";
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
        const weatherData = await fetchWeatherData();
        const pdf = new jsPDF({
            orientation: orientation,
            unit: "mm",
            format: "a4",
        });

        const pageWidth = 210;
        const margin = 10;
        const dateColumnWidth = (pageWidth - 2 * margin) / 4 - 5;
        const titleRowWidth = pageWidth - 2 * margin - dateColumnWidth;
        const midleRightBlock = margin + dateColumnWidth + 5 + titleRowWidth / 2;
        const domain = "https://tempestra-pdf.vercel.app"

        pdf.setFontSize(32);
        pdf.text("Weather Forecast", midleRightBlock, 19, {align: "center"});
        pdf.setFontSize(14);
        pdf.setDrawColor(255, 255, 255);
        pdf.setFillColor(243, 243, 243);
        pdf.roundedRect(margin + dateColumnWidth + 5, 30, titleRowWidth, 15, 5, 5, 'F');
        pdf.roundedRect(margin, 50, dateColumnWidth, 197, 5, 5, 'F');
        pdf.roundedRect(margin + dateColumnWidth + 5, 50, titleRowWidth, 197, 5, 5, 'F');
        pdf.line(midleRightBlock, 33, midleRightBlock, 42);
        pdf.line(midleRightBlock, 55, midleRightBlock, 242);
        pdf.text("Morning", margin + dateColumnWidth + 5 + titleRowWidth / 4, 39, {align: "center"});
        pdf.text("Afternoon", margin + dateColumnWidth + 5 + 3 * titleRowWidth / 4, 39, {align: "center"});

        for (let i = 0; i < 14; i++) {
            const yPosition = 60 + i * 14;
            try {
                const day = formatDate(weatherData['forecast'][i][0]['datetime']);
                const celciusMorning: number = weatherData['forecast'][i][1]['temp2m'];
                const celciusAfternoon: number = weatherData['forecast'][i][2]['temp2m'];
                const morningCode: number = weatherData['forecast'][i][1]['weather'];
                const afternoonCode: number = weatherData['forecast'][i][2]['weather'];
                pdf.text(day, margin + dateColumnWidth / 2, yPosition, {align: "center"});
                pdf.text(`${celciusMorning}°C`, margin + dateColumnWidth + 5 + titleRowWidth / 8 - 5, yPosition, {align: "center"});
                pdf.text(`${cToF(celciusMorning)}°F`, margin + dateColumnWidth + 5 + 3 * titleRowWidth / 8 + 5, yPosition, {align: "center"});
                pdf.text(`${celciusAfternoon}°C`, margin + dateColumnWidth + 5 + 5 * titleRowWidth / 8 - 5, yPosition, {align: "center"});
                pdf.text(`${cToF(celciusAfternoon)}°F`, margin + dateColumnWidth + 5 + 7 * titleRowWidth / 8 + 5, yPosition, {align: "center"});
                pdf.line(margin + 3, yPosition + 5, margin + dateColumnWidth - 3, yPosition + 5);
                pdf.line(margin + dateColumnWidth + 5 + 3, yPosition + 5, margin + dateColumnWidth + 5 + titleRowWidth - 3, yPosition + 5);
                try {
                    const morningImage = await convertImageToBase64(`${domain}/${codeToImage(morningCode)}`);
                    pdf.addImage(morningImage, "PNG", margin + dateColumnWidth + 5 + 2 * titleRowWidth / 8 - 5, yPosition - 7, 10, 10);
                }
                catch (error) {
                    console.error("Erreur lors de l'ajout de l'image matin :", error);
                }
                try {
                    const afternoonImage = await convertImageToBase64(`${domain}/${codeToImage(afternoonCode)}`);
                    pdf.addImage(afternoonImage, "PNG", margin + dateColumnWidth + 5 + 6 * titleRowWidth / 8 - 5, yPosition - 7, 10, 10);
                } catch (error) {
                    console.error("Erreur lors de l'ajout de l'image après-midi :", error);
                }
            } catch (error) {
                console.error("Erreur lors de la mise en page :", error);
            }
        }

        pdf.setProperties({
            title: `Today's weather`,
            subject: "Weather Forecast",
            author: "Tempestra",
            keywords: "meteo, weather, forecast, pdf, tempestra",
            creator: "Tempestra",
        });

        const pdfData = pdf.output("arraybuffer");
        return new NextResponse(Buffer.from(pdfData), {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="${pdfName()}"; filename*=UTF-8''${pdfName()}`,
            },
        });
    } catch (error) {
        console.error("Erreur lors de la génération du PDF :", error);
        return new NextResponse(`Erreur interne du serveur ! ${error}`, {status: 500});
    }
}