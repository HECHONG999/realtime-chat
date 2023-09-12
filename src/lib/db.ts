import { Redis } from '@upstash/redis'

export const db = new Redis({
  url: 'https://credible-boar-33126.upstash.io',
  token: 'AYFmASQgZjRjN2RlZDktMzE2NC00YmU4LThhMjAtMzdkOTc5ODY4NmYxZWQ4YzZhN2FmMzBjNDUzYmEzNTQ5YzMzODMzNjM4YTY=',
})
