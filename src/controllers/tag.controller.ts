import {ModelCtor} from "sequelize";
import {TagCreationProps, TagInstance, TagProps} from "../models/tag.model";
import {ProjectInstance} from "../models/project.model";
import {SequelizeManager} from "../models";

export class TagController {
    Tag: ModelCtor<TagInstance>;
    Project: ModelCtor<ProjectInstance>;

    private static instance: TagController;

    public static async getInstance(): Promise<TagController> {
        if (TagController.instance === undefined) {
            const {Tag, Project} = await SequelizeManager.getInstance();
            TagController.instance = new TagController(Tag, Project);
        }
        return TagController.instance;
    }

    private constructor(Tag: ModelCtor<TagInstance>, Project: ModelCtor<ProjectInstance>) {
        this.Tag = Tag;
        this.Project = Project;
    }

    public async create(props: TagCreationProps): Promise<TagInstance | null> {
        const project = this.Project.findOne({
            where: {
                id: props.project_id
            }
        });

        if (project == null){
            return null;
        }

        return this.Tag.create( props );
    }

    public async getAll(project_id: number): Promise<TagInstance[] | null>{

        const project = this.Project.findOne({
            where: {
                id: project_id
            }
        });

        if (project == null) {
            return null;
        }

        return this.Tag.findAll({
            where: {
                project_id
            }
        });
    }

    public async getOne(id: number): Promise<TagInstance | null> {
        return this.Tag.findOne({
            where: {
                id
            }
        });
    }

    public async update(props: TagProps): Promise<TagInstance | null> {
        const tag = await TagController.instance.getOne(props.id);
        if (tag != null){
            return tag.update(
                props
            );
        }
        return null;
    }

    public async delete(id: number): Promise<number> {
        const tag = await TagController.instance.getOne(id);
        if (tag != null){
            return this.Tag.destroy({
                where: {
                    id
                }
            });
        }
        return 0;
    }
}
