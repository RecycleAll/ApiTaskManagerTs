import {ModelCtor, Sequelize} from "sequelize";
import {Dialect} from "sequelize/types/lib/sequelize";
import columnCreator, {ColumnInstance} from "./column.model";
import taskCreator, {TaskInstance} from "./task.model";
import devCreator, {DevInstance} from "./dev.model";
import devTaskCreator, {DevTaskInstance} from "./devTask.model";
import participeCreator, {ParticipeInstance} from './participe.model'
import projectCreator, {ProjectInstance} from "./project.model";
import tagCreator, {TagInstance} from "./tag.model";
import tagTaskCreator, {TagTaskInstance} from "./tagTask.model";
import sessionCreator, {SessionInstance} from "./session.model";
import invitationCreator, {InvitationInstance} from './invitation.model';

export interface SequelizeManagerProps {
    sequelize: Sequelize;
    Column: ModelCtor<ColumnInstance>;
    Task: ModelCtor<TaskInstance>;
    Dev: ModelCtor<DevInstance>;
    DevTask: ModelCtor<DevTaskInstance>;
    Project: ModelCtor<ProjectInstance>;
    Tag: ModelCtor<TagInstance>;
    Participe: ModelCtor<ParticipeInstance>;
    TagTask: ModelCtor<TagTaskInstance>;
    Session: ModelCtor<SessionInstance>;
    Invitation: ModelCtor<InvitationInstance>;
}

export class SequelizeManager implements SequelizeManagerProps {

    sequelize: Sequelize;
    Column: ModelCtor<ColumnInstance>;
    Task: ModelCtor<TaskInstance>;
    Dev: ModelCtor<DevInstance>;
    DevTask: ModelCtor<DevTaskInstance>;
    Project: ModelCtor<ProjectInstance>;
    Tag: ModelCtor<TagInstance>;
    Participe: ModelCtor<ParticipeInstance>;
    TagTask: ModelCtor<TagTaskInstance>;
    Session: ModelCtor<SessionInstance>;
    Invitation: ModelCtor<InvitationInstance>;

    private static instance?: SequelizeManager

    public static async getInstance(): Promise<SequelizeManager> {
        if (SequelizeManager.instance === undefined) {
            SequelizeManager.instance = await SequelizeManager.initialize();
        }
        return SequelizeManager.instance;
    }
    private static async initialize(): Promise<SequelizeManager> {
        const sequelize = new Sequelize({
            dialect: process.env.DB_DRIVER as Dialect,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            port: Number.parseInt(process.env.DB_PORT as string)
        });
        await sequelize.authenticate();
        const managerProps: SequelizeManagerProps = {
            sequelize,
            Task: taskCreator(sequelize),
            Dev: devCreator(sequelize),
            Column: columnCreator(sequelize),
            DevTask: devTaskCreator(sequelize),
            Project: projectCreator(sequelize),
            Tag: tagCreator(sequelize),
            Participe: participeCreator(sequelize),
            TagTask: tagTaskCreator(sequelize),
            Session: sessionCreator(sequelize),
            Invitation: invitationCreator(sequelize),
        };

        SequelizeManager.associate(managerProps);
        await sequelize.sync({
            // force: true //Permet de recréer toutes les tables
        });

        return new SequelizeManager(managerProps);
    }

    private static associate(props: SequelizeManagerProps): void {
        //DevTask associations
        props.Dev.belongsToMany(props.Task, {
            through: {
                model: props.DevTask,
                unique: false
            },
            foreignKey: "dev_id"
        });
        props.Task.belongsToMany(props.Dev, {
            through: {
                model: props.DevTask,
                unique: false
            },
            foreignKey: "task_id"
        });

        //Participe associations
        props.Dev.belongsToMany(props.Project, {
            through: {
                model: props.Participe,
                unique: false
            },
            foreignKey: "dev_id"
        });
        props.Project.belongsToMany(props.Dev, {
            through: {
                model: props.Participe,
                unique: false
            },
            foreignKey: "project_id"
        });

        //TagTask associations
        props.Tag.belongsToMany(props.Task, {
            through: {
                model: props.TagTask,
                unique: false
            },
            foreignKey: "tag_id"
        });
        props.Task.belongsToMany(props.Tag, {
            through: {
                model: props.TagTask,
                unique: false
            },
            foreignKey: "task_id"
        });

        //Association between Dev and Session
        props.Session.belongsTo(props.Dev, {
            foreignKey: "dev_id"
        });
        props.Dev.hasMany(props.Session, {
            foreignKey: {
                name: "dev_id",
                allowNull: true
            }
        });

        //Association between Project and Tag
        props.Tag.belongsTo(props.Project, {
            foreignKey: "project_id"
        });
        props.Project.hasMany(props.Tag, {
            foreignKey: {
                name: "project_id",
                allowNull: true
            }
        });

        //Association between Project and Column
        props.Column.belongsTo(props.Project, {
            foreignKey: "project_id"
        });
        props.Project.hasMany(props.Column, {
            foreignKey: {
                name: "project_id",
                allowNull: true
            }
        });

        //Association between Task and Column
        props.Task.belongsTo(props.Column, {
            foreignKey: "column_id"
        });
        props.Column.hasMany(props.Task, {
            foreignKey: {
                name: "column_id",
                allowNull: true
            }
        });

        //Invitation associations
        props.Invitation.belongsTo(props.Project, {
            foreignKey: "project_id"
        });
        props.Project.hasMany(props.Invitation, {
            foreignKey: {
                name: "project_id",
                allowNull: true
            }
        });

        props.Invitation.belongsTo(props.Dev, {
            foreignKey: "from_dev_id"
        });
        props.Dev.hasMany(props.Invitation, {
            foreignKey: {
                name: "from_dev_id",
                allowNull: true
            }
        });

        props.Invitation.belongsTo(props.Dev, {
            foreignKey: "to_dev_id"
        });
        props.Dev.hasMany(props.Invitation, {
            foreignKey: {
                name: "to_dev_id",
                allowNull: true
            }
        });
    }

    private constructor(props: SequelizeManagerProps) {
        this.sequelize = props.sequelize;
        this.Task = props.Task;
        this.Dev = props.Dev;
        this.Column = props.Column;
        this.DevTask = props.DevTask;
        this.Project = props.Project;
        this.Tag = props.Tag;
        this.Participe = props.Participe;
        this.TagTask = props.TagTask;
        this.Session = props.Session;
        this.Invitation = props.Invitation;
    }
}
