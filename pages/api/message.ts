import { NextApiRequest, NextApiResponse } from "next";
import Twilio from "twilio";
import { MessageInstance } from "twilio/lib/rest/api/v2010/account/message";

export default async function handler (
  req: NextApiRequest,
  res: NextApiResponse<IMessageResponseData | IMessageErrorData>
) {
  const url: URL = new URL(req.url as string, `https://${req.headers.host}`);
  const findParameter = (param: string): string => (url.searchParams.get(param)?.toString() as string);

  const client = Twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

  // #region url params

  const from = findParameter("from");
  const to = findParameter("to");
  const contentSid = findParameter("contentSid") ?? findParameter("content_sid");

  if (!from) return res.status(400).json({ error: { status: 400, message: "The \"from\" parameter is required" }});
  if (!to) return res.status(400).json({ error: { status: 400, message: "The \"to\" parameter is required" }});
  if (!contentSid) return res.status(400).json({ error: { status: 400, message: "The \"content_sid\" parameter is required" }});

  // #endregion

  // #region create message

  await client.messages.create(
    {
      from, to, contentSid,
      messagingServiceSid: process.env.MESSAGING_SERVICE_SID
    },
    (error: Error, item: MessageInstance | undefined) => {
      if (error || typeof (item) === "undefined") {
        return res.status(500).json({
          error: {
            status: 500,
            message: error.message
          }
        });
      }

      return res.status(200).json({ body: { ...item } });
    }
  );

  // #endregion
}
