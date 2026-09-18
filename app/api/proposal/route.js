import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_APP_PASSWORD;
  if (!user || !pass) return NextResponse.json({ delivered: false });

  try {
    const transporter = nodemailer.createTransport({ service: "gmail", auth: { user, pass } });
    await transporter.sendMail({
      from: user,
      to: "harshil180704@gmail.com",
      subject: "Ruta said YES! <3",
      text: "Ruta just said YES to your proposal!\n\nThe website received a YES response.\n\nThis is the beginning of something beautiful."
    });
    return NextResponse.json({ delivered: true });
  } catch {
    return NextResponse.json({ delivered: false });
  }
}
