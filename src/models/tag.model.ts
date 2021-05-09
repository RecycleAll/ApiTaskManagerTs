import {
    Optional,
    Model,
    ModelCtor,
    DataTypes,
    Sequelize, BelongsToSetAssociationMixin, BelongsToGetAssociationMixin
} from "sequelize";
import {ProjectInstance} from "./project.model";

export interface TagProps {
    id: number;
    name: string;
    project_id?: number;
}

export interface TagCreationProps extends Optional<TagProps, "id"> {}

export interface TagInstance extends Model<TagProps, TagCreationProps>, TagProps {
    setProject: BelongsToSetAssociationMixin<ProjectInstance, "id">;
    getProject: BelongsToGetAssociationMixin<ProjectInstance>;
}

export default function (sequelize: Sequelize): ModelCtor<TagInstance> {
    return sequelize.define<TagInstance>("tag", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING
        },
        project_id: {
            type: DataTypes.BIGINT
        }
    }, {
        freezeTableName: true,
        underscored: true,
        paranoid: true,
        timestamps: true
    });
}
