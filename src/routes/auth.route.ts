import express from "express";
import {AuthController} from "../controllers/auth.controller";
import {authMiddleware} from "../middlewares/auth.middlewares";

const authRouter = express.Router();

authRouter.post("/register", async function(req, res){
    const {firstname, lastname, email, password, githubId} = req.body;

    if (
        firstname === undefined ||
        lastname === undefined ||
        email === undefined ||
        password === undefined ||
        githubId === undefined
    ) {
        res.status(400).end();
        return;
    }

    const authController = await AuthController.getInstance();
    const dev = await authController.register({
        firstname,
        lastname,
        email,
        password,
        githubId
    });

    if (dev !== null) {
        res.status(201);
        res.json(dev);
    } else {
        res.status(409).end();
    }
});

authRouter.post("/login", async function (req, res){
    const {email, password} = req.body;
    if(email === undefined || password === undefined) {
        res.status(400).end();
        return;
    }

    const authController = await AuthController.getInstance();
    const session = await authController.login(email, password);

    if (session !== null){
        res.status(201);
        res.json(session);
    } else {
        res.status(404).end();
        return;
    }
});

authRouter.delete("/logout", authMiddleware, async function (req, res){
    const auth = req.headers["authorization"];
    if (auth !== undefined) {
        const token = auth.slice(7);
        const authController = await AuthController.getInstance();
        const affectedRows = await authController.logout(token);

        if (affectedRows > 0){
            res.status(200).end();
        } else {
            res.status(401).end();
        }
    }
    res.status(400).end();
});

authRouter.get("/", async function (req, res){
    const authController = await AuthController.getInstance();
    const Devs = await authController.getAll();

    if (Devs != null){
        res.status(200);
        res.json(Devs);
    } else {
        res.status(204).end();
    }
});

authRouter.get("/:id", async function (req, res){
    const {id} = req.params;
    const authController = await AuthController.getInstance();
    const Dev = await authController.getOne(Number.parseInt(id));

    if (Dev != null) {
        res.status(200);
        res.json(Dev);
    } else {
        res.status(404).end();
    }
});

authRouter.put("/", async function (req, res){
    const {id, firstname, lastname, email, password, githubId} = req.body;
    if (id === undefined ) {
        res.status(400).end();
        return;
    }
    const authController = await AuthController.getInstance();
    const Dev = await authController.update({
        id,
        firstname,
        lastname,
        email,
        password,
        githubId
    });

    if (Dev !== null) {
        res.status(200);
        res.json(Dev);
    } else {
        res.status(400).end();
    }
});

authRouter.delete("/:id", async function (req, res){
    const {id} = req.params;
    const authController = await AuthController.getInstance();
    const affectedRows = await authController.delete(Number.parseInt(id));

    if (affectedRows > 0) {
        res.status(200).end();
    } else {
        res.status(400).end();
    }
});

export {
    authRouter
};
