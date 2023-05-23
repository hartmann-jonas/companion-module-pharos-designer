import { InstanceBase, runEntrypoint, InstanceStatus } from '@companion-module/base'
import { getActions } from './actions.js'
import { getVariables } from './variables.js'
import { getFeedbacks } from './feedbacks.js'
import { UpgradeScripts } from './upgrades.js'
import { Regex } from '@companion-module/base'

import { PharosClient } from './pharos.js'

class PharosInstance extends InstanceBase {
	constructor(internal) {
		super(internal)
	}

	async init(config) {
		this.config = config

		this.updateStatus(InstanceStatus.Connecting)

		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.updateVariableDefinitions() // export variable definitions

		// this needs some serious rework, but idk how at the moment
		this.controller = new PharosClient()
		const authRes = await this.controller.authenticate(config.host, config.user, config.password)
		// if validation didnt succeed
		if (!authRes.success) {
			this.updateStatus(InstanceStatus.ConnectionFailure)
		} else if (authRes.success) {
			this.updateStatus(InstanceStatus.Ok)
			// fill variables for eventual use in companion
			// FIXME: module crashes here when changing the ip to invalid one
			this.groupsResponse = await this.controller.getGroups()
			this.scenesResponse = await this.controller.getScenes()
			this.timelinesResponse = await this.controller.getTimelines()
			console.log('Storing variables...')
			console.log(this.groupsResponse.groups)
			console.log(this.scenesResponse.scenes)
			console.log(this.timelinesResponse.timelines)
			// QUESTION: the ?. is a nasty hack but it should always work (hopefully)
			this.groups = this.groupsResponse.groups?.map(function (group) {
				return { id: group.num, label: group.name }
			})
			this.scenes = this.scenesResponse.scenes?.map(function (scene) {
				return { id: scene.num, label: scene.name }
			})
			this.timelines = this.timelinesResponse.timelines?.map(function (timeline) {
				return { id: timeline.num, label: timeline.name }
			})
			// QUESTION: this is really optional rn i dont know if people would
			// get a real use out of it, or if it just wastes performance
			this.setVariableValues({
				groups: this.groupsResponse.groups,
				scenes: this.scenesResponse.scenes,
				timelines: this.timelinesResponse.timelines,
			})
		}
	}

	// When module gets deleted
	async destroy() {
		if (this.controller) {
			this.controller.logout()
			// QUESTION: is that right?
			// delete this.controller
		}
		this,this.updateStatus(InstanceStatus.Disconnected)
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
				regex: Regex.IP,
			},
			{
				type: 'textinput',
				id: 'user',
				label: 'User',
				width: 6,
			},
			{
				type: 'textinput',
				id: 'password',
				label: 'Password',
				width: 6,
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

	async controlTimeline(action, options) {
		const res = await this.controller.controlTimeline(action, options)
		if (!res.success) {
			this.updateStatus(InstanceStatus.UnknownError, res.error)
		}
		console.log(res)
	}

	async controlGroup(action, options) {
		const res = await this.controller.controlGroup(action, options)
		if (!res.success) {
			this.updateStatus(InstanceStatus.UnknownError, res.error)
		}
		// TODO: delete those console.log´s
		console.log(res)
	}

	async controlScene(action, options) {
		const res = await this.controller.controlScene(action, options)
		if (!res.success) {
			this.updateStatus(InstanceStatus.UnknownError, res.error)
		}
		console.log(res)
	}
}

runEntrypoint(PharosInstance, UpgradeScripts)
