import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "BoardBuilder – Electric Longboard Build Planner",
  description:
    "Plan and compare electric longboard (esk8) builds, part by part. Choose decks, batteries, ESCs, drive kits, and more – like PCPartPicker for electric skateboards.",
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
