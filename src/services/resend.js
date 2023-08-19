import { Resend } from "resend";
import { RESEND_API_KEY, DOMAIN } from "../config.js";

export async function emailConfirmation(email, url) {
  try {
    const resend = new Resend(RESEND_API_KEY);
    await resend.emails.send({
      from: DOMAIN,
      to: email,
      subject: "Email confirmation",
      text: url,
    });
    
  } catch (error) {
    console.log(error)
  }
}
