import {ModelCtor} from "sequelize";
import {DevInstance} from "../models/dev.model";
import {ProjectInstance} from "../models/project.model";
import {ParticipeCreationProps, ParticipeInstance, ParticipeProps} from "../models/participe.model";
import {SequelizeManager} from "../models";

export class ParticipeController{

    Participe: ModelCtor<ParticipeInstance>;
    Dev: ModelCtor<DevInstance>;
    Project: ModelCtor<ProjectInstance>;

    private static instance: ParticipeController;

    public static async getInstance() : Promise<ParticipeController>{
        if (ParticipeController.instance === undefined){
            const {Participe, Dev, Project} = await SequelizeManager.getInstance();
            ParticipeController.instance = new ParticipeController(Participe, Dev, Project);
        }
        return ParticipeController.instance;
    }

    private constructor(Participe: ModelCtor<ParticipeInstance>, Dev: ModelCtor<DevInstance>, Project: ModelCtor<ProjectInstance>) {
        this.Participe = Participe;
        this.Dev = Dev;
        this.Project = Project;
    }

    public async create(props: ParticipeCreationProps): Promise<ParticipeInstance | null>{
        const dev = this.Dev.findOne({
            where: {
                id: props.dev_id
            }
        });

        if (dev === null) {
            return null;
        }

        const project = this.Project.findOne({
            where: {
                id: props.project_id
            }
        });

        if (project === null) {
            return null;
        }

        return this.Participe.create( props );
    }

    public async getOne(dev_id: number, project_id: number): Promise<ParticipeInstance | null> {
        return this.Participe.findOne({
            where: {
                project_id,
                dev_id
            }
        });
    }

    public async getAll(): Promise<ParticipeInstance[] | null>{
        return this.Participe.findAll();
    }

    public async getAllForOneProject(project_id: number): Promise<ParticipeInstance[] | null>{
        return this.Participe.findAll({
            where: {
                project_id
            }
        });
    }

    public async getAllForOneDev(dev_id: number): Promise<ParticipeInstance[] | null>{
        return this.Participe.findAll({
            where: {
                dev_id
            }
        });
    }

    public async update(props: ParticipeProps): Promise<ParticipeInstance | null>{
        const dev = this.Dev.findOne({
            where: {
                id: props.dev_id
            }
        });

        if (dev === null) {
            return null;
        }

        const project = this.Project.findOne({
            where: {
                id: props.project_id
            }
        });

        if (project === null) {
            return null;
        }

        const participe = await this.Participe.findOne({
            where: {
                id: props.id
            }
        });
        if (participe == null) {
            return null
        }

        await participe.update( props );
        return participe;
    }

    public async delete(id: number): Promise<number>{
        const participe = await this.Participe.findOne({
            where: {
                id
            }
        });
        if (participe !== null){
            return this.Participe.destroy({
                where: {
                    id
                }
            })
        }
        return 0;
    }
}
