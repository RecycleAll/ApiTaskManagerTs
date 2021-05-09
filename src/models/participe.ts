import {
    BelongsToGetAssociationMixin,
    BelongsToSetAssociationMixin,
    DataTypes,
    Model,
    ModelCtor,
    Optional,
    Sequelize,
} from "sequelize";
import {DevInstance} from "./dev.model";
import {ProjectInstance} from "./project.model";
import {DevTaskInstance} from "./devTask.model";

export interface ParticipeProps {
    id: number;
    dev_id?: number;
    project_id?: number;
    owner: boolean;
}

export interface ParticipeCreationProps extends Optional<ParticipeProps, "id">{}

export interface ParticipeInstance extends Model<ParticipeProps, ParticipeCreationProps>, ParticipeProps{
    setDev: BelongsToSetAssociationMixin<ParticipeInstance, "id">;
    getDev: BelongsToGetAssociationMixin<DevInstance>;

    setProject: BelongsToSetAssociationMixin<ProjectInstance, "id">;
    getProject: BelongsToGetAssociationMixin<ProjectInstance>;
}

export default function (sequelize: Sequelize): ModelCtor<ParticipeInstance> {
    return sequelize.define<ParticipeInstance>("participe", {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true
            },
            dev_id: {
                type: DataTypes.BIGINT
            },
            project_id: {
                    type: DataTypes.BIGINT
            },
            owner: {
                type: DataTypes.BOOLEAN
            }
        }, {
            timestamps: false,
            underscored: true,
            freezeTableName: true,
            paranoid: true,
        }
    );
}
