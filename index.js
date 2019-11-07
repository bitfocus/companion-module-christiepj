var tcp = require('../../tcp');
var instance_skel = require('../../instance_skel');
var debug;
var log;

function pad2(num) {
	var s = "00" + num;
	return s.substr(s.length-2);
}

function pad3(num) {
	var s = "000" + num;
	return s.substr(s.length-3);
}

function pad4(num) {
	var s = "0000" + num;
	return s.substr(s.length-4);
}

function instance(system, id, config) {
	var self = this;

	// super-constructor
	instance_skel.apply(this, arguments);

	self.actions(); // export actions

	return self;
}

instance.prototype.updateConfig = function(config) {
	var self = this;

	self.config = config;
	self.init_tcp();
};

instance.prototype.init = function() {
	var self = this;

	debug = self.debug;
	log = self.log;

	self.status(1,'Connecting'); // status ok!

	self.init_tcp();
};


instance.prototype.init_tcp = function() {
	var self = this;

	if (self.socket !== undefined) {
		self.socket.destroy();
		delete self.socket;
	}

	if (self.config.host) {
		self.socket = new tcp(self.config.host, self.config.port);

		self.socket.on('status_change', function (status, message) {
			self.status(status, message);
		});

		self.socket.on('error', function (err) {
			debug("Network error", err);
			self.status(self.STATE_ERROR, err);
			self.log('error',"Network error: " + err.message);
		});

		self.socket.on('connect', function () {
			self.status(self.STATE_OK);
			debug("Connected");
		})

		self.socket.on('data', function (data) {});
	}
};


// Return config fields for web config
instance.prototype.config_fields = function () {
	var self = this;
	return [
		{
			type: 'text',
			id: 'info',
			width: 12,
			label: 'Information',
			value: 'This module controls Christie projectors,input selection will be added later since we need to fetch the input port information from the projector.'
		},
		{
			type: 'textinput',
			id: 'host',
			label: 'Target IP',
			width: 6,
			regex: self.REGEX_IP
		},
		{
			type: 'textinput',
			id: 'port',
			label: 'Target port (Default = 3002)',
			width: 6,
			default: '3002',
			regex: self.REGEX_PORT
		}
		/*
		TODO this will be used to limit / selct the options acording to the projector series in use, need to find a event to trigger the assignments
		{
			type: 'dropdown',
			label: 'projector type',
			id: 'pjtype',
			width: 6,
			choices: [
				{ label: 'Boxer series',              id: 'boxer' },
				{ label: 'M series',                     id: 'mseries' }
			]
		}
		*/
	]
};

// When module gets deleted
instance.prototype.destroy = function() {
	var self = this;

	if (self.socket !== undefined) {
		self.socket.destroy();
	}

	debug("destroy", self.id);;
};

instance.prototype.colorProfile = [
	{ label: 'Max Drives (Default)',	id: '0' },
	{ label: 'Color Temperature',     id: '1' },
	{ label: 'SD Video',							id: '2' },
	{ label: 'HD Video',							id: '3' },
	{ label: 'User 1',								id: '4' },
	{ label: 'User 2',								id: '5' },
	{ label: 'User 3',								id: '6' },
	{ label: 'User 4',								id: '7' },
];

instance.prototype.colorName = [
	{ label: 'Red',           id: '1' },
	{ label: 'Green',         id: '2' },
	{ label: 'Blue',          id: '3' },
	{ label: 'Yellow',        id: '4' },
	{ label: 'Cyan',          id: '5' },
	{ label: 'Magenta',       id: '6' },
	{ label: 'White',         id: '7' },
	{ label: 'Black',         id: '8' }
];

instance.prototype.colorSpace = [
	{ label: 'RGB',           id: '0' },
	{ label: 'YPbPr (SDTV)',  id: '1' },
	{ label: 'YPbPr (HDTV)',  id: '2' },
];

instance.prototype.errorEnable = [
	{ label: 'Off',           					id: '0' },
	{ label: 'On-Screen display',				id: '1' },
	{ label: 'ASCII message',						id: '2' },
	{ label: 'Both',  									id: '3' },
	{ label: 'All except error 1E & F',	id: '4' },
];

instance.prototype.inputFilter = [
	{ label: 'Off',						id: '0' },
	{ label: 'HDTV',					id: '1' },
	{ label: 'SDTV',					id: '2' },
	{ label: 'EDTV',  				id: '3' },
	{ label: 'Graphics/RGB',	id: '4' },
];

