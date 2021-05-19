import express from "express";
import {ParticipeController} from "../controllers/participe.controller";

const participeRouter = express.Router();

participeRouter.post("/", async function (req, res) {
    const {devId, projectId} = req.body;
    if (
        devId === undefined ||
        projectId === undefined
    ) {
        res.status(400).end();
        return;
    }

    const participeController = await ParticipeController.getInstance();
    const participe = await participeController.create({
        dev_id: Number.parseInt(devId),
        project_id: Number.parseInt(projectId),
        owner: false
    });

    if (participe != null) {
        res.status(201);
        res.json(participe);
    } else {
        res.status(409).end();
    }
});

participeRouter.get("/", async function (req, res) {
    const participeController = await ParticipeController.getInstance();
    const participes = await participeController!.getAll();

    if (participes != null) {
        res.status(200);
        res.json(participes);
    } else {
        res.status(204).end();
    }
});

participeRouter.get("/:project_id/:dev_id", async function (req, res) {
    const {dev_id, project_id} = req.params;
    const participeController = await ParticipeController.getInstance();
    const participe = await participeController.getOne(
        Number.parseInt(dev_id),
        Number.parseInt(project_id)
    );

    if (participe != null) {
        res.status(200);
        res.json(participe);
    } else {
        res.status(204).end();
    }
});

participeRouter.get("/:project_id", async function (req, res) {
    const {project_id} = req.params;
    const participeController = await ParticipeController.getInstance();
    const participes = await participeController.getAllForOneProject(
        Number.parseInt(project_id)
    );

    if (participes != null) {
        res.status(200);
        res.json(participes);
    } else {
        res.status(204).end();
    }
});

participeRouter.get("/getAll/dev/:dev_id", async function(req, res){
    const {dev_id} = req.params;
    const participeController = await ParticipeController.getInstance();
    const participes = await participeController.getAllForOneDev(
        Number.parseInt(dev_id)
    );

    if (participes != null){
        res.status(200);
        res.json(participes);
    } else {
        res.status(204).end();
    }
})

participeRouter.put("/", async function (req, res) {
    const {id, devId, projectId, owner} = req.body;
    if (
        id === undefined
    ) {
        res.status(400).end();
        return;
    }

    const participeController = await ParticipeController.getInstance();
    const participe = await participeController.update({
        id,
        dev_id: Number.parseInt(devId),
        project_id: Number.parseInt(projectId),
        owner
    });

    if (participe != null) {
        res.status(200);
        res.json(participe);
    } else {
        res.status(409).end();
    }
});

participeRouter.delete("/:id", async function (req, res) {
    const {id} = req.params;
    const participeController = await ParticipeController.getInstance();
    const affectedRows = await participeController.delete(Number.parseInt(id));

    if (affectedRows > 0) {
        res.status(200).end();
    } else {
        res.status(204).end();
    }
});

export {
    participeRouter
}
