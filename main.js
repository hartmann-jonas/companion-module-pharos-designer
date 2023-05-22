import { InstanceBase, runEntrypoint, InstanceStatus } from '@companion-module/base'
import { getActions } from './actions.js'
import { getVariables } from './variables.js'
import { getFeedbacks } from './feedbacks.js'
import { UpgradeScripts } from './upgrades.js'

import { PharosClient } from './pharos-controls/index.js'

class PharosInstance extends InstanceBase {
	constructor(internal) {
		super(internal)
	}

	async init(config) {
		this.config = config

		this.updateStatus(InstanceStatus.Ok)

		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.updateVariableDefinitions() // export variable definitions

		if (Object.entries(this.config).length > 0) {
			this.controller = new PharosClient()
			await this.controller.authenticate(config.host, config.user, config.password)
			// fill variables
			// TODO: Maybe change the return of the getScenes to be .scenes immeadiatly
			this.groupsResponse = await this.controller.getGroups()
			this.scenesResponse = await this.controller.getScenes()
			console.log('Storing variables...')
			this.groups = this.groupsResponse.map(function(group){
				return { id: group.num, label: group.name }
			})
			this.scenes = this.scenesResponse.map(function(scene){
				return { id: scene.num, label: scene.name }
			})
			this.setVariableValues({
				'groups': this.groupsResponse,
				'scenes': this.scenesResponse
			})

		}
	}

	// When module gets deleted
	async destroy() {
		this.log('debug', 'destroy')
	}

	async configUpdated(config) {
		this.config = config
		this.init(config)
	}

	// Return config fields for web config
	getConfigFields() {
		return [
			{
				type: 'textinput',
				id: 'host',
				label: 'Target IP',
				width: 12,
				//regex: Regex.IP,
			},
			{
				type: 'textinput',
				id: 'user',
				label: 'User',
				width: 6,
				regex: Regex.USER,
			},
			{
				type: 'textinput',
				id: 'password',
				label: 'Password',
				width: 6,
				regex: Regex.PASSWORD,
			},
		]
	}

	updateActions() {
		const actions = getActions.bind(this)()
		this.setActionDefinitions(actions)
	}

	updateFeedbacks() {
		const feedbacks = getFeedbacks.bind(this)()
		this.setFeedbackDefinitions(feedbacks)
	}

	updateVariableDefinitions() {
		const variables = getVariables.bind(this)()
		this.setVariableDefinitions(variables)
	}

	async controlGroup(options) {
		console.log("Controlling group...")
		const res = await this.controller.controlGroup('master-intensity', options)
		console.log(res)
	}

	async controlTimeline(action, options) {
		console.log("Controlling timeline...")
		const res = await this.controller.controlTimeline(action, options)
		console.log(res)
	}
}

runEntrypoint(PharosInstance, UpgradeScripts)
