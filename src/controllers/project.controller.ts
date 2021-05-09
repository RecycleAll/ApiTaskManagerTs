import {ModelCtor} from "sequelize";
import {DevInstance} from "../models/dev.model";
import {SessionInstance} from "../models/session.model";
import {ProjectCreationProps, ProjectInstance, ProjectProps} from "../models/project.model";
import {ParticipeInstance} from "../models/participe";
import {SequelizeManager} from "../models";

export class ProjectController {

    Dev: ModelCtor<DevInstance>;
    Session: ModelCtor<SessionInstance>
    Project: ModelCtor<ProjectInstance>;
    Participe: ModelCtor<ParticipeInstance>;

    private static instance: ProjectController;

    public static async getInstance() : Promise<ProjectController> {
        if (ProjectController.instance === undefined){
            const {Dev, Session, Project, Participe} = await SequelizeManager.getInstance();
            ProjectController.instance = new ProjectController(Dev, Session, Project, Participe);
        }
        return ProjectController.instance;
    }

    private constructor(Dev: ModelCtor<DevInstance>, Session: ModelCtor<SessionInstance>, Project: ModelCtor<ProjectInstance>, Participe: ModelCtor<ParticipeInstance>) {
        this.Dev = Dev;
        this.Session = Session;
        this.Project = Project;
        this.Participe = Participe;
    }

    public async create(props: ProjectCreationProps, devId: number): Promise<ProjectInstance | null> {
        const dev = await this.Dev.findOne({
            where: {
                id: devId
            }
        });

        if (dev == null){
            return null;
        }

        const project = await this.Project.create(props);
        if (project == null){
            return null;
        }

        await this.Participe.create({
            dev_id: dev.id,
            project_id: project.id,
            owner: true
        })

        return project;
    }

    public async getAll(devId: number): Promise<ProjectInstance[] | null> {
        const dev = await this.Dev.findOne({
            where: {
                id: devId
            }
        });

        if (dev == null){
            return null;
        }

        return dev.getProjects();
    }

    public async getOne(projectId: number): Promise<ProjectInstance | null> {
        return this.Project.findOne({
            where: {
                id: projectId
            }
        });
    }

    public async update(props: ProjectProps): Promise<ProjectInstance | null> {
        const project = await ProjectController.instance.getOne(props.id);
        if (project != null) {
            return project.update(
                props
            );
        }
        return null;
    }

    public async delete(id: number): Promise<number> {
        const project = await ProjectController.instance.getOne(id);
        if (project != null) {
            return this.Project.destroy({
                where: {
                    id: project.id
                }
            })
        }
        return 0;
    }
}
