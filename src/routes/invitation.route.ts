import express from "express";
import {InvitationController} from "../controllers/invitation.controller";
import {parse} from "url";

const invitationRouter = express.Router();

invitationRouter.post("/", async function(req, res){
    const {status, fromDevId, toDevId, projectId} = req.body;
    if (
        status === undefined ||
        fromDevId === undefined ||
        toDevId === undefined ||
        projectId === undefined
    ){
        res.status(400).end();
        return;
    }

    const invitationController = await InvitationController.getInstance();
    const invitation = await invitationController.create({
        status,
        from_dev_id: fromDevId,
        to_dev_id: toDevId,
        project_id: projectId
    });

    if (invitation != null){
        res.status(201);
        res.json(invitation);
    } else {
        res.status(409).end();
    }
});

invitationRouter.get("/", async function(req, res){
    const invitationController = await InvitationController.getInstance();
    const invitations = await invitationController.getAll();

    if (invitations != null){
        res.status(200);
        res.json(invitations);
    } else {
        res.status(204).end();
    }
});

invitationRouter.get("/project/:project_id", async function(req, res){
    const {project_id} = req.params;
    const invitationController = await InvitationController.getInstance();
    const invitations = await invitationController.getAllForOneProject(
        Number.parseInt(project_id)
    );

    if (invitations != null){
        res.status(200);
        res.json(invitations);
    } else {
        res.status(204).end();
    }
});

invitationRouter.get("/dev/:to_dev_id", async function(req, res){
    const {to_dev_id} = req.params;
    const invitationController = await InvitationController.getInstance();
    const invitations = await invitationController.getAllForOneDev(
        Number.parseInt(to_dev_id)
    );

    if (invitations != null){
        res.status(200);
        res.json(invitations);
    } else {
        res.status(204).end();
    }
});

invitationRouter.get("/:id", async function(req, res){
    const {id} = req.params;
    const invitationController = await InvitationController.getInstance();
    const invitation = await invitationController.getOne( Number.parseInt(id) );

    if (invitation != null){
        res.status(200);
        res.json(invitation);
    } else {
        res.status(204).end();
    }
});

invitationRouter.put("/", async function (req, res){
    const {id, status, fromDevId, toDevId, projectId} = req.body;
    if (
        id === undefined
    ){
        res.status(400).end();
        return;
    }

    const invitationController = await InvitationController.getInstance();
    const invitation = await invitationController.update({
        id,
        status,
        from_dev_id: fromDevId,
        to_dev_id: toDevId,
        project_id: projectId

    });

    if (invitation !== null){
        res.status(200);
        res.json(invitation);
    } else {
        res.status(409).end();
    }
});

invitationRouter.delete("/:id", async function(req, res){
    const {id} = req.params;
    const invitationController = await InvitationController.getInstance();
    const affectedRows = await invitationController.delete( Number.parseInt(id) );

    if (affectedRows > 0) {
        res.status(200).end();
    } else {
        res.status(204).end();
    }
})

export {
    invitationRouter
}
