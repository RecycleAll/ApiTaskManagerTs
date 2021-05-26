import express from "express";

export async function securityMiddleware(req: express.Request, res: express.Response, next: express.NextFunction){
    const auth = req.headers["authorization"];
    if (auth !== undefined){

    }

    next();
}
