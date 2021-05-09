import {
    Sequelize,
    Optional,
    Model,
    DataTypes,
    ModelCtor,
    BelongsToSetAssociationMixin, BelongsToGetAssociationMixin
} from "sequelize";
import {DevInstance} from "./dev.model";

export interface SessionProps {
    id: number;
    token: string;
    dev_id?: number;
}

export interface SessionCreationProps extends Optional<SessionProps, "id"> {}

export interface SessionInstance extends Model<SessionProps, SessionCreationProps>, SessionProps {
    setDev: BelongsToSetAssociationMixin<DevInstance, "id">;
    getDev: BelongsToGetAssociationMixin<DevInstance>;
}

export default function(sequelize: Sequelize): ModelCtor<SessionInstance> {
    return sequelize.define<SessionInstance>("session", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        token: {
            type: DataTypes.STRING,
            unique: true
        },
        dev_id: {
            type: DataTypes.BIGINT
        }
    }, {
        freezeTableName: true,
        underscored: true,
        paranoid: true,
        timestamps: true
    });
}
