// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next"

type Data = {
    name: string
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    // 0x5FbDB2315678afecb367f032d93F642f64180aa3
    res.status(200).json({ name: "John Doe" })
}
