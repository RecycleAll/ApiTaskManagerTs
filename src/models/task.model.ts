import {
    Optional,
    Model,
    ModelCtor,
    DataTypes,
    Sequelize, BelongsToSetAssociationMixin, BelongsToGetAssociationMixin
} from "sequelize";
import {ColumnInstance} from "./column.model";

export interface TaskProps {
    id: number;
    name: string;
    description: string;
    limitDate?: Date;
    column_id?: number;
}

export interface TaskCreationProps extends Optional<TaskProps, "id"> {}

export interface TaskInstance extends Model<TaskProps, TaskCreationProps>, TaskProps {
    setColumn: BelongsToSetAssociationMixin<ColumnInstance, "id">;
    getColumn: BelongsToGetAssociationMixin<ColumnInstance>;
}

export default function (sequelize: Sequelize): ModelCtor<TaskInstance> {
    return sequelize.define<TaskInstance>("task", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING
        },
        description: {
            type: DataTypes.STRING
        },
        limitDate: {
            type: DataTypes.DATEONLY
        },
        column_id: {
            type: DataTypes.BIGINT
        }
    }, {
        freezeTableName: true,
        underscored: true,
        paranoid: true,
        timestamps: true
    })
}
