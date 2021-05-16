import express from "express";
import {DevTaskController} from "../controllers/devTask.controller";

const devTaskRouter = express.Router();

devTaskRouter.post("/", async function (req, res){
    const {devId, taskId} = req.body;
    if(
        devId === undefined ||
        taskId === undefined
    ){
        res.status(400).end();
        return;
    }

    const devTaskController = await DevTaskController.getInstance();
    const devTask = await devTaskController.create({
        task_id: taskId,
        dev_id: devId
    });

    if (devTask != null){
        res.status(201);
        res.json(devTask);
    }else{
        res.status(409).end();
    }
});

devTaskRouter.get("/", async function (req, res){
    const devTaskController = await DevTaskController.getInstance();
    const devTasks = await devTaskController.getAll();

    if (devTasks != null){
        res.status(200);
        res.json(devTasks);
    }else{
        res.status(204).end();
    }
});

devTaskRouter.get("/:task_id/:dev_id", async function(req, res){
    const {task_id, dev_id} = req.params;
    if (
        task_id === undefined ||
        dev_id === undefined
    ){
        res.status(400).end();
        return;
    }

    const devTaskController = await DevTaskController.getInstance();
    const devTask = await devTaskController.getOne(
        Number.parseInt(dev_id),
        Number.parseInt(task_id)
    );

    if (devTask != null) {
        res.status(200);
        res.json(devTask)
    } else {
        res.status(204).end();
    }
});

devTaskRouter.get("/:task_id", async function(req, res){
    const {task_id} = req.params;
    if (
        task_id === undefined
    ){
        res.status(400).end();
        return;
    }

    const devTaskController = await DevTaskController.getInstance();
    const devTasks = await devTaskController.getAllForOneTask(Number.parseInt(task_id));

    if (devTasks != null){
        res.status(200);
        res.json(devTasks)
    } else {
        res.status(204).end();
    }
});

devTaskRouter.put("/", async function (req ,res){
    const {id, devId, taskId} = req.body;
    if(
        id === undefined
    ){
        res.status(400).end();
        return;
    }

    const devTaskController = await DevTaskController.getInstance();
    const devTask = await devTaskController.update({
        id,
        dev_id: devId,
        task_id: taskId
    });

    if (devTask != null){
        res.status(200);
        res.json(devTask);
    } else {
        res.status(409).end();
    }
});

devTaskRouter.delete("/:id", async function(req, res){
    const {id} = req.params;
    const devTaskController = await DevTaskController.getInstance();
    const affectedRows = await devTaskController.delete(Number.parseInt(id));

    if (affectedRows > 0){
        res.status(200).end();
    } else {
        res.status(204).end();
    }
});

export {
    devTaskRouter
}