instance.prototype.imageOpti = [
	{ label: 'Best Image Quality',	id: '0' },
	{ label: 'Smooth Switching',		id: '1' },
	{ label: 'Seamless Switching',	id: '2' },
];

instance.prototype.tpatMser = [
	{ label: 'Off',                            id: '0' },
	{ label: 'Grid',                           id: '1' },
	{ label: 'Grey Scale 16',                  id: '2' },
	{ label: 'White',                          id: '3' },
	{ label: 'Flat Grey',                      id: '4' },
	{ label: 'Black',                          id: '5' },
	{ label: 'Checker',                        id: '6' },
	{ label: '13 Point',                       id: '7' },
	{ label: 'Color Bars',                     id: '8' },
	{ label: 'RGBW Gray Scale',                id: '9' },
	{ label: 'Multi Color',                    id: '10'},
	{ label: 'Edge Blend',                     id: '11'},
	{ label: 'Aspect Ratio',                   id: '12'},
	{ label: 'Red & Blue Ramp',                id: '13'},
	{ label: 'Calibration Line Ramp',          id: '14'},
	{ label: 'Calibration Black & White Grid', id: '15'},
	{ label: 'Calibration White & Red Grid',   id: '16'},
	{ label: 'Calibration White & Green Grid', id: '17'},
	{ label: 'Calibration White & Blue Grid',  id: '18'},
];

instance.prototype.tpatBoxer = [
	{ label: 'Off',              id: '0' },
	{ label: 'Grid',             id: '1' },
	{ label: 'Grey Scale 16',    id: '2' },
	{ label: 'Flat White',       id: '3' },
	{ label: 'Flat Grey',        id: '4' },
	{ label: 'Flat Black',       id: '5' },
	{ label: 'Checker',          id: '6' },
	{ label: '17 Point',         id: '7' },
	{ label: 'Edge Blend',       id: '8' },
	{ label: 'Color Bars',       id: '9' },
	{ label: 'Multi Color',      id: '10'},
	{ label: 'RGBW Ramp',        id: '11'},
	{ label: 'Horizontal Ramp',  id: '12'},
	{ label: 'Vertical Ramp',    id: '13'},
	{ label: 'Diagonal Ramp',    id: '14'},
	{ label: 'Square Grid',      id: '15'},
	{ label: 'Diagonal Grid',    id: '16'},
	{ label: 'Maximum Activity', id: '17'},
	{ label: 'Prism/Convergence',id: '18'},
	{ label: 'Boresight',        id: '21'},
	{ label: 'Convergence',      id: '22'},
	{ label: 'Integrator Rod',   id: '23'},
	{ label: 'Resolution Demo',  id: '25'}
];

instance.prototype.tpatMser = [
	{ label: 'Off',              id: '0' },
	{ label: 'Grid',             id: '1' },
	{ label: 'Grey Scale 16',    id: '2' },
	{ label: 'White',            id: '3' },
	{ label: 'Flat Grey',        id: '4' },
	{ label: 'Black',            id: '5' },
	{ label: 'Checker',          id: '6' },
	{ label: '13 Point',         id: '7' },
	{ label: 'Color Bars',       id: '8' },
	{ label: 'Aspect Ratio',     id: '11'},
	{ label: 'Edge Blend',       id: '12'},
	{ label: 'Boresight',        id: '14'}
];

instance.prototype.keypadEnableP1 = [
	{ label: 'Wired',			id: '0' },
	{ label: 'IR Front',	id: '1' },
	{ label: 'IR Back',		id: '2' },
];

instance.prototype.keypadEnableP2 = [
	{ label: 'Off',                       id: '0' },
	{ label: 'Responds to any protocol',	id: '1' },
	{ label: 'Protocol A',	              id: '10'},
	{ label: 'Protocol B',                id: '11'},
	{ label: 'Protocol C',    	          id: '12'},
	{ label: 'Protocol D',		            id: '13'},
	{ label: 'Protocol E',			          id: '14'},
	{ label: 'Protocol F',								id: '15'},
	{ label: 'Protocol G',								id: '16'},
];

