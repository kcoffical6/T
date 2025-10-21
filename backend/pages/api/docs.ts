import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/database";
import { corsMiddleware } from "@/middleware/cors";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await corsMiddleware(req, res);

  if (req.method === "GET") {
    try {
      await connectDB();

      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>XYZ Tours and Travels API</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 1000px; margin: 0 auto; padding: 20px; }
            h1 { color: #2c3e50; border-bottom: 2px solid #eee; padding-bottom: 10px; }
            h2 { color: #3498db; margin-top: 30px; }
            .endpoint { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 10px 0; }
            .method { 
              display: inline-block; 
              padding: 3px 8px; 
              border-radius: 3px; 
              color: white; 
              font-weight: bold; 
              margin-right: 10px;
              font-family: monospace;
            }
            .get { background: #2ecc71; }
            .post { background: #3498db; }
            .put { background: #f39c12; }
            .delete { background: #e74c3c; }
            .path { font-family: monospace; font-size: 1.1em; }
            .description { margin-top: 5px; color: #555; }
          </style>
        </head>
        <body>
          <h1>XYZ Tours and Travels API</h1>
          <p>Version 1.0.0 - Modern tours and travels platform for South India</p>
          
          <h2>Authentication</h2>
          <div class="endpoint">
            <span class="method post">POST</span>
            <span class="path">/api/auth/login</span>
            <div class="description">User login with email and password</div>
          </div>
          <div class="endpoint">
            <span class="method post">POST</span>
            <span class="path">/api/auth/signup</span>
            <div class="description">Register a new user account</div>
          </div>
          <div class="endpoint">
            <span class="method post">POST</span>
            <span class="path">/api/auth/refresh</span>
            <div class="description">Refresh authentication token</div>
          </div>
          <div class="endpoint">
            <span class="method post">POST</span>
            <span class="path">/api/auth/logout</span>
            <div class="description">Log out the current user</div>
          </div>
          <div class="endpoint">
            <span class="method get">GET</span>
            <span class="path">/api/auth/profile</span>
            <div class="description">Get current user profile</div>
          </div>

          <h2>Packages</h2>
          <div class="endpoint">
            <span class="method get">GET</span>
            <span class="path">/api/packages</span>
            <div class="description">List all tour packages</div>
          </div>
          <div class="endpoint">
            <span class="method get">GET</span>
            <span class="path">/api/packages/featured</span>
            <div class="description">Get featured packages</div>
          </div>
          <div class="endpoint">
            <span class="method get">GET</span>
            <span class="path">/api/packages/[slug]</span>
            <div class="description">Get package by slug</div>
          </div>
          <div class="endpoint">
            <span class="method get">GET</span>
            <span class="path">/api/packages/region/[region]</span>
            <div class="description">Get packages by region</div>
          </div>

          <h2>Users</h2>
          <div class="endpoint">
            <span class="method get">GET</span>
            <span class="path">/api/users</span>
            <div class="description">List all users (admin only)</div>
          </div>
          <div class="endpoint">
            <span class="method put">PUT</span>
            <span class="path">/api/users/profile</span>
            <div class="description">Update user profile</div>
          </div>
          <div class="endpoint">
            <span class="method put">PUT</span>
            <span class="path">/api/users/passengers</span>
            <div class="description">Update passenger information</div>
          </div>
          <div class="endpoint">
            <span class="method get">GET</span>
            <span class="path">/api/users/role/[role]</span>
            <div class="description">Get users by role</div>
          </div>

          <h2>System</h2>
          <div class="endpoint">
            <span class="method get">GET</span>
            <span class="path">/api/health</span>
            <div class="description">Check API health status</div>
          </div>
        </body>
        </html>
      `;

      res.setHeader("Content-Type", "text/html");
      res.status(200).send(html);
    } catch (error) {
      res.status(500).json({ error: "Failed to get API info" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
