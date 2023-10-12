import { Resend } from "resend";
import { RESEND_API_KEY, DOMAIN } from "../config";

export const emailService = async (
  email: string,
  url: string,
  subject: string
) => {
  if (!DOMAIN) throw new Error("DOMAIN IS REQUIRED");
  try {
    const resend = new Resend(RESEND_API_KEY);
    await resend.emails.send({
      from: DOMAIN,
      to: email,
      subject: subject,
      text: url,
    });
  } catch (error) {
    console.log(error);
  }
};
