import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (
  recepient,
  subject,
  emailTemplate
) => {

  try {

    const response = await resend.emails.send({
      from: `The Unfolding <onboarding@resend.dev>`,
      to: recepient,
      subject: subject,
      html: emailTemplate,
    });

    console.log(
      `📨 Mail dispatched successfully to: ${recepient}`
    );

    return response;

  } catch (error) {

    console.error("RESEND EMAIL ERROR:", error);

    throw error;
  }
};