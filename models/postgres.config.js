require('dotenv').config()
import { Sequelize } from 'sequelize'


// const sequelize = new Sequelize( 'Stack-Exchange', process.env.POSTGRES_OWNER, process.env.POSTGRES_PASSWORD, {
//     host : 'localhost',
//     dialect : 'postgres',
//     define : {
//         timestamps : false
//     }
// });

const sequelize = new Sequelize(process.env.POSTGRES_ELEPHANTSQL);

const connect = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        console.log('Database connected');
        
    } catch (error) {
        console.log('UNABLE TO CONNECT TO THE DATABASE', error)
    }
}

connect()

module.exports = { sequelize }