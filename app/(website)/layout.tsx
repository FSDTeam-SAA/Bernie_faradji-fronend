
import Footer from "@/components/common/Footer";
import "../globals.css";
import Navbar from "@/components/common/Navbar";



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className="bg-[#F8FBFF] "
    >
       <Navbar />
      <div>{children}</div>
      <Footer/>
    </div>
  );
}