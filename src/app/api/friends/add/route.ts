import { fetchRedis } from "@/helps/redis";
import { authOptions } from "@/lib/auth";
import { addFriendValidator } from "@/lib/validations/add-friend";
import { getServerSession } from "next-auth";

export async function POST(req:Request) {
    try{
        const body  = await req.json() ;
        const {email: emailToAdd} = addFriendValidator.parse(body.email)
        const idToAdd = (await fetchRedis(
            'get', 
            `user:email:${emailToAdd}`
            )) as string

        if (!idToAdd) {
            return new Response('This person does not exist.', { status: 400 })
        }
        const session = await getServerSession(authOptions)
        console.log('session', session)
    }catch(error) {

    }
}