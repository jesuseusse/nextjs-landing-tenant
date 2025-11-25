// Firebase Admin helper for verifying ID tokens on the server.
import { getApp, getApps, initializeApp, applicationDefault, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

function initAdmin() {
  if (getApps().length) return getApp();

  const rawServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  const serviceAccount = rawServiceAccount
    ? (() => {
        const parsed = JSON.parse(rawServiceAccount);
        if (parsed.private_key) {
          parsed.private_key = parsed.private_key.replace(/\\n/g, "\n");
        }
        return parsed;
      })()
    : undefined;

  const hasServiceAccount =
    serviceAccount &&
    serviceAccount.project_id &&
    serviceAccount.client_email &&
    serviceAccount.private_key;

  const envProjectId = process.env.FIREBASE_PROJECT_ID;

  if (!hasServiceAccount && !envProjectId) {
    throw new Error(
      "Firebase Admin config missing. Set FIREBASE_SERVICE_ACCOUNT_KEY (JSON) or FIREBASE_PROJECT_ID for applicationDefault().",
    );
  }

  return initializeApp({
    credential: hasServiceAccount ? cert(serviceAccount) : applicationDefault(),
    projectId: serviceAccount?.project_id ?? envProjectId,
  });
}

export async function verifyIdToken(idToken: string) {
  const app = initAdmin();
  const auth = getAuth(app);
  return auth.verifyIdToken(idToken);
}