instance.prototype.keyCode = [
	{ label: '0',								id: '0'  },
	{ label: '1',								id: '1'  },
	{ label: '2',								id: '2'  },
	{ label: '3',								id: '3'  },
	{ label: '4',								id: '4'  },
	{ label: '5',								id: '5'  },
	{ label: '6',								id: '6'  },
	{ label: '7',								id: '7'  },
	{ label: '8',								id: '8'  },
	{ label: '9',								id: '9'  },
	{ label: 'Shift',						id: '12' },
	{ label: 'Enter',						id: '13' },
	{ label: 'Func',						id: '14' },
	{ label: 'Proj',						id: '22' },
	{ label: 'Exit',						id: '27' },
	{ label: 'Cont',						id: '41' },
	{ label: 'Menu',						id: '44' },
	{ label: 'Power',						id: '46' },
	{ label: 'OSD',							id: '47' },
	{ label: 'Up (On)',					id: '58' },
	{ label: 'Down (Off)',			id: '59' },
	{ label: 'Left (-)',				id: '60' },
	{ label: 'Lamp',						id: '61' },
	{ label: 'Right (+)',				id: '62' },
	{ label: 'Help',						id: '63' },
	{ label: 'Input',						id: '64' },
	{ label: 'Input 1 / BNC',		id: '65' },
	{ label: 'Input 2 / DVI',		id: '66' },
	{ label: 'Input 3 / VID',		id: '67' },
	{ label: 'Input 4 / S-Vid',	id: '68' },
	{ label: 'Input 5 / Opt-1',	id: '69' },
	{ label: 'Input 6 / Opt-2',	id: '70' },
	{ label: 'Zoom IN',					id: '71' },
	{ label: 'Zoom Out',				id: '72' },
	{ label: 'Focus IN',				id: '73' },
	{ label: 'Focus Out',				id: '74' },
	{ label: 'Lens H Right',		id: '75' },
	{ label: 'Lens H Left',			id: '76' },
	{ label: 'Lens V Up',				id: '77' },
	{ label: 'Lens V Down',			id: '78' },
	{ label: 'Bright',					id: '80' },
	{ label: 'Channel',					id: '81' },
	{ label: 'Test',						id: '82' },
	{ label: 'Shutter',					id: '83' },
	{ label: 'PIP',							id: '84' },
	{ label: 'Gamma',						id: '85' },
	{ label: 'Auto',						id: '86' },
	{ label: 'Focus',						id: '87' },
	{ label: 'Zoom',						id: '88' },
	{ label: 'Swap',						id: '89' },
];

instance.prototype.lensCal = [
	{ label: 'Relative',				id: '0' },
	{ label: 'Manual',					id: '1' },
	{ label: 'Calibrate',				id: '2' },
];

instance.prototype.language = [
	{ label: 'English',    			id: '1' },
	{ label: 'French',     			id: '2' },
	{ label: 'Spanish',    			id: '3' },
	{ label: 'German',     			id: '4' },
	{ label: 'Italian',    			id: '5' },
];

instance.prototype.lampOp = [
	{ label: 'Lamp 1 only',			id: '1' },
	{ label: 'Lamp 2 only',			id: '2' },
	{ label: 'Both',						id: '3' },
];

instance.prototype.lampMode = [
	{ label: 'max brightness',							id: '0' },
	{ label: 'maintain intensity setting',	id: '1' },
	{ label: 'maintain power setting',			id: '2' },
];

instance.prototype.lampMode = [
	{ label: 'Auto',						id: '0' },
	{ label: 'Still',						id: '1' },
	{ label: 'Motion',					id: '2' },
	{ label: 'Film',						id: '3' },
];

instance.prototype.pipPreset = [
	{ label: 'Top Left',    		id: '0' },
	{ label: 'Top Right',     	id: '1' },
	{ label: 'Bottom Left',    	id: '2' },
	{ label: 'Bottom Right',    id: '3' },
	{ label: 'Custom',    			id: '4' },
];

instance.prototype.inputSelect = [
	{ label: 'BNC',    					id: '1' },
	{ label: 'DVI-I',     			id: '2' },
	{ label: 'Composite',    		id: '3' },
	{ label: 'S-Video',    			id: '4' },
	{ label: 'Option slot #1',  id: '5' },
	{ label: 'Option slot #2',  id: '6' },
	{ label: 'Option slot #3',  id: '7' },
	{ label: 'Option slot #4',  id: '8' },
];

instance.prototype.selectOri = [
	{ label: 'Front Projection',        	id: '0' },
	{ label: 'Rear Projection',    				id: '1' },
	{ label: 'Front Projection Inverted', id: '2' },
	{ label: 'Rear Projection Inverted',	id: '3' },
];

