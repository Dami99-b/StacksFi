import { useState } from "react";
import AnimatedIntro from "../components/AnimatedIntro";
import { useRouter } from "next/router";

export default function Home() {
  const [entered, setEntered] = useState(false);
  const router = useRouter();

  const handleEnter = () => {
    setEntered(true);
    setTimeout(() => router.push("/dashboard"), 600);
  };

  return (
    <>
      {!entered ? <AnimatedIntro onEnter={handleEnter} /> : (
        <div className="min-h-screen flex items-center justify-center">
          <p>Loading StackFi...</p>
        </div>
      )}
    </>
  );
}
