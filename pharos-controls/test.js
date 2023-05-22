import PharosClient from ".";

const pharosConfig = {
    host: 'https://ceecd628-1f0b-4282-a378-7b9a33987f0a.mock.pstmn.io'
}

const pharosClient = new PharosClient(pharosConfig)

async function test() {
    await pharosClient.authenticate("test", "test")
    await pharosClient.controlTimeline("start", { num: 1 })
    await pharosClient.controlGroup('master_intensity', { num: 1 })
    const groups = await pharosClient.getGroups('1-2')
    console.log(groups)
}

test()