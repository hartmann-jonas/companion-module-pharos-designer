import { PharosClient } from './pharos.js'

const pharos = new PharosClient()

const url = '192.168.178.149'

async function test() {
	await pharos.authenticate(url, 'admin', 'pharos')
	await pharos.getGroups()
	//await pharos.getScenes()
	//await pharos.getTimelines()
	await pharos.controlTimeline('release', { num: 7 })
	await pharos.logout()
}

test()
