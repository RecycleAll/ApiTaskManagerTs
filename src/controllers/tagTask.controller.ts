import {ModelCtor} from "sequelize";
import {TagInstance} from "../models/tag.model";
import {TaskInstance} from "../models/task.model";
import {TagTaskCreationProps, TagTaskInstance, TagTaskProps} from "../models/tagTask.model";
import {SequelizeManager} from "../models";

export class TagTaskController {
    Tag: ModelCtor<TagInstance>;
    Task: ModelCtor<TaskInstance>;
    TagTask: ModelCtor<TagTaskInstance>;

    private static instance: TagTaskController;

    public static async getInstance(): Promise<TagTaskController> {
        if (TagTaskController.instance === undefined){
            const {Tag, Task, TagTask} = await SequelizeManager.getInstance();
            TagTaskController.instance = new TagTaskController(Tag, Task, TagTask);
        }
        return TagTaskController.instance;
    }

    private constructor(Tag: ModelCtor<TagInstance>, Task: ModelCtor<TaskInstance>, TagTask: ModelCtor<TagTaskInstance>) {
        this.Tag = Tag;
        this.Task = Task;
        this.TagTask = TagTask;
    }

    public async create(props: TagTaskCreationProps) : Promise<TagTaskInstance | null>{
        const tag = this.Tag.findOne({
            where: {
                id: props.tag_id
            }
        });

        if (tag === null) {
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

        return this.TagTask.create( props );
    }

    public async getOne(tag_id: number, task_id: number): Promise<TagTaskInstance | null> {
        return this.TagTask.findOne({
            where: {
                task_id,
                tag_id
            }
        });
    }

    public async getAll(): Promise<TagTaskInstance[] | null>{
        return this.TagTask.findAll();
    }

    public async getAllForOneTask(task_id: number): Promise<TagTaskInstance[] | null>{
        return this.TagTask.findAll({
            where: {
                task_id
            }
        });
    }

    public async update(props: TagTaskProps): Promise<TagTaskInstance | null>{
        const tag = this.Tag.findOne({
            where: {
                id: props.tag_id
            }
        });

        if (tag === null) {
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

        const tagTask = await this.TagTask.findOne({
            where: {
                id: props.id
            }
        });
        if (tagTask == null) {
            return null
        }

        await tagTask.update(props);
        return tagTask;
    }

    public async delete(id: number): Promise<number>{
        const tagTask = await this.TagTask.findOne({
            where: {
                id
            }
        });
        if (tagTask !== null){
            return this.TagTask.destroy({
                where: {
                    id
                }
            })
        }
        return 0;
    }

}
