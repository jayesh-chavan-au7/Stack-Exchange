require('dotenv').config()
import { sequelize } from './postgres.config'
import Workspace from './workspace.model'
import { DataTypes, UUIDV1 } from 'sequelize'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const User = sequelize.define('User', {
    _id : {
        allowNull : false,
        type : DataTypes.UUID,
        defaultValue : UUIDV1,
        primaryKey : true
    },
    Username : {
        allowNull : false,
        type : DataTypes.STRING
    },
    Email : {
        allowNull : false,
        type : DataTypes.STRING,
        unique : true,
    },
    Password : {
        allowNull : false,
        type : DataTypes.STRING
    }
},{
    hooks : {
        beforeCreate : async function (user) {
            user.Password = await bcrypt.hash(user.Password , 8)
        }
    }
})

User.prototype.genrateAuthToken = function () {
    const user = this
    const token = jwt.sign( {_id : user._id.toString()}, process.env.SECRET_KEY, {expiresIn : '6h'})
    return token
}

User.findByCredentials = async function (Email, Password) {
    const user = await User.findOne({ where : { Email }})
    if(!user){
        console.log('Wrong Email');
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(Password, user.Password)
    if(!isMatch){
        console.log('Wrong Password');
        throw new Error('Unable to login')
    }
    return user
}

User.belongsToMany(Workspace , { through : 'UserWorkspace'} )
Workspace.belongsToMany(User, { through : 'UserWorkspace'})

module.exports = User