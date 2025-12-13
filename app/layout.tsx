import type { Metadata } from "next";
import { Poppins, Inter, Lexend } from "next/font/google";
import "./globals.css";

// Playful heading font - perfect for learning applications
const poppins = Poppins({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

// Clean, readable body font - excellent for educational content
const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

// Alternative modern sans-serif
const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Study Buddy - Learn Smarter, Together",
  description: "AI-powered learning platform for students. Create classrooms, practice with interactive quizzes, chat with AI tutors, and track your progress.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${inter.variable} ${lexend.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
