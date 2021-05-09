import {ModelCtor} from "sequelize";
import {DevCreationProps, DevInstance, DevProps} from "../models/dev.model";
import {SessionInstance} from "../models/session.model";
import {SequelizeManager} from "../models";
import {compare, hash} from "bcrypt";

export class AuthController {

    Dev: ModelCtor<DevInstance>;
    Session: ModelCtor<SessionInstance>;

    private static instance: AuthController;

    public static async getInstance(): Promise<AuthController> {
        if (AuthController.instance === undefined) {
            const {Dev, Session} = await SequelizeManager.getInstance();
            AuthController.instance = new AuthController(Dev, Session);
        }
        return AuthController.instance;
    }

    private constructor(Dev: ModelCtor<DevInstance>, Session: ModelCtor<SessionInstance>) {
        this.Dev = Dev;
        this.Session = Session;
    }

    public async register(props: DevCreationProps): Promise<DevInstance | null> {
        const passwordHashed = await hash(props.password, 5);
        return this.Dev.create({
            ...props,
            password: passwordHashed
        })
    }

    public async login(email: string, password: string): Promise<SessionInstance | null> {
        const dev = await this.Dev.findOne({
            where: {
                email
            }
        });

        if (dev === null) {
            return null;
        }

        const isSamePassword = await compare(password, dev.password);
        if (!isSamePassword) {
            return null;
        }

        let session = await this.checkSession(dev);
        if (session != null) {
            return session;
        }

        const token = await hash(Date.now() + email, 5);
        session = await this.Session.create({
            token
        });

        await session.setDev(dev);
        return session;
    }

    public async checkSession(dev: DevInstance): Promise<SessionInstance | null> {
        return this.Session.findOne({
            where: {
                dev_id: dev.id
            }
        });
    }

    public async getSession(token: string): Promise<SessionInstance | null> {
        return this.Session.findOne({
            where: {
                token
            }
        });
    }

    public async logout(token: string): Promise<number> {
        return this.Session.destroy(
            {
                where: {
                    token: token
                }
            }
        );
    }

    public async getAll(): Promise<DevInstance[] | null> {
        return this.Dev.findAll();
    }

    public async getOne(id: number): Promise<DevInstance | null> {
        return this.Dev.findOne({
            where: {
                id
            }
        });
    }

    public async update(props: DevProps): Promise<DevInstance | null> {
        const dev = await AuthController.instance.getOne(props.id);
        if (dev != null) {

            if (props.password != undefined) {
                props.password = await hash(props.password, 5);
            }
            return dev.update(
                props
            );
        }
        return null;
    }

    public async delete(id: number): Promise<number> {
        const dev = await AuthController.instance.getOne(id);
        if (dev != null) {
            return this.Dev.destroy(
                {
                    where: {
                        id: dev.id
                    }
                }
            );
        }
        return 0;
    }

}
