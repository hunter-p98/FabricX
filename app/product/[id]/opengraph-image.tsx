import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "VYRA Product";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({
  params,
}: {
  params: { id: string };
}) {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#000000",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontSize: 120,
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: "0.1em",
          }}
        >
          VYRA
        </div>
        <div
          style={{
            fontSize: 24,
            color: "#aaaaaa",
            marginTop: 16,
            letterSpacing: "0.3em",
          }}
        >
          PREMIUM STREETWEAR
        </div>
      </div>
    ),
    size
  );
}