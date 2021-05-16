import express from "express";
import {TagTaskController} from "../controllers/tagTask.controller";

const tagTaskRouter = express.Router();

tagTaskRouter.post("/", async function (req, res){
    const {tagId, taskId} = req.body;
    if(
        tagId === undefined ||
        taskId === undefined
    ){
        res.status(400).end();
        return;
    }

    const tagTaskController = await TagTaskController.getInstance();
    const tagTask = await tagTaskController.create({
        task_id: taskId,
        tag_id: tagId
    });

    if (tagTask != null){
        res.status(201);
        res.json(tagTask);
    }else{
        res.status(409).end();
    }
});

tagTaskRouter.get("/", async function (req, res){
    const tagTaskController = await TagTaskController.getInstance();
    const tagTasks = await tagTaskController.getAll();

    if (tagTasks != null){
        res.status(200);
        res.json(tagTasks);
    }else{
        res.status(204).end();
    }
});

tagTaskRouter.get("/:task_id/:tag_id", async function(req, res){
    const {task_id, tag_id} = req.params;
    if (
        task_id === undefined ||
        tag_id === undefined
    ){
        res.status(400).end();
        return;
    }

    const tagTaskController = await TagTaskController.getInstance();
    const tagTask = await tagTaskController.getOne(
        Number.parseInt(tag_id),
        Number.parseInt(task_id)
    );

    if (tagTask != null) {
        res.status(200);
        res.json(tagTask)
    } else {
        res.status(204).end();
    }
});

tagTaskRouter.get("/:task_id", async function(req, res){
    const {task_id} = req.params;
    if (
        task_id === undefined
    ){
        res.status(400).end();
        return;
    }

    const tagTaskController = await TagTaskController.getInstance();
    const tagTasks = await tagTaskController.getAllForOneTask(Number.parseInt(task_id));

    if (tagTasks != null){
        res.status(200);
        res.json(tagTasks)
    } else {
        res.status(204).end();
    }
});

tagTaskRouter.put("/", async function (req ,res){
    const {id, tagId, taskId} = req.body;
    if(
        id === undefined
    ){
        res.status(400).end();
        return;
    }

    const tagTaskController = await TagTaskController.getInstance();
    const tagTask = await tagTaskController.update({
        id,
        tag_id: tagId,
        task_id: taskId
    });

    if (tagTask != null){
        res.status(200);
        res.json(tagTask);
    } else {
        res.status(409).end();
    }
});

tagTaskRouter.delete("/:id", async function(req, res){
    const {id} = req.params;
    const tagTaskController = await TagTaskController.getInstance();
    const affectedRows = await tagTaskController.delete(Number.parseInt(id));

    if (affectedRows > 0){
        res.status(200).end();
    } else {
        res.status(204).end();
    }
})

export {
    tagTaskRouter
}
