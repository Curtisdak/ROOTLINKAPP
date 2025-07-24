
import { PollProvider } from "@/context/pollContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={""}>
          <PollProvider>
            <div className="">{children} </div>
          </PollProvider>
       
      </body>
    </html>
  );
}
