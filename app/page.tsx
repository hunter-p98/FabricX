// app/page.tsx
import { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "VYRA – Dark Streetwear | Worldwide Shipping",
  description:
    "Shop VYRA dark aesthetic streetwear. Premium graphic tees, hoodies and longsleeves. Printed on demand and shipped worldwide to USA, Australia and Canada.",
  openGraph: {
    title: "VYRA – Dark Streetwear",
    description: "Premium dark aesthetic streetwear. Worldwide shipping.",
    type: "website",
  },
};

export default function Home() {
  return <HomeClient initialProducts={[]} />;
}