import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default async function Icon() {
  const font = await readFile(
    join(process.cwd(), "public/fonts/PlayfairDisplay-Italic-VariableFont_wght.ttf")
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: "#F5F0E8",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontFamily: "Playfair Display",
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: 26,
            color: "#2C2C2C",
            lineHeight: 1,
            marginTop: 1,
          }}
        >
          M
        </span>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Playfair Display", data: font, style: "italic", weight: 400 }],
    }
  );
}