instance.prototype.videoStandard = [
	{ label: 'PAL',        			id: '0' },
	{ label: 'NTSC',    				id: '1' },
	{ label: 'SECAM', 					id: '2' },
	{ label: 'NTSC4.43',				id: '3' },
	{ label: 'PAL-M',        		id: '4' },
	{ label: 'PAL-NC',    			id: '5' },
	{ label: 'PAL-60', 					id: '6' },
	{ label: 'NTSC',						id: '7' },
	{ label: 'Auto-select',			id: '8' },
];

instance.prototype.size = [
	{ label: 'Default',        	id: '0' },
	{ label: 'No Resizing',    	id: '1' },
	{ label: 'Full Screen', 		id: '2' },
	{ label: 'Full Width',			id: '3' },
	{ label: 'Full Height',     id: '4' },
	{ label: 'Anamorphic',    	id: '5' },
	{ label: 'Custom resizing',	id: '6' },
];

instance.prototype.warpSelBasic = [
	{ label: 'Off',        			id: '0' },
	{ label: '2D Warp',    			id: '1' },
	{ label: 'User 1',     			id: '2' },
	{ label: 'User 2',     			id: '3' },
	{ label: 'User 3',     			id: '4' },
];

instance.prototype.warpSelMseries = [
	{ label: 'Off',                              id: '0' },
	{ label: 'Mseries 2D Warp, Boxer User 1',    id: '1' },
	{ label: 'Mseries User 1, Boxer User 2',     id: '2' },
	{ label: 'Mseries User 2, Boxer User 3',     id: '3' },
	{ label: 'Mseries User 3, Boxer User 4',     id: '4' },
	{ label: 'Mseries User 4',                   id: '5' },
	{ label: 'Mseries User 5',                   id: '6' },
	{ label: 'Mseries User 6',                   id: '7' },
	{ label: 'Mseries User 7',                   id: '8' },
	{ label: 'Mseries User 8',                   id: '9' },
	{ label: 'Mseries User 9',                   id: '10' },
	{ label: 'Mseries User 10, Boxer Keystone',  id: '11' },
	{ label: 'Mseries User 11',                  id: '12' },
	{ label: 'Mseries User 12',                  id: '13' },
	{ label: 'Mseries User 13',                  id: '14' },
	{ label: 'Mseries User 14',                  id: '15' },
	{ label: 'Mseries User 15',                  id: '16' },
	{ label: 'Mseries User 16',                  id: '17' }
];


