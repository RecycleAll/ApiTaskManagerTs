import {ModelCtor} from "sequelize";
import {ColumnCreationProps, ColumnInstance, ColumnProps} from "../models/column.model";
import {ProjectInstance} from "../models/project.model";
import {SequelizeManager} from "../models";

export class ColumnController {
    Column: ModelCtor<ColumnInstance>;
    Project: ModelCtor<ProjectInstance>;

    private static instance: ColumnController;

    public static async getInstance(): Promise<ColumnController> {
        if (ColumnController.instance === undefined) {
            const {Column, Project} = await SequelizeManager.getInstance();
            ColumnController.instance = new ColumnController(Column, Project);
        }
        return ColumnController.instance;
    }

    private constructor(Column: ModelCtor<ColumnInstance>, Project: ModelCtor<ProjectInstance>) {
        this.Column = Column;
        this.Project = Project;
    }

    public async create(props: ColumnCreationProps): Promise<ColumnInstance | null> {
        const project = this.Project.findOne({
            where: {
                id: props.project_id
            }
        });

        if (project == null){
            return null;
        }

        return this.Column.create( props );
    }

    public async getAll(project_id: number): Promise<ColumnInstance[] | null>{

        const project = this.Project.findOne({
            where: {
                id: project_id
            }
        });

        if (project == null) {
            return null;
        }

        return this.Column.findAll({
            where: {
                project_id
            }
        });
    }

    public async getOne(id: number): Promise<ColumnInstance | null> {
        return this.Column.findOne({
            where: {
                id
            }
        });
    }

    public async update(props: ColumnProps): Promise<ColumnInstance | null> {
        const column = await ColumnController.instance.getOne(props.id);
        if (column != null){
            return column.update(
                props
            );
        }
        return null;
    }

    public async delete(id: number): Promise<number> {
        const column = await ColumnController.instance.getOne(id);
        if (column != null){
            return this.Column.destroy({
                where: {
                    id
                }
            });
        }
        return 0;
    }
}
