import {onRequest, HttpsError} from "firebase-functions/v2/https";
import {setGlobalOptions} from "firebase-functions/v2";
import * as logger from "firebase-functions/logger";
import {defineSecret} from "firebase-functions/params"; // ✅ Secrets API

// ----------------------------------------------------------------------------
// Global config
// ----------------------------------------------------------------------------
setGlobalOptions({maxInstances: 5, region: "europe-west1"});

// Keep your FAL key in Firebase Secrets Manager
const FAL_SECRET = defineSecret("FAL_KEY");

// ----------------------------------------------------------------------------
// Utilities
// ----------------------------------------------------------------------------
/**
 * Gets the FAL API key from Firebase Secrets Manager.
 * @return {string} The FAL API key.
 */
function getFalKey(): string {
  const key = FAL_SECRET.value();
  if (!key) {
    throw new HttpsError("failed-precondition", "FAL_KEY is missing.");
  }
  return key;
}

/**
 * Builds request body for FAL AI API calls.
 * @param {object} params - Request parameters.
 * @param {string} params.prompt - The prompt text.
 * @param {string} params.imageUrl - The image URL.
 * @param {Record<string, unknown> | null} params.extra - Extra parameters.
 * @return {object} The request body.
 */
function buildRequestBody({
  prompt,
  imageUrl,
  extra,
}: {
  prompt: string;
  imageUrl: string;
  extra?: Record<string, unknown> | null;
}) {
  return {
    prompt,
    image_urls: [imageUrl],
    guidance_scale: 3.5,
    num_images: 1,
    output_format: "jpeg",
    safety_tolerance: "2",
    ...(extra || {}),
  };
}

/**
 * Builds request body for status check requests.
 * @param {object} params - Request parameters.
 * @param {string} params.requestId - The request ID to check status for.
 * @param {Record<string, unknown> | null} params.extra - Extra parameters.
 * @return {object} The status request body.
 */
function buildStatusBody({
  requestId,
  extra,
}: {
  requestId: string;
  extra?: Record<string, unknown> | null;
}) {
  return {
    request_id: requestId,
    ...(extra || {}),
  };
}

// ----------------------------------------------------------------------------
// Generic BFF Service
// ----------------------------------------------------------------------------

interface BffRequestData {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  body?: Record<string, unknown>;
  useAuth?: boolean; // FAL API key kullanılsın mı?
}

/**
 * Makes HTTP requests to external APIs.
 * @param {BffRequestData} params - Request parameters.
 * @return {Promise<unknown>} The API response.
 */
async function makeHttpRequest({
  url,
  method = "GET",
  headers = {},
  body,
  useAuth = true,
}: BffRequestData) {
  try {
    const requestHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      ...headers,
    };

    // FAL API key ekle
    if (useAuth) {
      const falKey = getFalKey();
      requestHeaders["Authorization"] = `Key ${falKey}`;
    }

    const requestOptions: RequestInit = {
      method,
      headers: requestHeaders,
    };

    if (body && (method === "POST" || method === "PUT")) {
      requestOptions.body = JSON.stringify(body);
    }

    logger.info(`Making ${method} request to: ${url}`);

    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      const errorText = await response.text();
      logger.error(
        `Request failed: ${response.status} ${response.statusText}`,
        {
          url,
          method,
          error: errorText,
        });
      throw new HttpsError(
        "internal",
        `Request failed: ${response.status} ${response.statusText}`,
        {url, status: response.status, error: errorText},
      );
    }

    const data = await response.json();
    logger.info(`Request successful to: ${url}`);
    return data;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    logger.error("HTTP request error:", {url, method, error: errorMessage});

    if (error instanceof HttpsError) {
      throw error;
    }

    throw new HttpsError("internal", `Network error: ${errorMessage}`, {
      url,
      method,
      originalError: errorMessage,
    });
  }
}

// ----------------------------------------------------------------------------
// BFF HTTP Endpoint
// ----------------------------------------------------------------------------

