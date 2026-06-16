import { onRequest, HttpsError } from "firebase-functions/v2/https";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

const CI_TOKEN = process.env.CI_REGISTER_TOKEN!;

export const ciRegisterRelease = onRequest(async (req, res) => {
  try {
    if (req.method !== "POST") {
      throw new HttpsError("invalid-argument", "POST required");
    }

    // Bearer token autentikacija za CI
    const authHeader = req.headers.authorization ?? "";
    if (!authHeader.startsWith("Bearer ") || authHeader.slice(7) !== CI_TOKEN) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const {
      version,
      channel = "stable",
      notes = "",
      mandatory = false,
      minServerVersion = "0.0.0",
      minClientVersion = "0.0.0",
      artifacts,
    } = req.body;

    if (!version) {
      throw new HttpsError("invalid-argument", "version required");
    }
    if (!artifacts?.server || !artifacts?.client) {
      throw new HttpsError("invalid-argument", "artifacts.server and artifacts.client required");
    }

    const db = getFirestore();
    const now = Timestamp.now();

    const docData = {
      version,
      channel,
      status: "draft",
      isLatest: false,
      notes,
      mandatory,
      minServerVersion,
      minClientVersion,
      artifacts: {
        server: {
          feedPath: artifacts.server.feedPath ?? `software-updates/server/${channel}`,
          setupUrl: artifacts.server.setupUrl ?? null,
          fullSize: artifacts.server.fullSize ?? null,
          deltaSize: artifacts.server.deltaSize ?? null,
          sha256: artifacts.server.sha256 ?? null,
        },
        client: {
          feedPath: artifacts.client.feedPath ?? `software-updates/client/${channel}`,
          setupUrl: artifacts.client.setupUrl ?? null,
          fullSize: artifacts.client.fullSize ?? null,
          deltaSize: artifacts.client.deltaSize ?? null,
          sha256: artifacts.client.sha256 ?? null,
        },
      },
      createdAt: now,
      publishedAt: null,
      createdBy: "ci",
    };

    await db.collection("releases").doc(version).set(docData);

    res.json({ success: true, version, status: "draft" });
  } catch (err: any) {
    console.error("CI_REGISTER_RELEASE ERROR", err);
    res.status(500).json({ error: err.message ?? "Registration failed" });
  }
});