instance.prototype.actions = function(system) {
	var self = this;

	self.system.emit('instance_actions', self.id, {
		'alc': {
			label: 'Automatic Lens Calibration On / Off',
			options: [
				{
					type: 'dropdown',
					label: 'On / Off',
					id: 'p1',
					default: '0',
					choices: [
						{ id: '0', label: 'Off' },
						{ id: '1', label: 'On' }
				 ]
				}
			]
		},
		'apw': {
			label: 'Auto Power Up On / Off',
			options: [
				{
					type: 'dropdown',
					label: 'On / Off',
					id: 'p1',
					default: '0',
					choices: [
						{ id: '0', label: 'Off' },
						{ id: '1', label: 'On' }
				 ]
				}
			]
		},
		'aro': {
			label: 'Aspect Ratio Overlay / Off',
			options: [
				{
					type: 'dropdown',
					label: 'On / Off',
					id: 'p1',
					default: '0',
					choices: [
						{ id: '0', label: 'Off' },
						{ id: '1', label: 'On' }
				 ]
				}
			]
		},
		'asr': {
			label: 'Auto Source On / Off',
			options: [
				{
					type: 'number',
					id: 'p1',
					label: 'Source Setup (1-50)',
					min: 1,
					max: 50,
					default: 1,
					required: true,
					range: false,
					regex: self.REGEX_NUMBER
				},
				{
					type: 'dropdown',
					label: 'On / Off',
					id: 'p2',
					default: '0',
					choices: [
						{ id: '0', label: 'Off' },
						{ id: '1', label: 'On' }
				 ]
				}
			]
		},
		'asu':  {
			label: 'Auto Setup' 
		},
		'brt': {
			label: 'Brightness',
			options: [
				{
					type: 'number',
					id: 'p1',
					label: 'Brightness (0-1000 = 0%-100%, 505 = 50.5%)',
					min: 0,
					max: 1000,
					default: 1,
					required: true,
					range: false,
					regex: self.REGEX_NUMBER
				},
			]
		},
		'ccs':  {
			label: 'Select Output Color',
			options: [
				{
					type: 'dropdown',
					label: 'Select Color Profile',
					id: 'p1',
					default: '0',
					choices: self.colorProfile
				}
			]
		},
		'cha': {
			label: 'Channel Select',
			options: [
				{
					type: 'number',
					id: 'p1',
					label: 'Channel Number (1-50)',
					min: 1,
					max: 50,
					default: 1,
					required: true,
					range: false,
					regex: self.REGEX_NUMBER
				},
			]
		},
		'cle':  {
			label: 'Color Enable',
			options: [
				{
					type: 'dropdown',
					label: 'Select Color',
					id: 'p1',
					default: '8',
					choices: self.colorName
				}
			]
		},
		'clr': {
			label: 'Color Intensity',
			options: [
				{
					type: 'number',
					id: 'p1',
					label: 'Intensity (0-1000 = 0%-100%, 505 = 50.5%)',
					min: 0,
					max: 1000,
					default: 1,
					required: true,
					range: false,
					regex: self.REGEX_NUMBER
				},
			]
		},
		'con': {
			label: 'Contrast',
			options: [
				{
					type: 'number',
					id: 'p1',
					label: 'Contrast (0-1000 = 0%-100%, 505 = 50.5%)',
					min: 0,
					max: 1000,
					default: 1,
					required: true,
					range: false,
					regex: self.REGEX_NUMBER
				},
			]
		},
		'csp':  {
			label: 'Color Space',
			options: [
				{
					type: 'dropdown',
					label: 'Select Color Space',
					id: 'p1',
					default: '0',
					choices: self.colorSpace
				}
			]
		},
		'def': {
			label: 'Factory Defaults',
			options: [
				{
					type: 'dropdown',
					label: 'Are you sure?',
					id: 'p1',
					default: '',
					choices: [
						{ id: '', label: 'No' },
						{ id: '111', label: 'Yes' }
				 ]
				}
			]
		},
		'eme':  {
			label: 'Error Message Enable',
			options: [
				{
					type: 'dropdown',
					label: 'Select an Option',
					id: 'p1',
					default: '3',
					choices: self.errorEnable
				}
			]
		},
		'fcs': {
			label: 'Focus (Fixed)',
			options: [
				{
					type: 'number',
					id: 'p1',
					label: 'Focus Set (0-9999)',
					min: 0,
					max: 9999,
					default: 4000,
					required: true,
					range: false,
					regex: self.REGEX_NUMBER
				},
			]
		},
		'fil':  {
			label: 'Input Filter',
			options: [
				{
					type: 'dropdown',
					label: 'Select Filter Type',
					id: 'p1',
					default: '0',
					choices: self.inputFilter
				}
			]
		},
		'frz': {
			label: 'Freeze On / Off',
			options: [
				{
					type: 'dropdown',
					label: 'On / Off',
					id: 'p1',
					default: '0',
					choices: [
						{ id: '0', label: 'Off' },
						{ id: '1', label: 'On' }
				 ]
				}
			]
		},
		'gam': {
			label: 'Gamma',
			options: [
				{
					type: 'number',
					id: 'p1',
					label: 'Gamma Set (100-280)',
					min: 100,
					max: 280,
					default: 220,
					required: true,
					range: false,
					regex: self.REGEX_NUMBER
				},
			]
		},
		'hor': {
			label: 'Horizontal Position',
			options: [
				{
					type: 'number',
					id: 'p1',
					label: 'Horizontal Position',
					min: 0,
					max: 9999,
					default: 500,
					required: true,
					range: false,
					regex: self.REGEX_NUMBER
				},
			]
		},
		'ils': {
			label: 'Intelligent Lens System On/Off',
			options: [
				{
					type: 'dropdown',
					label: 'On / Off',
					id: 'p1',
					default: '1',
					choices: [
						{ id: '0', label: 'Off' },
						{ id: '1', label: 'On' }
					]
				}
			]
		},
		'iop':  {
			label: 'Image Optimization',
			options: [
				{
					type: 'dropdown',
					label: 'Select an Option',
					id: 'p1',
					default: '1',
					choices: self.imageOpti
				}
			]
		},
		'itpBasic': {
			label: 'Internal testpattern Basic collection (general use)',
			options: [
				{
					type: 'text',
					id: 'info',
					width: 12,
					label: 'Information',
					value: 'These options might change between models'
				},
				{
					type: 'dropdown',
					label: 'Select Testpattern',
					id: 'p1',
					default: '1',
					choices: self.tpatBoxer
				}
			]
		},
		'itpBoxer': {
			label: 'Internal testpattern Boxer series',
			options: [
				{
					type: 'text',
					id: 'info',
					width: 12,
					label: 'Information',
					value: 'These options might change between models'
				},
				{
					type: 'dropdown',
					label: 'Select Testpattern',
					id: 'p1',
					default: '1',
					choices: self.tpatBoxer
				}
			]
		},
		'itpMser': {
			label: 'Internal testpattern M series',
			options: [
				{
					type: 'text',
					id: 'info',
					width: 12,
					label: 'Information',
					value: 'These options might change between models'
				},
				{
					type: 'dropdown',
					label: 'Select Testpattern',
					id: 'p1',
					default: '1',
					choices: self.tpatMser
				}
			]
		},
		'ken':  {
			label: 'Keypad Enable',
			options: [
				{
					type: 'dropdown',
					label: 'Select type',
					id: 'p1',
					default: '0',
					choices: self.keypadEnableP1
				},
				{
					type: 'dropdown',
					label: 'Protocol',
					id: 'p2',
					default: '0',
					choices: self.keypadEnableP2
				}
			]
		},		
		'key':  {
			label: 'Key Code / Key Press',
			options: [
				{
					type: 'dropdown',
					label: 'Select Key',
					id: 'p1',
					default: '0',
					choices: self.keyCode
				}
			]
		},	
		'lcb':  {
			label: 'Lens Calibrate',
			options: [
				{
					type: 'dropdown',
					label: 'Select type',
					id: 'p1',
					default: '0',
					choices: self.lensCal
				}
			]
		},
		'lcn':  {
			label: 'Lens Center' 
		},
		'lco': {
			label: 'Lamp Conditioning On/Off',
			options: [
				{
					type: 'dropdown',
					label: 'On / Off',
					id: 'p1',
					default: '1',
					choices: [
						{ id: '0', label: 'Off' },
						{ id: '1', label: 'On' }
					]
				}
			]
		},
		'lng':  {
			label: 'Language',
			options: [
				{
					type: 'dropdown',
					label: 'Select Language',
					id: 'p1',
					default: '1',
					choices: self.language
				}
			]
		},
		'lop':  {
			label: 'Lamp Operation',
			options: [
				{
					type: 'dropdown',
					label: 'Select Mode',
					id: 'p1',
					default: '3',
					choices: self.lampOp
				}
			]
		},
		'lpc':  {
			label: 'Lamp Changed',
			options: [
				{
					type: 'textinput',
					label: 'Serial nr: (Max 8 Charactors)',
					id: 'p1',
					default: '',
					required: true,
					regex: '/^.{1,8}$/' // limit to min 1 and max 8 charactors
				}
			]
		},
		'lpi':  {
			label: 'Lamp Intensity',
			options: [
				{
					type: 'number',
					id: 'p1',
					label: 'Setpoint (0-9999)',
					min: 0,
					max: 9999,
					default: 100,
					required: true,
					range: false,
					regex: self.REGEX_NUMBER
				},
			]
		},
		'lpm':  {
			label: 'Lamp Mode',
			options: [
				{
					type: 'dropdown',
					label: 'Select Mode',
					id: 'p1',
					default: '0',
					choices: self.lampMode
				}
			]
		},
		'mot':  {
			label: 'Motion Filter',
			options: [
				{
					type: 'dropdown',
					label: 'Select Filter',
					id: 'p1',
					default: '0',
					choices: self.motionFilter
				}
			]
		},
		'osd': {
			label: 'On Screen Display On/Off',
			options: [
				{
					type: 'dropdown',
					label: 'On / Off',
					id: 'p1',
					default: '1',
					choices: [
						{ id: '0', label: 'Off' },
						{ id: '1', label: 'On' }
					]
				}
			]
		},
		'pip': {
			label: 'Picture In Picture On/Off',
			options: [
				{
					type: 'dropdown',
					label: 'On / Off',
					id: 'p1',
					default: '1',
					choices: [
						{ id: '0', label: 'Off' },
						{ id: '1', label: 'On' }
					]
				}
			]
		},
		'ppp':  {
			label: 'PIP Position Preset',
			options: [
				{
					type: 'dropdown',
					label: 'Select Preset',
					id: 'p1',
					default: '0',
					choices: self.pipPreset
				}
			]
		},
		'pps': {
			label: 'Picture In Picture Swap'
		},
		'pwr': {
			label: 'Power On/Off',
			options: [
				{
					type: 'dropdown',
					label: 'On / Off',
					id: 'p1',
					default: '1',
					choices: [
						{ id: '0', label: 'Off' },
						{ id: '1', label: 'On' }
					]
				}
			]
		},
		'sde': {
			label: 'Source Dialog Enable',
			options: [
				{
					type: 'dropdown',
					label: 'Show / Hide',
					id: 'p1',
					default: '1',
					choices: [
						{ id: '0', label: 'Hide' },
						{ id: '1', label: 'Show' }
				 ]
				}
			]
		},
			'shu': {
			label: 'Shutter Open / Close',
			options: [
				{
					type: 'dropdown',
					label: 'Open / Close',
					id: 'p1',
					default: '0',
					choices: [
						{ id: '0', label: 'Open' },
						{ id: '1', label: 'Close' }
					]
				}
			]
		},
		'sin':  {
			label: 'Select Input',
			options: [
				{
					type: 'dropdown',
					label: 'Input:',
					id: 'p1',
					default: '1',
					choices: self.inputSelect
				}
			]
		},
		'sor':  {
			label: 'Select Orientation',
			options: [
				{
					type: 'dropdown',
					label: 'Orientation:',
					id: 'p1',
					default: '0',
					choices: self.selectOri
				}
			]
		},
		'std':  {
			label: 'Video Standard',
			options: [
				{
					type: 'dropdown',
					label: 'Video Standard',
					id: 'p1',
					default: '8',
					choices: self.videoStandard
				}
			]
		},
		'szp':  {
			label: 'Size Presets Position',
			options: [
				{
					type: 'dropdown',
					label: 'Size',
					id: 'p1',
					default: '0',
					choices: self.size
				}
			]
		},
		'tnt': {
			label: 'Tint',
			options: [
				{
					type: 'number',
					id: 'p1',
					label: 'Tint (0-1000 = 0%-100%, 505 = 50.5%)',
					min: 0,
					max: 1000,
					default: 1,
					required: true,
					range: false,
					regex: self.REGEX_NUMBER
				},
			]
		},
		'vrt': {
			label: 'Vertical Position',
			options: [
				{
					type: 'number',
					id: 'p1',
					label: 'Vertical Position',
					min: 0,
					max: 9999,
					default: 500,
					required: true,
					range: false,
					regex: self.REGEX_NUMBER
				},
			]
		},
		'wps':  {
			label: 'Geometry Correction (General)',
			options: [
				{
					type: 'dropdown',
					label: 'Warp Select',
					id: 'p1',
					default: '0',
					choices: self.warpSelBasic
				}
			]
		},
		'wrp':  {
			label: 'Geometry Correction (Mseries & Boxer)',
			options: [
				{
					type: 'dropdown',
					label: 'Warp Select',
					id: 'p1',
					default: '0',
					choices: self.warpSelMseries
				}
			]
		},
		'zom':  {
			label: 'Zoom (Fixed)',
			options: [
				{
					type: 'number',
					id: 'p1',
					label: 'Zoom Set (0-9999)',
					min: 0,
					max: 9999,
					default: 5000,
					required: true,
					range: false,
					regex: self.REGEX_NUMBER
				},
			]
		},

	});
};

