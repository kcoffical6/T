import { NextApiRequest, NextApiResponse } from 'next';
import { Request, Response, RequestHandler } from 'express';

export interface ExpressRequest extends Request {
  user?: any;
}

export interface ExpressResponse extends Response {}

export function adaptExpressMiddleware(handler: RequestHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const expressReq = req as unknown as ExpressRequest;
    const expressRes = res as unknown as ExpressResponse;

    // Add Express-like methods if needed
    if (!expressRes.status) {
      expressRes.status = (code: number) => {
        res.statusCode = code;
        return expressRes;
      };
      expressRes.json = (data: any) => {
        res.json(data);
        return expressRes;
      };
    }

    try {
      await handler(expressReq, expressRes, () => {});
    } catch (error) {
      console.error('Error in adapted middleware:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}

export function adaptExpressRoute(handler: (req: ExpressRequest, res: ExpressResponse) => Promise<any>) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const expressReq = req as unknown as ExpressRequest;
    const expressRes = res as unknown as ExpressResponse;

    try {
      // If the handler returns a response, send it
      const result = await handler(expressReq, expressRes);
      
      // If the handler didn't send a response itself, send the result
      if (!res.headersSent && result) {
        return res.json(result);
      }
    } catch (error) {
      console.error('Error in adapted route:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  };
}
