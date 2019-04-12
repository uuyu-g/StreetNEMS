const nem = require()



const degSetting = {
	in_start: 0,
	in_end: 255,
	out_start: -45,
	out_end: 45
};

const widthSetting = {
	in_start: 0,
	in_end: 255,
	out_start: 0,
	out_end: 800
};

const hexToLimitedRange = (input, obj) => {
	const slope = (obj.out_end - obj.out_start) / (obj.in_end - obj.in_start);
	return obj.out_start + slope * (input - obj.in_start);
};

const foo = "";

const app = new Vue({
	el: '#app',
	data: {
		list: [{
				message: 'NEM',
				tx: 'bfcdc535283c21dd9b480d1a9a66ee2adc691edef271daa50569c7c9feea72a8',
				amount: 1
			},
			{
				message: 'FUDFUDFUD',
				tx: '7ba3a7328c7ea9616fe1758c5f4f7d1a333d26fb2bc1d42e0862762a42b38430'
			},
			{
				message: 'PUMP!!!!',
				tx: 'c3cec3c3c1fffea00e4bd06dcdb1c3e5b93b73465eb6276a5cd0f89511611557'
			},
			{
				message: 'SnemS!!',
				tx: '0000ff000'
			}
		]
	},
	methods: {
		position(val) {
			const tx = val.tx;
			const x = parseInt(tx.substr(1, 2), 16); //
			const y = parseInt(tx.substr(3, 2), 16);
			const r = parseInt(tx.substr(5, 2), 16);
			const top = hexToLimitedRange(x, widthSetting);
			const left = hexToLimitedRange(y, widthSetting);
			const deg = hexToLimitedRange(r, degSetting);
			return {
				top: top + 'px',
				left: left + 'px',
				transform: 'rotate(' + deg + 'deg)'
			};
		},
		style(val) {
			
		}
	}
});