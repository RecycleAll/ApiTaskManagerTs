import {
    Sequelize,
    Model,
    ModelCtor, DataTypes, Optional, BelongsToSetAssociationMixin, BelongsToGetAssociationMixin,
} from "sequelize";

import {TagInstance} from "./tag.model";
import {TaskInstance} from "./task.model";

export interface TagTaskProps {
    id: number;
    tag_id?: number;
    task_id?: number;
}

export interface TagTaskCreationProps extends Optional<TagTaskProps, "id">{}

export interface TagTaskInstance extends Model<TagTaskProps, TagTaskCreationProps>, TagTaskProps{
    setTag: BelongsToSetAssociationMixin<TagInstance, "id">;
    getTag: BelongsToGetAssociationMixin<TagInstance>;

    setTask: BelongsToSetAssociationMixin<TaskInstance, "id">;
    getTask: BelongsToGetAssociationMixin<TaskInstance>;
}

export default function (sequelize: Sequelize): ModelCtor<TagTaskInstance> {
    return sequelize.define<TagTaskInstance>("tagTask", {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true
            },
            tag_id: {
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