export const bffService = onRequest(
  {
    secrets: [FAL_SECRET],
    cors: true,
    maxInstances: 10,
  },
  async (req, res) => {
    // CORS headers
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") {
      res.status(204).send("");
      return;
    }

    if (req.method !== "POST") {
      res.status(405).json({error: "Method not allowed"});
      return;
    }

    try {
      const {url, method, headers, body, useAuth} = req.body as BffRequestData;

      // URL validasyonu
      if (!url || typeof url !== "string") {
        res.status(400).json({
          error: "URL gereklidir ve string olmalıdır",
        });
        return;
      }

      // URL güvenlik kontrolü (sadece belirli domainlere izin ver)
      const allowedDomains = [
        "queue.fal.run",
        "fal.run",
        // İhtiyaç duyduğunuz diğer domainler
      ];

      const urlObj = new URL(url);
      const isAllowed = allowedDomains.some((domain) =>
        urlObj.hostname === domain || urlObj.hostname.endsWith(`.${domain}`),
      );

      if (!isAllowed) {
        res.status(403).json({
          error: `Bu domain'e istek yapılamaz: ${urlObj.hostname}`,
        });
        return;
      }

      const result = await makeHttpRequest({
        url,
        method: method || "GET",
        headers: headers || {},
        body,
        useAuth: useAuth !== false, // Default true
      });

      res.status(200).json({
        success: true,
        data: result,
        url,
        method: method || "GET",
        timestamp: new Date().toISOString(),
      });
    } catch (error: unknown) {
      logger.error("BFF Service error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown";
      res.status(500).json({
        error: errorMessage,
        success: false,
      });
    }
  },
);

// ----------------------------------------------------------------------------
// Örnek Kullanım Fonksiyonları
// ----------------------------------------------------------------------------

// AI Tool Request HTTP Endpoint
export const aiToolRequest = onRequest(
  {
    secrets: [FAL_SECRET],
    cors: true,
  },
  async (req, res) => {
    // CORS headers
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") {
      res.status(204).send("");
      return;
    }

    if (req.method !== "POST") {
      res.status(405).json({error: "Method not allowed"});
      return;
    }

    try {
      const {serviceUrl, prompt, imageUrl, extra} = req.body;

      if (!prompt || !imageUrl) {
        res.status(400).json({
          error: "prompt ve imageUrl gereklidir",
        });
        return;
      }

      const body = buildRequestBody({prompt, imageUrl, extra});

      const result = await makeHttpRequest({
        url: serviceUrl,
        method: "POST",
        body,
        useAuth: true,
      });

      res.status(200).json({
        success: true,
        data: result,
        url: serviceUrl,
        method: "POST",
        timestamp: new Date().toISOString(),
      });
    } catch (error: unknown) {
      logger.error("AI Tool Request error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown";
      res.status(500).json({
        error: errorMessage,
        success: false,
      });
    }
  },
);

export const aiToolStatus = onRequest(
  {
    secrets: [FAL_SECRET],
    cors: true,
  },
  async (req, res) => {
    // CORS headers
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") {
      res.status(204).send("");
      return;
    }

    if (req.method !== "POST") {
      res.status(405).json({error: "Method not allowed"});
      return;
    }

    try {
      const {serviceUrl, requestId, extra} = req.body;

      if (!requestId) {
        res.status(400).json({
          error: "requestId gereklidir",
        });
        return;
      }

      const body = buildStatusBody({requestId, extra});

      const result = await makeHttpRequest({
        url: serviceUrl,
        method: "GET",
        body,
        useAuth: true,
      });

      res.status(200).json({
        success: true,
        data: result,
        method: "GET",
        timestamp: new Date().toISOString(),
      });
    } catch (error: unknown) {
      logger.error("AI Tool Status error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown";
      res.status(500).json({
        error: errorMessage,
        success: false,
      });
    }
  },
);

export const aiToolResult = onRequest(
  {
    secrets: [FAL_SECRET],
    cors: true,
  },
  async (req, res) => {
    // CORS headers
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") {
      res.status(204).send("");
      return;
    }

    if (req.method !== "POST") {
      res.status(405).json({error: "Method not allowed"});
      return;
    }

    try {
      const {serviceUrl, requestId, extra} = req.body;

      if (!requestId) {
        res.status(400).json({
          error: "requestId gereklidir",
        });
        return;
      }

      const body = buildStatusBody({requestId, extra});

      const result = await makeHttpRequest({
        url: serviceUrl,
        method: "GET",
        body,
        useAuth: true,
      });

      res.status(200).json({
        success: true,
        data: result,
        method: "GET",
        timestamp: new Date().toISOString(),
      });
    } catch (error: unknown) {
      logger.error("AI Tool Result error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown";
      res.status(500).json({
        error: errorMessage,
        success: false,
      });
    }
  },
);
