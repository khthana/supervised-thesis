import { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import ClientSessionProvider from "./provider/ClientSessionProvider";
import QueryProvider from "./provider/ReactQueryProvider";
import './globals.css';
import { Kanit } from 'next/font/google';
import { UserProvider } from "./provider/UserProvider";

const kanit = Kanit({
  subsets: ["latin"],
  variable: "--font-kanit",
  weight: "300",
});

export const metadata = {
  title: "TripWeaver"
};

export default async function RootLayout({
  children,
  params: { locale }
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${kanit.variable}`}>
        <ClientSessionProvider>
          <QueryProvider>
            <NextIntlClientProvider messages={messages}>
              <UserProvider>
                {children}
              </UserProvider>
            </NextIntlClientProvider>
          </QueryProvider>
        </ClientSessionProvider>
      </body>
    </html>
  );
}
