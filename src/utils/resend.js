import { Resend } from "resend";
import { RESEND_API_KEY, DOMAIN } from "../config.js";

export const emailService = async (email, url, subject) => {
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
