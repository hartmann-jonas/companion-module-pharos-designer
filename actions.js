export function getActions() {
	return {
		controlTimeline: {
			name: 'Control Timeline',
			options: [
				{
					id: 'action',
					type: 'dropdown',
					label: 'Action',
					choices: [
						{ id: 'start', label: 'Start' },
						{ id: 'release', label: 'Release' },
						{ id: 'toggle', label: 'Toggle' },
						{ id: 'pause', label: 'Pause' },
						{ id: 'resume', label: 'Resume' },
						{ id: 'set_rate', label: 'Set rate' },
						{ id: 'set_position', label: 'Set position' },
					],
					default: 'start',
					required: true,
				},
				{
					id: 'num',
					type: 'number',
					label: 'Timeline Number',
					default: 1,
					step: 1,
					min: 0,
					required: true,
				},
				/* 	QUESTION: why is this not working?
					https://bitfocus.github.io/companion-module-base/interfaces/CompanionInputFieldStaticText.html
				{
					id: 'info-text-rate',
					type: 'static-text',
					label: 'Information',
					value: 'The Rate input ONLY takes values containing a number, where 1.0 means the timeline’s default rate. Example: 0.1 equals 10% of the default rate; 0.8 equals 80% of the default rate',
					isVisible: (options) => options.action == 'set_rate' 
				},
				{
					id: 'info-text-position',
					type: 'static-text',
					label: 'Information',
					value: 'The Position input ONLY takes values containing a number from 0 to 1, that represents a fraction of the timeline. Example: 20min timeline',
					isVisible: (options) => options.action == 'set_position'
				},*/
				{
					id: 'rate',
					type: 'textinput',
					label: 'Rate (0.1 to 1 is default timeline rate)',
					isVisible: (options) => options.action == 'set_rate',
					required: true,
				},
				{
					id: 'position',
					type: 'textinput',
					label: 'Position (Fraction of timeline e.g. 0.5 or 10:100)',
					isVisible: (options) => options.action == 'set_position',
					required: true,
				},
				{
					id: 'fade',
					type: 'number',
					label: 'Fade (seconds)',
					default: 0,
					min: 0,
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
		controlGroups: {
			name: 'Control Groups',
			options: [
				{
					id: 'num',
					type: 'number',
					label: 'Group Number',
					default: 1,
					step: 1,
					min: 0,
					required: true,
				},
				/* 	QUESTION: can i make something like this work?
				{
					type: 'multidropdown',
					id: 'num',
					label: 'Groups',
					choices: this.groups,
					default: this.groups:id
				},*/
				{
					id: 'level',
					type: 'number',
					label: 'Master Intensity  (0-1)',
					default: 0,
					max: 1,
					min: 0,
				},
				{
					id: 'fade',
					type: 'number',
					label: 'Fade (seconds)',
					default: 0,
				},
			],
			callback: (event) => {
				// currently only master-intensity is supported
				// therefore the string is hard coded in here
				// in future API versions this might change and
				// a new input field needs to be added
				event = event.options
				const options = event
				this.controlGroup('master_intensity', options)
			},
		},
		controlScenes: {
			name: 'Control Scenes',
			options: [
				{
					id: 'action',
					type: 'dropdown',
					label: 'Action',
					choices: [
						{ id: 'start', label: 'Start' },
						{ id: 'release', label: 'Release' },
						{ id: 'toggle', label: 'Toggle' },
					],
					default: 'start',
				},
				{
					id: 'num',
					type: 'number',
					label: 'Scene Number',
					default: 0,
					step: 1,
					min: 0,
					required: true,
				},
				{
					id: 'fade',
					type: 'number',
					label: 'Fade (seconds)',
					default: 0,
					min: 0,
					required: false,
				}
			],
			callback: (event) => {
				event = event.options
				const action = event.action
				delete event.action
				const options = event
				this.controlScene(action, options)
			}
		}
	}
}