instance.prototype.action = function(action) {
	var self = this;
	var opt = action.options
	var cmd

	switch (action.action) {
		case 'alc':
			cmd = '(ALC ' + opt.p1 + ')';
			break;

		case 'apw':
			cmd = '(APW ' + opt.p1 + ')';
			break;
			
		case 'aro':
			cmd = '(ARO ' + opt.p1 + ')';
			break;

		case 'asr':
			cmd = '(ASR ' + pad2(opt.p1) + ' ' + opt.p2 + ')';
			break;

		case 'asu':
			cmd = '(ASU)';
			break;

		case 'brt':
			cmd = '(BRT ' + pad4(opt.p1) + ')';
			break;

		case 'ccs':
			cmd = '(CCS ' + opt.p1 + ')';
			break;

		case 'cha':
			cmd = '(CHA ' + pad2(opt.p1) + ')';
			break;
	
		case 'cle':
			cmd = '(CLE ' + opt.p1 + ')';
			break;

		case 'clr':
			cmd = '(CLR ' + pad4(opt.p1) + ')';
			break;
	
		case 'con':
			cmd = '(CON ' + pad4(opt.p1) + ')';
			break;

		case 'csp':
			cmd = '(CSP ' + opt.p1 + ')';
			break;

		case 'def':
			cmd = '(DEF ' + opt.p1 + ')';
			break;
	
		case 'eme':
			cmd = '(EME ' + opt.p1 + ')';
			break;

		case 'fcs':
			cmd = '(FCS ' + pad4(opt.p1) + ')';
			break;

		case 'fil':
			cmd = '(FIL ' + opt.p1 + ')';
			break;
	
		case 'frz':
			cmd = '(FRZ ' + opt.p1 + ')';
			break;

		case 'gam':
			cmd = '(GAM ' + opt.p1 +')';
			break;

		case 'hor':
			cmd = '(HOR' + opt.p1 + ')';
			break;

		case 'ils':
			cmd = '(ILS ' + opt.p1 +')';
			break;

		case 'iop':
			cmd = '(IOP ' + opt.p1 +')';
			break;

		case 'itpBasic':
			cmd = '(ITP ' + opt.p1 + ')';
			break;
	
		case 'itpBoxer':
			cmd = '(ITP ' + opt.p1 + ')';
			break;

		case 'itpMser':
			cmd = '(ITP ' + opt.p1 + ')';
			break;

		case 'ken':
			cmd = '(KEN ' + opt.p1 + ' ' + opt.p2 + ')';
			break;

		case 'key':
			cmd = '(KEY ' + opt.p1 + ')(KEY ' + (Number(opt.p1) + 128) + ')';
			break;

		case 'lcb':
			cmd = '(LCB ' + opt.p1 + ')';
			break;
	
		case 'lcn':
			cmd = '(LCN)';
			break;

		case 'lco':
			cmd = '(LCO ' + opt.p1 + ')';
			break;
	
		case 'lng':
			cmd = '(LNG ' + opt.p1 + ')';
			break;

		case 'lop':
			cmd = '(LOP ' + opt.p1 + ')';
			break;

		case 'lpc':
			cmd = '(LPC ' + opt.p1 + ')';
			break;

		case 'lpi':
			cmd = '(LPI ' + pad4(opt.p1) +')';
			break;

		case 'lpm':
			cmd = '(LPM ' + opt.p1 + ')';
			break;

		case 'mot':
			cmd = '(MOT ' + opt.p1 + ')';
			break;

		case 'osd':
			cmd = '(OSD ' + opt.p1 + ')';
			break;

		case 'pip':
			cmd = '(PIP ' + opt.p1 + ')';
			break;

		case 'ppp':
			cmd = '(PPP ' + opt.p1 + ')';
			break;

		case 'pps':
			cmd = '(PPS)';
			break;
		
		case 'pwr':
			cmd = '(PWR ' + opt.p1 + ')';
			break;
		
		case 'sde':
			cmd = '(SDE ' + opt.p1 +')';
			break;

		case 'shu':
			cmd = '(SHU ' + pad3(opt.p1) +')';
			break;

		case 'sin':
			cmd = '(SIN ' + opt.p1 +')';
			break;

		case 'sor':
			cmd = '(SOR ' + opt.p1 +')';
			break;
		
		case 'std':
			cmd = '(STD ' + opt.p1 +')';
			break;
		
		case 'szp':
			cmd = '(SZP ' + opt.p1 +')';
			break;
		
		case 'tnt':
			cmd = '(TNT ' + opt.p1 +')';
			break;
		
		case 'vrt':
			cmd = '(VRT ' + opt.p1 +')';
			break;
		
		case 'wps':
			cmd = '(WPS ' + opt.p1 + ')';
			break;
		
		case 'wrp':
			cmd = '(WRP+SLCT ' + opt.p1 + ')';
			break;

		case 'zom':
			cmd = '(ZOM ' + pad4(opt.p1) + ')';
			break;
	
		//TODO make input select need to fetch the available input configurations from the projector


	};




	if (cmd !== undefined) {

		debug('sending ',cmd,"to",self.config.host);

		if (self.socket !== undefined && self.socket.connected) {
			self.socket.send(cmd);
		}
		else {
			debug('Socket not connected :(');
		}

	}

	// debug('action():', action);

};

instance_skel.extendedBy(instance);
exports = module.exports = instance;
