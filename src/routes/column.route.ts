import express from "express";
import {ColumnController} from "../controllers/column.controller";

const columnRouter = express.Router();

columnRouter.post("/", async function (req, res){
    const {name, projectId} = req.body;

    if (
        name === undefined ||
        projectId === undefined
    ) {
        res.status(400).end();
        return;
    }

    const columnController = await ColumnController.getInstance();
    const column = await columnController.create(
        {
            name,
            project_id: projectId
        });

    if (column != null) {
        res.status(201);
        res.json(column);
    } else {
        res.status(409).end();
    }
});

columnRouter.get("/all/:projectId", async function(req, res){
    const {projectId} = req.params;
    const columnController = await ColumnController.getInstance();
    const columns = columnController.getAll( Number.parseInt(projectId) );

    if (columns != null) {
        res.status(200);
        res.json(columns);
    } else {
        res.status(204).end();
    }
});

columnRouter.get("/one/:id", async function(req, res){
    const {id} = req.params;
    const columnController = await ColumnController.getInstance();
    const column = columnController.getOne( Number.parseInt(id) );

    if (column != null) {
        res.status(200);
        res.json(column)
    } else {
        res.status(204).end();
    }
});

columnRouter.put("/", async function(req, res){
    const {id, name} = req.body;
    if (id === undefined || name === undefined) {
        res.status(400).end();
        return;
    }

    const columnController = await ColumnController.getInstance();
    const column = columnController.update({
        id,
        name
    });

    if (column != null){
        res.status(200);
        res.json(column);
    } else {
        res.status(400).end();
    }
});


columnRouter.delete("/:id", async function(req, res){
    const {id} = req.params;
    const columnController = await ColumnController.getInstance();
    const affectedRows = await columnController.delete( Number.parseInt(id) );

    if (affectedRows > 0){
        res.status(200).end();
    } else {
        res.status(400).end();
    }
})

export {
    columnRouter
}
