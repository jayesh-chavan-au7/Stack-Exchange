import dotenv from 'dotenv'
dotenv.config()
import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SEND_GRID)

export const sendInvitation = async (workspace, emailsArr) => {

    const html = 
        `<h2>Stack-Exchange</h2>
        <p>This is the invitation to join <span style="font-weight: bold;">"${workspace}"</span> workspace</p>
        <p>click below link to create your Stack-Exchange Account and join your team</p>
        <p>https://stack-exchange-v1.herokuapp.com/</p>
        <h3>Note : Join with this Email id only</h3>`

    const msg = {
        to : emailsArr,
        from : "stackexchange2020@gmail.com",
        Subject : "Joining invitation",
        html
    }

    try {
        const error = await sgMail.sendMultiple(msg)
        if (error.response) {
            console.error(error.response.body)
        }
        console.log('email sent');
    } catch (error) {
        console.log(error);
    }
}
