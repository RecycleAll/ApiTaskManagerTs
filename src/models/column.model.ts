import {
    Optional,
    Model,
    ModelCtor,
    DataTypes,
    Sequelize, BelongsToSetAssociationMixin, BelongsToGetAssociationMixin
} from "sequelize";
import {ProjectInstance} from "./project.model";

export interface ColumnProps {
    id: number;
    name: string;
    project_id?: number;
}

export interface ColumnCreationProps extends Optional<ColumnProps, "id"> {}

export interface ColumnInstance extends Model<ColumnProps, ColumnCreationProps>, ColumnProps {
    setProject: BelongsToSetAssociationMixin<ProjectInstance, "id">;
    getProject: BelongsToGetAssociationMixin<ProjectInstance>;
}

export default function (sequelize: Sequelize): ModelCtor<ColumnInstance> {
    return sequelize.define<ColumnInstance>("column", {
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
