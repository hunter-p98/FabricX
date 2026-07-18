// app/page.tsx
import { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "VYRA - Wear Love. Wear Memories.",
  description:
    "VYRA turns your favorite moments into wearable pieces. Custom graphic tees, hoodies and longsleeves. Printed on demand and shipped worldwide to USA, Australia, Canada, and beyond.",
  openGraph: {
    title: "VYRA - Wear Love. Wear Memories.",
    description: "Turn your favorite moments into wearable pieces. Worldwide shipping.",
    type: "website",
  },
};

export default function Home() {
  return <HomeClient initialProducts={[]} />;
}