import express from "express";
import {parseDate} from "../utils/date.utils";
import {TaskController} from "../controllers/task.controller";

const taskRouter = express.Router();

taskRouter.post("/", async function(req, res){
    const {name, description, limitDate, columnId} = req.body;
    if (
        name === undefined ||
        description === undefined ||
        limitDate === undefined ||
        columnId === undefined
    ) {
        res.status(400).end();
        return;
    }

    const limit = parseDate(limitDate);
    if(limit == null){
        res.status(400).end();
        return;
    }

    const taskController = await TaskController.getInstance();
    const task = await taskController.create({
        name,
        description,
        limitDate: limit,
        column_id: columnId
    });

    if (task != null) {
        res.status(200);
        res.json(task)
    } else {
        res.status(4090).end();
    }
});

taskRouter.get("/all/:columnId", async function (req, res){
    const {columnId} = req.params;
    const taskController = await TaskController.getInstance();
    const tasks = await taskController.getAll( Number.parseInt(columnId) );

    if (tasks !== null){
        res.status(200);
        res.json(tasks);
    } else {
        res.status(204).end();
    }
});

taskRouter.get("/one/:id", async function (req, res){
    const {id} = req.params;
    const taskController = await TaskController.getInstance();
    const task = await taskController.getOne( Number.parseInt(id) );

    if (task !== null){
        res.status(200);
        res.json(task);
    } else {
        res.status(204).end();
    }
});

taskRouter.put("/", async function (req, res){
    const {id, name, description, limitDate, columnId} = req.body;
    if (
        id === undefined
    ) {
        res.status(400).end();
        return;
    }

    const limit = parseDate(limitDate);

    const taskController = await TaskController.getInstance();
    const task = await taskController.update({
        id,
        name,
        description,
        limitDate : limit !== null ? limit : undefined,
        column_id:columnId
    });

    if (task != null) {
        res.status(200);
        res.json(task);
    } else {
        res.status(400).end();
    }
});

taskRouter.delete("/:id", async function (req, res){
    const {id} = req.params;
    const taskController = await TaskController.getInstance();
    const affectedRows = await taskController.delete( Number.parseInt(id) );

    if (affectedRows > 0){
        res.status(200).end();
    } else {
        res.status(204).end();
    }
})

export {
    taskRouter
}
