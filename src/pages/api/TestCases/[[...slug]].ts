/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from "next";
import axios, { Method } from "axios";
import { Store } from "@/utils/data";

/**
 * Catch-all proxy for TestCases endpoints.
 *
 * File location: pages/api/TestCases/[...slug].ts
 *
 * Client calls:
 *   PUT  /api/TestCases/1234/generate
 *   GET  /api/TestCases/1234
 *
 * Forwards to:
 *   PUT  https://bugtrackerapi.onrender.com/api/v1/1234/TestCases/generate
 *   GET  https://bugtrackerapi.onrender.com/api/v1/1234/TestCases
 *
 * The slug is [projectId, ...rest] — we reconstruct the backend path as:
 *   /api/v1/{projectId}/TestCases/{...rest}
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const BASE_URL = process.env.API_BASE_URL || "";
  if (!BASE_URL) {
    return res.status(500).json({ message: "Missing API_BASE_URL env variable" });
  }

  const slug = Array.isArray(req.query.slug) ? req.query.slug : [req.query.slug ?? ""];

  // slug[0] is always projectId, the rest is the sub-path (e.g. ["generate"])
  const [projectId, ...rest] = slug;
  const subPath = rest.length > 0 ? `/${rest.join("/")}` : "";

  // Reconstruct the real backend URL:
  // {BASE_URL}/api/v1/{projectId}/TestCases{/subPath}
  const url = `${BASE_URL}/${projectId}/TestCases${subPath}`;

  const method = (req.method || "GET") as Method;
  const token  = req.cookies[Store.ACCESS_TOKEN];

  const hasBody = ["POST", "PUT", "PATCH"].includes(method.toUpperCase());
  const bodyPart = hasBody && req.body && Object.keys(req.body).length > 0
    ? { data: req.body }
    : {};

  console.log(`[testcases proxy] ${method} ${url}`);

  try {
    const response = await axios.request({
      method,
      url,
      ...bodyPart,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    const payload = response.data;
    const code    = String(payload?.responseCode ?? "");
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
    const status  = error.response?.status || 500;
    const message = error.response?.data?.responseMessage
      || error.response?.data?.message
      || error.message
      || "Proxy error";

    console.error(`[testcases proxy] ${method} ${url} → ${status}`, message);

    return res.status(status).json({
      message,
      details: error.response?.data ?? null,
    });
  }
}