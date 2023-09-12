import {fetchRedis} from "@/helpers/redis";
import {addFriendValidator,addUserValidator} from "@/lib/validations/add-friend";
import {db} from "@/lib/db";
import { v4 as uuidv4 } from 'uuid';
/**
 * Date: 2023/09/12 22:53
 * Author: chonghe
 * Email: chong@intrii.com
 * Copyright: (c) 2023, 英荟科技有限公司
 */
export async function POST(req:Request) {
    const body = await req.json()
    console.log('post-==--',body)

    const { email: emailToAdd } = addFriendValidator.parse(body.email)
    const {name, image, emailVerified} = addUserValidator.parse(body)
    const idToAdd = (await fetchRedis(
        'get',
        `user:email:${emailToAdd}`
    )) as string
    if(!idToAdd) {
        const uuid = uuidv4()
        const userData = {
            name,
            image,
            emailVerified,
            id: uuid
        }

        await db.set(`user:${uuid}`, JSON.stringify(userData))
        await db.set(` user:account:by-user-id:${uuid}`,`user:account:google:${uuidv4()}`)
        // await db.set(`user:email:${emailToAdd}`)
        return new Response('This person does  added to database.', { status: 200 })
    }
    console.log('正常登陆')
    return new Response('OK', {status: 200})
}
