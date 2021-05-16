import express from "express";
import {ProjectController} from "../controllers/project.controller";

const projectRouter = express.Router();

projectRouter.post("/", async function (req, res){
    const {name, devId} = req.body;

    if (
        name === undefined ||
        devId === undefined
    ) {
        res.status(400).end();
        return;
    }

    const projectController = await ProjectController.getInstance();
    const project = await projectController.create(
        {
            name
        }, Number.parseInt(devId)
    );

    if (project != null) {
        res.status(201);
        res.json(project);
    } else {
        res.status(409).end();
    }
});

projectRouter.get("/all/:devId", async function(req, res){
    const {devId} = req.params;
    const projectController = await ProjectController.getInstance();
    const projects = await projectController.getAll( Number.parseInt(devId) );

    if (projects != null) {
        res.status(200);
        res.json(projects);
    } else {
        res.status(204).end();
    }
});

projectRouter.get("/one/:id", async function(req, res){
    const {id} = req.params;
    const projectController = await ProjectController.getInstance();
    const project = await projectController.getOne( Number.parseInt(id) );

    if (project != null) {
        res.status(200);
        res.json(project)
    } else {
        res.status(204).end();
    }
});

projectRouter.put("/", async function(req, res){
    const {id, name} = req.body;
    if (id === undefined || name === undefined) {
        res.status(400).end();
        return;
    }

    const projectController = await ProjectController.getInstance();
    const project = await projectController.update({
        id,
        name
    });

    if (project != null){
        res.status(200);
        res.json(project);
    } else {
        res.status(400).end();
    }
});


projectRouter.delete("/:id", async function(req, res){
    const {id} = req.params;
    const projectController = await ProjectController.getInstance();
    const affectedRows = await projectController.delete( Number.parseInt(id) );

    if (affectedRows > 0){
        res.status(200).end();
    } else {
        res.status(400).end();
    }
})


export {
    projectRouter
};
