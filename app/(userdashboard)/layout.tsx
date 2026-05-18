
import "../globals.css";
import Header from "./_components/Header";
import { Sidebar } from "./_components/Sideber";


function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex flex-col">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar/>

        <div className="flex-1 overflow-y-auto p-6 mt-[80px] bg-[#EDEEF1]">
          {children}
        </div>
      </div>
    </div>
  );
}

export default layout;