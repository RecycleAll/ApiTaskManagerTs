import {
    Optional,
    Model,
    ModelCtor,
    DataTypes,
    Sequelize
} from "sequelize";

export interface ProjectProps {
    id: number;
    name: string;
}

export interface ProjectCreationProps extends Optional<ProjectProps, "id"> {}

export interface ProjectInstance extends Model<ProjectProps, ProjectCreationProps>, ProjectProps {
}

export default function (sequelize: Sequelize): ModelCtor<ProjectInstance> {
    return sequelize.define<ProjectInstance>("project", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING
        }
    }, {
        freezeTableName: true,
        underscored: true,
        paranoid: true,
        timestamps: true
    });
}
