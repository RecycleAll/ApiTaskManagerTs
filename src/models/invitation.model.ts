import {DataTypes, Model, ModelCtor, Optional, Sequelize,} from "sequelize";

export interface InvitationProps {
    id: number;
    status: number;
    from_dev_id?: number;
    to_dev_id?: number;
    project_id?: number;
}

export interface InvitationCreationProps extends Optional<InvitationProps, "id"> {
}

export interface InvitationInstance extends Model<InvitationProps, InvitationCreationProps>, InvitationProps {

}

export default function (sequelize: Sequelize): ModelCtor<InvitationInstance> {
    return sequelize.define<InvitationInstance>("invitation", {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true
            },
            status: {
                type: DataTypes.BIGINT
            },
            from_dev_id: {
                type: DataTypes.BIGINT
            },
            to_dev_id: {
                type: DataTypes.BIGINT
            },
            project_id: {
                type: DataTypes.BIGINT
            },
        }, {
            timestamps: true,
            underscored: true,
            freezeTableName: true,
            paranoid: true,
        }
    );
}
