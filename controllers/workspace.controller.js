import workspaceModel from '../models/workspace.model'
import userModel from '../models/user.model'
import { check } from '../utils/validEmailCheck'
import { sendInvitation } from '../utils/invitationMail'

class Workspace {

    getForm(req, res, next) {
        res.status(200).sendFile('workspace.html', { root : '\public'})
    }

    async create(req, res, next) {
        req.body.ValidEmails = check(req.body.ValidEmails, req.user)
        sendInvitation(req.body.Name,req.body.ValidEmails)
        req.body.Admins = [{ Admin : req.user._id}]
        
        try {
            const workspace = await workspaceModel.create(req.body)
            const user = await userModel.findOne({ where : { _id : req.user._id}})
            await user.addWorkspace(workspace)
            const Workspaces = await user.getWorkspaces();
            res.status(201).render('dashboard',
            { Err : null, User: req.user.Username , Workspaces })
        } catch (error) {
            if(error.name === 'SequelizeUniqueConstraintError'){
                return res.status(500).render('Error', { message : ['Workspace already taken'], 
                            action : '/user/createworkspace', btn : 'Try Again'})
            }
            console.log(error.message);
            res.status(500).send(error)
        }
    }

    async findAndJoinWorkspace(req, res, next){
        try {
            const workspace = await workspaceModel.findOne({ where : { Name : req.body.Name }})
            let user = req.user
            
            // For invalid workspace 
            if(!workspace || !workspace.ValidEmails.includes(user.Email)){
                user = await userModel.findOne({ where : { _id : req.user._id}})
                const Workspaces = await user.getWorkspaces();
                return res.status(404).render('dashboard', 
                { Err : `Didn't find workspace !, please check your workspace name `,
                User: req.user.Username , Workspaces })
            }

            // For Already Registered
            user = await userModel.findOne({ where : { _id : req.user._id}})
            let Workspaces = await user.getWorkspaces();
            if(Workspaces.some( Obj => { return Obj.Name === req.body.Name})){
                return res.status(201).render('dashboard',
                    { Err : `You are already registered to this workspace`, 
                    User: req.user.Username ,Workspaces})
            }

            // For joining workspace
            await user.addWorkspace(workspace)
            await workspace.addUsers(user)
            Workspaces = await user.getWorkspaces()
            res.status(201).render('dashboard',
            { Err : null, User: req.user.Username ,Workspaces })
        
        } catch (error) {
            res.status(500).send(error)
        }
    }
}

module.exports = new Workspace