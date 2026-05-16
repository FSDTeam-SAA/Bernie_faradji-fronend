import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#033D86] text-white py-10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center  h-20">
              <Image
                src="/whitelogo.png" // Replace this with your logo path
                alt="BubbleDrive Logo"
                width={1000}
                height={1000}
                className="h-full w-full object-cover"
              />
          </div>

          {/* Footer Links */}
          <div className="hidden md:flex space-x-8 text-base montserrat ">
            <Link href="/terms-of-service" className="hover:underline">
              Terms of Service
            </Link>
            <Link href="/privacy-policy" className="hover:underline">
              Privacy Policy
            </Link>
            <Link href="/about-us" className="hover:underline">
              About Us
            </Link>
            <Link href="/contact-us" className="hover:underline">
              Contact Us
            </Link>
          </div>
        </div>

       
      </div>
    </footer>
  );
}