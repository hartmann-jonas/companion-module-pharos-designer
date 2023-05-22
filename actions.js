export function getActions() {
	return {
		controlGroups: {
			name: 'Control Groups',
			options: [
				{
					id: 'num',
					type: 'textinput',
					default: '1',
					label: 'Group',
				},
				{
					id: 'level',
					type: 'number',
					max: 100,
					min: 0,
					default: 0,
					label: 'Master Intensity',
				},
				{
					id: 'fade',
					type: 'number',
					default: 0,
					label: 'Fade (seconds)'
				}
			],
			callback: (event) => {
				this.controlGroup(event)
			},
		},
		controlTimeline: {
			name: 'Control Timeline',
			options: [
				{
					id: 'action',
					type: 'dropdown',
					choices: [
						{ id: 'start', label: 'Start' },
						{ id: 'release', label: 'Release' },
						{ id: 'toggle', label: 'Toggle' },
						{ id: 'pause', label: 'Pause' },
						{ id: 'resume', label: 'Resume' },
						{ id: 'set_rate', label: 'Set rate' },
						{ id: 'set_position', label: 'Set position'},
					],
					default: 'start',
					label: 'Action',
				},
				{
					id: 'num',
					type: 'number',
					label: 'Timeline Number',
					step: 1,
					min: 0,
					default: 1,
					required: true,
				},
				{
					id: 'rate',
					type: 'textinput',
					isVisible: ((options) => options.action == 'set_rate'),
					label: 'Rate (0.1 to 1 is default timeline rate)',
				},
				{
					id: 'position',
					isVisible: ((options) => options.action == 'set_position'),
					type: 'textinput',
					label: 'Position (Fraction of timeline e.g. 0.5 or 10:100)',
				},
				{
					id: 'fade',
					type: 'number',
					label: 'Fade',
					min: 0,
					default: 0,
				},
			],
			callback: (event) => {
				event = event.options
				const action = event.action
				delete event.action
				const options = event
				this.controlTimeline(action, options)
			},
		},
	}
}
