const { createCanvas } = require("canvas");
const fs = require("fs");
const path = require("path");

const width = 1200;
const height = 630;

const canvas = createCanvas(width, height);
const ctx = canvas.getContext("2d");

// Background
ctx.fillStyle = "#000000";
ctx.fillRect(0, 0, width, height);

// Subtle grid lines
ctx.strokeStyle = "rgba(255,255,255,0.04)";
ctx.lineWidth = 1;
for (let x = 0; x < width; x += 60) {
  ctx.beginPath();
  ctx.moveTo(x, 0);
  ctx.lineTo(x, height);
  ctx.stroke();
}
for (let y = 0; y < height; y += 60) {
  ctx.beginPath();
  ctx.moveTo(0, y);
  ctx.lineTo(width, y);
  ctx.stroke();
}

// White border
ctx.strokeStyle = "rgba(255,255,255,0.15)";
ctx.lineWidth = 2;
ctx.strokeRect(40, 40, width - 80, height - 80);

// VYRA text
ctx.fillStyle = "#ffffff";
ctx.font = "bold 120px Arial";
ctx.textAlign = "center";
ctx.letterSpacing = "20px";
ctx.fillText("VYRA", width / 2, height / 2 - 20);

// Tagline
ctx.fillStyle = "rgba(255,255,255,0.5)";
ctx.font = "24px Arial";
ctx.fillText("PREMIUM STREETWEAR · PRINTED ON DEMAND", width / 2, height / 2 + 50);

// Bottom line
ctx.fillStyle = "rgba(255,255,255,0.2)";
ctx.font = "14px Arial";
ctx.fillText("vyra.vercel.app", width / 2, height - 60);

// Save
const outputPath = path.join(__dirname, "../public/og-image.jpg");
const buffer = canvas.toBuffer("image/jpeg", { quality: 0.95 });
fs.writeFileSync(outputPath, buffer);

console.log("✓ og-image.jpg created in /public");