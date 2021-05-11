import {Express} from "express";
import {authRouter} from "./auth.route";
import {projectRouter} from './project.route';
import {columnRouter} from './column.route';
import {tagRouter} from './tag.route';
import {taskRouter} from './task.route';

export function buildRoutes(app: Express) {
    app.use("/auth", authRouter);
    app.use("/project", projectRouter);
    app.use("/column", columnRouter);
    app.use("/tag", tagRouter);
    app.use("/task", taskRouter);
}
