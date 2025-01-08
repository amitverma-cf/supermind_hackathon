import ChatApp from "@/components/chat";
import { Header } from "@/components/Header";
import LoadCSV from "@/components/LoadCSV";

export default function Home() {

  return (
    <div className="items-center justify-items-center font-[family-name:var(--font-geist-sans)]">
      <Header />
      <main className="flex flex-row flex-wrap w-full h-screen">
        <div className="w-full lg:w-1/3 justify-center">
          <ChatApp />
        </div>
        <LoadCSV />
      </main>
    </div>
  );
}
