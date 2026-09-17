import { NextFunction, Request, Response } from "express";

// TODO المرحلة 1: استبدال هذا بقراءة المستخدم الفعلي من الـ JWT بعد بناء موديول auth
export interface AuthenticatedRequest extends Request {
  user?: { id: string; role: "ADMIN" | "DENTIST" | "RECEPTIONIST" | "ACCOUNTANT" };
}

export function requireRole(...allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ errorKey: "auth.unauthorized" });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ errorKey: "auth.forbidden" });
    }

    next();
  };
}
