import PusherServer from 'pusher'
import PusherClient from 'pusher-js'

export const pusherServer = new PusherServer({
  appId:'1596151',
  key: '2e309163186605ef4669',
  secret: '2e7265573c20c661e7b2',
  cluster: 'ap1',
  useTLS: true,
})

export const pusherClient = new PusherClient(
  '2e309163186605ef4669',
  {
    cluster: 'ap1',
  }
)
