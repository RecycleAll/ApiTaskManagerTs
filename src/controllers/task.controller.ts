import {ModelCtor} from "sequelize";
import {TaskCreationProps, TaskInstance, TaskProps} from "../models/task.model";
import {ColumnInstance} from "../models/column.model";
import {SequelizeManager} from "../models";

export class TaskController{
    Task: ModelCtor<TaskInstance>;
    Column: ModelCtor<ColumnInstance>;

    private static instance: TaskController;

    public static async getInstance(): Promise<TaskController> {
        if (TaskController.instance === undefined){
            const {Task, Column} = await SequelizeManager.getInstance();
            TaskController.instance = new TaskController(Task, Column);
        }
        return TaskController.instance;
    }

    private constructor(Task: ModelCtor<TaskInstance>, Column: ModelCtor<ColumnInstance>) {
        this.Task = Task;
        this.Column = Column;
    }

    public async create(props: TaskCreationProps) : Promise<TaskInstance | null> {
        const column = this.Column.findOne({
            where: {
                id: props.column_id
            }
        });
        if (column == null){
            return null;
        }
        return this.Task.create( props );
    }

    public async getAll(column_id : number): Promise<TaskInstance[] | null >{
        const column = this.Column.findOne({
            where: {
                id: column_id
            }
        });

        if (column == null){
            return null;
        }

        return this.Task.findAll({
            where: {
                column_id
            }
        });
    }

    public async deleteAll(column_id : number): Promise<number>{
        const column = this.Column.findOne({
            where: {
                id: column_id
            }
        });

        if (column == null){
            return 0;
        }

        return this.Task.destroy({
            where: {
                column_id
            }
        });
    }

    public async getOne(id: number): Promise<TaskInstance | null >{
        return this.Task.findOne({
            where: {
                id
            }
        });
    }

    public async update(props: TaskProps): Promise<TaskInstance | null> {
        if (props.column_id !== undefined) {
            const column = await this.Column.findOne({
                where: {
                    id: props.column_id
                }
            });

            if (column === null){
                return null;
            }
        }

        const task = await TaskController.instance.getOne(props.id);
        if (task !== null){
            return task.update(
                props
            );
        }else{
            return null;
        }
    }

    public async delete(id: number):Promise<number>{
        const task = await TaskController.instance.getOne(id);
        if (task != null){
            return this.Task.destroy({
                where: {
                    id
                }
            })
        }
        return 0;
    }

}
