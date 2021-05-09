import {
    Optional,
    Model,
    ModelCtor,
    DataTypes,
    Sequelize, HasManyGetAssociationsMixin, HasManyGetAssociationsMixinOptions, BelongsToManyGetAssociationsMixin
} from "sequelize";
import {SessionInstance} from "./session.model";
import {ProjectInstance} from "./project.model";

export interface DevProps {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    githubId: string;
}

export interface DevCreationProps extends Optional<DevProps, "id"> {}

export interface DevInstance extends Model<DevProps, DevCreationProps>, DevProps {
    getSession: HasManyGetAssociationsMixin<SessionInstance>;

    getProjects: BelongsToManyGetAssociationsMixin<ProjectInstance>;
}

export default function(sequelize: Sequelize): ModelCtor<DevInstance> {
    return sequelize.define<DevInstance>("dev", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        firstname: {
            type: DataTypes.STRING
        },
        lastname: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.STRING
        },
        githubId: {
            type: DataTypes.STRING
        }
    }, {
        freezeTableName: true,
        underscored: true,
        paranoid: true,
        timestamps: true
    })
}
