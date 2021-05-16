import {ModelCtor} from "sequelize";
import {DevInstance} from "../models/dev.model";
import {TaskInstance} from "../models/task.model";
import {DevTaskCreationProps, DevTaskInstance, DevTaskProps} from "../models/devTask.model";
import {SequelizeManager} from "../models";

export class DevTaskController {
    Dev: ModelCtor<DevInstance>;
    Task: ModelCtor<TaskInstance>;
    DevTask: ModelCtor<DevTaskInstance>;

    private static instance: DevTaskController;

    public static async getInstance(): Promise<DevTaskController> {
        if (DevTaskController.instance === undefined){
            const {Dev, Task, DevTask} = await SequelizeManager.getInstance();
            DevTaskController.instance = new DevTaskController(Dev, Task, DevTask);
        }
        return DevTaskController.instance;
    }

    private constructor(Dev: ModelCtor<DevInstance>, Task: ModelCtor<TaskInstance>, DevTask: ModelCtor<DevTaskInstance>) {
        this.Dev = Dev;
        this.Task = Task;
        this.DevTask = DevTask;
    }

    public async create(props: DevTaskCreationProps) : Promise<DevTaskInstance | null>{

        const dev = this.Dev.findOne({
            where: {
                id: props.dev_id
            }
        });

        if (dev === null) {
            return null;
        }

        const task = this.Task.findOne({
            where: {
                id: props.task_id
            }
        });

        if (task === null) {
            return null;
        }

        return this.DevTask.create( props );
    }

    public async getOne(dev_id: number, task_id: number): Promise<DevTaskInstance | null> {
        return this.DevTask.findOne({
            where: {
                task_id,
                dev_id
            }
        });
    }

    public async getAll(): Promise<DevTaskInstance[] | null>{
        return this.DevTask.findAll();
    }

    public async getAllForOneTask(task_id: number): Promise<DevTaskInstance[] | null>{
        return this.DevTask.findAll({
            where: {
                task_id
            }
        });
    }

    public async update(props: DevTaskProps): Promise<DevTaskInstance | null>{
        if (
            props.dev_id === undefined ||
            props.task_id === undefined
        ){
            return null;
        }

        const Dev = this.Dev.findOne({
            where: {
                id: props.dev_id
            }
        });

        if (Dev === null) {
            return null;
        }

        const task = this.Task.findOne({
            where: {
                id: props.task_id
            }
        });

        if (task === null) {
            return null;
        }

        const devTask = await this.DevTask.findOne({
            where: {
                id: props.id
            }
        });
        if (devTask == null) {
            return null
        }

        await devTask.update(props);
        return devTask;
    }

    public async delete(id: number): Promise<number>{
        const DevTask = await this.DevTask.findOne({
            where: {
                id
            }
        });
        if (DevTask !== null){
            return this.DevTask.destroy({
                where: {
                    id
                }
            })
        }
        return 0;
    }

}
