# <img alt="logo tempestra" src="/app/favicon.ico" title="Tempestra" width="35"/> Tempestra

**Tempestra** is a web-based application designed to generate weather forecast PDFs with an emphasis on simplicity and convenience.
The app uses [Next.js](https://nextjs.org) and [jsPDF](https://github.com/parallax/jsPDF) to dynamically fetch weather data and produce high-quality, downloadable reports.
Hosted on [Vercel](https://vercel.com), the project is available online at [tempestra-pdf.vercel.app](https://tempestra-pdf.vercel.app).

---

## Table of Contents

  - [Table of Contents](#table-of-contents)
  - [Modules and Libraries Used](#modules-and-libraries-used)
  - [Folder Structure](#folder-structure)
  - [Hosting](#hosting)
  - [Future Improvements](#future-improvements)
  - [Notes](#notes)

---

## Modules and Libraries Used

Tempestra relies on the following libraries and tools:

1. **[Next.js](https://nextjs.org) (Framework):**
    - Provides a React-based structure with built-in serverless API routes.
    - Includes SEO-friendly static generation and server-side rendering.

2. **[React](https://react.dev) (UI Layer):**
    - Manages the state for user interactions such as orientation selection.
    - Updates the interface dynamically based on user input.

3. **[jsPDF](https://github.com/parallax/jsPDF) (PDF Creation):**
    - Generates and customizes PDFs on the server side.
    - Adds text, shapes, images, and styling to produce a polished report.

4. **[TailwindCSS](https://tailwindcss.com) (Design):**
    - Enables responsive, mobile-friendly layouts.
    - Provides reusable, prefixed utility classes for consistent styling.

5. **[Météo Concept API](https://api.meteo-concept.com/) (Weather Data):**
    - Supplies accurate weather forecasts for Paris (INSEE code 75056).
    - Provides data on temperature, weather codes, and condition types.

6. **[Node.js](https://nodejs.org/) Utilities :**
    - `fs` module: Reads and converts weather icons into Base64 strings for embedding into PDFs.

---

## Folder Structure

Here are the key files and their roles:

1. **Frontend**
    - `page.tsx`
        - Builds the user interface, handles interactions, and manages the embedded PDF viewer or download behavior.
    - `layout.tsx`
        - Adds a global website structure, including the header, footer, and basic design elements.

2. **Backend**
    - `route.ts`
        - Contains the Next.js API route (`/api/generate-pdf`) for generating PDFs.
        - Handles the full data-fetching and PDF-creation logic.

3. **Public Assets**
    - Weather icons (e.g., `sunny.png`, `rainy.png`) used for dynamic image embedding.

4. **Styling**
    - `globals.css`
        - Defines global styles and utilities for a unified design.

---

## Hosting

Tempestra is hosted on [**Vercel**](https://vercel.com), leveraging its seamless integration with Next.js for deploying both front-end pages and server-side routes. The application benefits from Vercel's:

- Global CDN for fast load times.
- Scalable serverless infrastructure.

Access it live at :  
[https://tempestra-pdf.vercel.app](https://tempestra-pdf.vercel.app)

---

## Future Improvements

Future updates are planned to provide the following enhancements:

1. **Landscape Mode Support:**  
   Add functionality for generating PDFs in landscape orientation.

2. **Dynamic Location Input:**  
   Allow users to input custom locations (e.g., city or postal code) instead of using the fixed INSEE value for Paris.

3. **User Accounts and Preferences:**  
   Introduce a user account system to save preferences and enable the use of personal API tokens.

4. **Localization:**  
   Support multiple languages and unit systems (e.g., °C/°F toggle for user preference).

5. **Advanced Styling in PDFs:**  
   Improve aesthetics by adding background gradients or advanced weather visualizations.

---

## Notes

The API token is limited to **50 uses per day**.  
Please use it responsibly and avoid abusing the service or causing unnecessary disruptions. Thank you! 😊

Feedback and contributions are welcome to improve its features further.

Made with ❤️ by [Julien7518](https://github.com/julien7518).
