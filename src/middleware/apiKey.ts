import { Request, Response, NextFunction } from "express";

const EXPECTED_KEY = process.env.API_KEY;

export function apiKeyGuard(req: Request, res: Response, next: NextFunction) {
  // admite tanto header como query
  const key =
    req.header("x-api-key") || (req.query.api_key as string | undefined);

  if (!EXPECTED_KEY) {
    // si no hay key configurada, no bloqueamos (útil en dev)
    return next();
  }

  if (!key || key !== EXPECTED_KEY) {
    return res.status(401).json({ error: "unauthorized" });
  }

  return next();
}
