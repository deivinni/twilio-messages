import type { NextApiRequest, NextApiResponse } from "next";
import { MessageInstance, MessageListInstanceCreateOptions } from "twilio/lib/rest/api/v2010/account/message";
import TwilioClient from "twilio";

const client = TwilioClient(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

export default async function handler (
  req: NextApiRequest,
  res: NextApiResponse<IMessageDataResponse | string>
) {
  if (req.method != "POST") return res.status(400).send("This service only accepts POST method requests");

  const url: URL = new URL(req.url as string, `https://${req.headers.host}`);
  const findParameter = (param: string): string => (url.searchParams.get(param)?.toString() as string);

  // #region url params

  const from = findParameter("from") ?? req.body.from;
  const to = findParameter("to") ?? req.body.to;
  const contentSid = findParameter("content_sid") ?? req.body.content_sid;
  const contentVariables = findParameter("variables") ?? req.body.variables;

  if (!from) return res.status(400).json("The \"from\" parameter is required");
  if (!to) return res.status(400).json("The \"to\" parameter is required");
  if (!contentSid) return res.status(400).json("The \"content_sid\" parameter is required");

  // #endregion

  // #region create message

  let twilioDataRequest: MessageListInstanceCreateOptions = {
    from: makePhoneNumber(from),
    to: makePhoneNumber(to),
    contentSid,
    messagingServiceSid: process.env.MESSAGING_SERVICE_SID
  }

  if (contentVariables) twilioDataRequest = { ...twilioDataRequest, contentVariables };

  await client.messages.create(twilioDataRequest, (error: Error, item: MessageInstance | undefined) => {
      if (error || typeof (item) === "undefined") {
        return res.status(500).send(error.message);
        // return res.status(500).json({ error: { code: 500, message: error.message } });
      }

      return res.status(200).json(createMessageDataResponse(item));
    }
  );

  // #endregion
}

function makePhoneNumber (phoneNumber: string): string {
  const phoneNumberReplace = phoneNumber.replace(/[+]/g, "").trim();
  return `whatsapp:+${phoneNumberReplace}`;
}

function createMessageDataResponse (item: MessageInstance): IMessageDataResponse {
  return {
    body: {
      apiVersion: item.apiVersion,
      dateCreated: item.dateCreated,
      dateSent: item.dateSent,
      dateUpdated: item.dateUpdated,
      direction: item.direction,
      errorCode: item.errorCode,
      errorMessage: item.errorMessage,
      numMedia: item.numMedia,
      numSegments: item.numSegments,
      price: item.price,
      priceUnit: item.priceUnit,
      sid: item.sid,
      status: item.status,
    }
  }
}
