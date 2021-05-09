import express from "express";
import {TagController} from "../controllers/tag.controller";

const tagRouter = express.Router();

tagRouter.post("/", async function (req, res){
    const {name, projectId} = req.body;

    if (
        name === undefined ||
        projectId === undefined
    ) {
        res.status(400).end();
        return;
    }

    const tagController = await TagController.getInstance();
    const tag = await tagController.create(
        {
            name,
            project_id: projectId
        });

    if (tag != null) {
        res.status(201);
        res.json(tag);
    } else {
        res.status(409).end();
    }
});

tagRouter.get("/all/:projectId", async function(req, res){
    const {projectId} = req.params;
    const tagController = await TagController.getInstance();
    const tags = tagController.getAll( Number.parseInt(projectId) );

    if (tags != null) {
        res.status(200);
        res.json(tags);
    } else {
        res.status(204).end();
    }
});

tagRouter.get("/one/:id", async function(req, res){
    const {id} = req.params;
    const tagController = await TagController.getInstance();
    const tag = tagController.getOne( Number.parseInt(id) );

    if (tag != null) {
        res.status(200);
        res.json(tag)
    } else {
        res.status(204).end();
    }
});

tagRouter.put("/", async function(req, res){
    const {id, name} = req.body;
    if (id === undefined || name === undefined) {
        res.status(400).end();
        return;
    }

    const tagController = await TagController.getInstance();
    const tag = tagController.update({
        id,
        name
    });

    if (tag != null){
        res.status(200);
        res.json(tag);
    } else {
        res.status(400).end();
    }
});


tagRouter.delete("/:id", async function(req, res){
    const {id} = req.params;
    const tagController = await TagController.getInstance();
    const affectedRows = await tagController.delete( Number.parseInt(id) );

    if (affectedRows > 0){
        res.status(200).end();
    } else {
        res.status(400).end();
    }
})

export {
    tagRouter
}
