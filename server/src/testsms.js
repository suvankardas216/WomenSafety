import twilio from "twilio" 
import dotenv from "dotenv"

dotenv.config({
    path: "../.env"});

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

async function createMessage() {
    console.log("SID:", process.env.TWILIO_SID);
    console.log("TOKEN:", process.env.TWILIO_AUTH_TOKEN ? "Loaded ✅" : "Missing ❌");

    const message = await client.messages.create({
        body: "This is the ship that made the Kessel Run in fourteen parsecs?",
        from: process.env.TWILIO_PHONE,
        to: "+918119976229",
    });

    console.log(message.body);
}

createMessage();