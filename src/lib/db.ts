import { Redis } from '@upstash/redis'

export const db = new Redis({
  url: 'https://apn1-proper-marmot-33806.upstash.io',
  token: 'AYQOASQgZjEwMmM0YzktZGUyNy00OGQwLWI4OWUtMmY2MDM3MjcyZjQ4NjFjMWY1NGIzM2I2NDQxZWI2MjEyMzAxODMxYTAzZWM=',
})
