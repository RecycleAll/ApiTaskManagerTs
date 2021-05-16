import {ModelCtor} from "sequelize";
import {InvitationCreationProps, InvitationInstance, InvitationProps} from "../models/invitation.model";
import {DevInstance} from "../models/dev.model";
import {ProjectInstance} from "../models/project.model";
import {SequelizeManager} from "../models";

export class InvitationController{
    Invitation : ModelCtor<InvitationInstance>;
    Dev: ModelCtor<DevInstance>;
    Project: ModelCtor<ProjectInstance>;

    private static instance: InvitationController;

    public static async getInstance() : Promise<InvitationController> {
        if (InvitationController.instance === undefined){
            const {Invitation, Dev, Project} = await SequelizeManager.getInstance();
            InvitationController.instance = new InvitationController(Invitation, Dev, Project);
        }
        return InvitationController.instance;
    }

    private constructor(Invitation: ModelCtor<InvitationInstance>, Dev: ModelCtor<DevInstance>, Project: ModelCtor<ProjectInstance>) {
        this.Invitation = Invitation;
        this.Dev = Dev;
        this.Project = Project;
    }

    public async create(props : InvitationCreationProps): Promise<InvitationInstance | null >{

        if (!await this.checkExisting(props.project_id, props.from_dev_id, props.to_dev_id)){
            return null;
        }

        return this.Invitation.create( props );
    }

    public async getAll(): Promise<InvitationInstance[] | null >{
        return this.Invitation.findAll();
    }

    public async getAllForOneProject(project_id: number): Promise<InvitationInstance[] | null >{
        return this.Invitation.findAll({
            where: {
                project_id
            }
        })
    }

    public async getAllForOneDev(to_dev_id: number): Promise<InvitationInstance[] | null >{
        return this.Invitation.findAll({
            where: {
                to_dev_id
            }
        })
    }

    public async getOne(id: number): Promise<InvitationInstance | null>{
        return this.Invitation.findOne({
            where: {
                id
            }
        });
    }

    public async update (props : InvitationProps): Promise<InvitationInstance | null>{
        if (!await this.checkExisting(props.project_id, props.from_dev_id, props.to_dev_id)){
            return null;
        }

        const invitation = await InvitationController.instance.getOne( props.id );
        if (invitation == null){
            return null;
        }

        return invitation.update(props);
    }

    public async delete(id: number): Promise<number> {
        const invitation = await InvitationController.instance.getOne(id);
        if (invitation != null) {
            return this.Invitation.destroy({
                where: {
                    id: invitation.id
                }
            })
        }
        return 0;
    }

    private async checkExisting(project_id?: number, from_dev_id?: number, to_dev_id?: number): Promise<boolean>{
        const project = await this.Project.findOne({
            where: {
                id: project_id
            }
        });
        if (project == null) {
            return false;
        }

        const dev_from = await this.Dev.findOne({
            where: {
                id: from_dev_id
            }
        });
        if (dev_from == null){
            return false;
        }

        const dev_to = await this.Dev.findOne({
            where: {
                id: to_dev_id
            }
        });
        if (dev_to == null){
            return false;
        }

        return true
    }
}
