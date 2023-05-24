import { PharosClient } from "./pharos.js";

const pharos = new PharosClient()

const url1 = 'ceecd628-1f0b-4282-a378-7b9a33987f0a.mock.pstmn.io'
const url2 = '192.168.178.149'

await pharos.authenticate(url1, 'admin', 'pharos')
await pharos.getGroups()
//await pharos.getScenes()
//await pharos.getTimelines()
await pharos.controlTimeline("release", {num: 7})


await pharos.logout()