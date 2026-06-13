import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import { GoogleAnalytics } from "@next/third-parties/google";
import "../globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-[#F8FBFF] ">
      <Navbar />
      <div>{children}</div>
      <Footer />
      <GoogleAnalytics gaId={process.env.GOOGLE_ANALYTICS_ID!} />
    </div>
  );
}
