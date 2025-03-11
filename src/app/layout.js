import ReduxProvider from "@/lib/ReduxProvider";
import AosProvider from "@/lib/AosProvider";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import localFont from "next/font/local";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { Toaster } from "sonner";
import "./globals.css";
import { ConfigProvider } from "antd";
import themeConfig from "../../theme/themeConfig";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export const metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css" />
                <link href="https://fonts.googleapis.com/css2?family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" />
                <link href="https://fonts.googleapis.com/css2?family=Bilbo+Swash+Caps&display=swap" rel="stylesheet"></link>
            </head>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <ReduxProvider>
                    <AntdRegistry>
                        <ConfigProvider theme={themeConfig}>
                            <AosProvider>
                                {children}
                            </AosProvider>
                            <Toaster position="top-center" richColors />
                        </ConfigProvider>
                    </AntdRegistry>
                </ReduxProvider>
            </body>
        </html>
    );
}
