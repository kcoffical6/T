import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import multer from "multer";
import { withRole } from "@/middleware/auth";
import { corsMiddleware } from "@/middleware/cors";
import { adaptExpressMiddleware } from "@/lib/expressAdapter";

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadsDir = path.join(process.cwd(), "public", "uploads");

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const ts = Date.now();
    const safeOriginal = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "-");
    cb(null, `${ts}-${safeOriginal}`);
  },
});

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  const allowed = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
  ];
  if (allowed.includes(file.mimetype)) return cb(null, true);
  return cb(new Error("Unsupported file type"));
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter,
});

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await corsMiddleware(req, res);

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const run = adaptExpressMiddleware(upload.array("files", 10));
  await run(req, res);

  // @ts-ignore multer adds files
  const files = (req.files || []).map((f: any) => ({
    fieldName: f.fieldname,
    originalName: f.originalname,
    fileName: f.filename,
    mimeType: f.mimetype,
    size: f.size,
    url: `/uploads/${f.filename}`,
  }));

  return res.status(201).json({ success: true, files });
}

export default async function protectedHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return new Promise<void>(() => {
    const middleware = withRole(["admin", "super_admin"]);
    // @ts-ignore
    middleware(req, res, (result: any) => {
      if (result instanceof Error) {
        return res.status(500).json({ error: result.message });
      }
      return handler(req, res);
    });
  });
}
