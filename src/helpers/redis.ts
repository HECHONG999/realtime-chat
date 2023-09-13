const upstashRedisRestUrl = 'https://credible-boar-33126.upstash.io'
const authToken = 'AYFmASQgZjRjN2RlZDktMzE2NC00YmU4LThhMjAtMzdkOTc5ODY4NmYxZWQ4YzZhN2FmMzBjNDUzYmEzNTQ5YzMzODMzNjM4YTY='

type Command = 'zrange' | 'sismember' | 'get' | 'smembers'

export async function fetchRedis(command:Command, ...arg: (string | number)[]) {
    const commandUrl = `${upstashRedisRestUrl}/${command}/${arg.join('/')}`;
    const response = await fetch(commandUrl, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        },
        cache: 'no-cache'
    })
    if(!response.ok) {
        throw new Error(`Error executing Redis command: ${response.statusText}`)
    }

    const data = await response.json()
    return data.result
}



