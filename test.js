import { PharosClient } from "./pharos.js";

const pharos = new PharosClient()

await pharos.authenticate('192.168.178.149', 'admin', 'pharos')
await pharos.getGroups()
//await pharos.getScenes()
//await pharos.getTimelines()
await pharos.controlTimeline("release", {num: 7})