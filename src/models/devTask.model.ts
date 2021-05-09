import {
    Sequelize,
    Model,
    ModelCtor, DataTypes, Optional, BelongsToSetAssociationMixin, BelongsToGetAssociationMixin,
} from "sequelize";

import {DevInstance} from "./dev.model";
import {TaskInstance} from "./task.model";

export interface DevTaskProps {
    id: number;
    dev_id?: number;
    task_id?: number;
}

export interface DevTaskCreationProps extends Optional<DevTaskProps, "id">{}

export interface DevTaskInstance extends Model<DevTaskProps, DevTaskCreationProps>, DevTaskProps{
    setDev: BelongsToSetAssociationMixin<DevInstance, "id">;
    getDev: BelongsToGetAssociationMixin<DevInstance>;

    setTask: BelongsToSetAssociationMixin<TaskInstance, "id">;
    getTask: BelongsToGetAssociationMixin<TaskInstance>;
}

export default function (sequelize: Sequelize): ModelCtor<DevTaskInstance> {
    return sequelize.define<DevTaskInstance>("devTask", {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true
            },
            dev_id: {
                type: DataTypes.BIGINT
            },
            task_id: {
                type: DataTypes.BIGINT
            }
        }, {
            timestamps: false,
            underscored: true,
            freezeTableName: true,
            paranoid: true,
        }
    );
}
