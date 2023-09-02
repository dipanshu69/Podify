import { MAILTRAP_PASS, MAILTRAP_USER, VERIFICATION_EMAIL } from "./variables";
import nodemailer from "nodemailer";
import EmailVerificationToken from "#/models/emailVerification";
import { generateTemplate } from "#/mail/template";
import path from "path";
import { Profiler } from "inspector";

const generateMailTransPorter = () => {
  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: MAILTRAP_USER,
      pass: MAILTRAP_PASS,
    },
  });
  return transport;
};

interface Profile {
  name: string;
  email: string;
  userId: string;
}

export const sendVerificationMain = async (token: string, profile: Profile) => {
  const { name, email, userId } = profile;
  const transport = generateMailTransPorter();

  await EmailVerificationToken.create({
    owner: userId,
    token,
  });

  const welcomeMessage = `Hi ${name}, welcome to Podify! There are so much thing that we do for verified users. Use the given OTP to verify your email.`;

  transport.sendMail({
    to: email,
    from: VERIFICATION_EMAIL,
    subject: "Welcome Message",
    html: generateTemplate({
      title: "Welcome To Podify",
      message: welcomeMessage,
      logo: "cid:logo",
      banner: "cid:welcome",
      link: "#",
      btnTitle: token,
    }),
    attachments: [
      {
        filename: "logo.png",
        path: path.join(__dirname, "../mail/logo.png"),
        cid: "logo",
      },
      {
        filename: "Welcome.png",
        path: path.join(__dirname, "../mail/welcome.png"),
        cid: "Welcome",
      },
    ],
  });
};
