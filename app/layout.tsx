import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "BoardBuilder – Custom Electronic Board Planner",
  description:
    "Build and validate electronic board designs like PCPartPicker, but for microcontrollers and sensors."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100">
        {children}
      </body>
    </html>
  );
}
