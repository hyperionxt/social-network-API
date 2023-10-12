import { NextFunction, Response, Request } from "express";


export const adminRequired = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userRole = req.user.role.title
    if (userRole !== "admin")
      return res.status(403).json({ message: "not authorized" });
    next();
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export const moderatorOrAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    
    const userRole = req.user.role;
    if (userRole.title !== "moderator" && userRole.title !== "admin")
      return res.status(403).json({ message: "not authorized" });
    next();
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};
