import { NextApiRequest, NextApiResponse } from "next";
import TwilioClient from "twilio";
import { MessageInstance, MessageListInstanceCreateOptions } from "twilio/lib/rest/api/v2010/account/message";

const client = TwilioClient(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

export default async function handler (
  req: NextApiRequest,
  res: NextApiResponse<IMessageResponseData | IMessageErrorData | string>
) {
  if (req.method != "POST") return res.status(400).send("This service only accepts POST method requests");

  const url: URL = new URL(req.url as string, `https://${req.headers.host}`);
  const findParameter = (param: string): string => (url.searchParams.get(param)?.toString() as string);

  // #region url params

  console.log(req.url);

  const from = findParameter("from");
  const to = findParameter("to");
  const contentSid = findParameter("content_sid");
  const contentVariables = findParameter("variables");

  if (!from) return res.status(400).json({ error: { status: 400, message: "The \"from\" parameter is required" }});
  if (!to) return res.status(400).json({ error: { status: 400, message: "The \"to\" parameter is required" }});
  if (!contentSid) return res.status(400).json({ error: { status: 400, message: "The \"content_sid\" parameter is required" }});

  // #endregion

  // #region create message

  const makeNumber = (phone: string) => "whatsapp:+" + phone.toString().replace(/[+]/g, '').trim();
  let data: MessageListInstanceCreateOptions = {
    from: makeNumber(from),
    to: makeNumber(to),
    contentSid,
    messagingServiceSid: process.env.MESSAGING_SERVICE_SID
  }

  if (contentVariables) data = { ...data, contentVariables };

  await client.messages.create(data, (error: Error, item: MessageInstance | undefined) => {
      if (error || typeof (item) === "undefined") {
        return res.status(500).send(error.message);
        // return res.status(500).json({ error: { code: 500, message: error.message } });
      }

      return res.status(200).json({ body: { ...item.toJSON() } });
    }
  );

  // #endregion
}
