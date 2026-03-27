/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from "next";
import axios, { Method } from "axios";
import { Store } from "@/utils/data";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const BASE_URL = process.env.API_BASE_URL || "";
  if (!BASE_URL) {
    return res.status(500).json({ message: "Missing API_BASE_URL" });
  }

  const method = (req.method || "GET") as Method;
  const data = req.body;

  const slug = req.query.slug;
  const endpoint = Array.isArray(slug) ? slug.join("/") : slug || "";
  const url = endpoint ? `${BASE_URL}/${endpoint}` : BASE_URL;

  const axiosDataPart = data && Object.keys(data).length > 0 ? { data } : {};

  const token = req.cookies[Store.ACCESS_TOKEN];

  try {
    const response = await axios.request({
      method,
      url,
      ...axiosDataPart,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    const payload = response.data;

    const code = String(payload?.responseCode ?? "");
    const message = payload?.responseMessage || "Request failed";

    if (code && code !== "00") {
      const httpStatus = code === "26" ? 409 : 400;

      return res.status(httpStatus).json({
        message,
        responseCode: code,
        details: payload,
      });
    }

    return res.status(200).json(payload);
  } catch (error: any) {
    return res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || error.message || "Server error",
      details: error.response?.data || null,
    });
  }
}