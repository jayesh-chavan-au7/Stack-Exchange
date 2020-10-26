import { sequelize } from './postgres.config'
import { DataTypes, UUIDV1 } from 'sequelize'

const Workspace = sequelize.define('Workspace', {
    _id : {
        allowNull : false,
        type : DataTypes.UUID,
        defaultValue : UUIDV1,
        primaryKey : true
    },
    Name : {
        allowNull : false,
        type : DataTypes.STRING,
        unique : true
    },
    Discription : {
        allowNull : false,
        type : DataTypes.TEXT
    },
    ValidEmails : {
        type : DataTypes.ARRAY(DataTypes.STRING)
    },
    Admins: {
        allowNull : true,
        type : DataTypes.ARRAY(DataTypes.JSON)
    },
    ChatHistory : {
        type : DataTypes.ARRAY(DataTypes.JSON)
    }
})

module.exports = Workspace