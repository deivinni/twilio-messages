import { NextApiRequest, NextApiResponse } from "next";

interface ResponseData {
  body: string
}

export default async function handler (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const url = new URL(req.url as string, `https://${req.headers.host}`);
  const body = url.searchParams.get("body")?.toString() as string;

  res.status(200).json({ body });
}
