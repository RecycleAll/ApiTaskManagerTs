import {Express} from "express";
import {authRouter} from "./auth.route";
import {projectRouter} from './project.route';
import {columnRouter} from './column.route';
import {tagRouter} from './tag.route';
import {taskRouter} from './task.route';
import {tagTaskRouter} from './tagTask.route';
import {devTaskRouter} from './devTask.route';
import {participeRouter} from './participe.route';
import {invitationRouter} from './invitation.route';

export function buildRoutes(app: Express) {
    app.use("/auth", authRouter);
    app.use("/project", projectRouter);
    app.use("/column", columnRouter);
    app.use("/tag", tagRouter);
    app.use("/task", taskRouter);
    app.use("/tagTask", tagTaskRouter);
    app.use("/devTask", devTaskRouter);
    app.use("/participe", participeRouter);
    app.use("/invitation", invitationRouter);
}
