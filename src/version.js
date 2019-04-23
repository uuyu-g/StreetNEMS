const changeDays = [
	'2017/4/1',
	'2018/4/1',
	'2019/4/1',
	'2020/4/1'
];

function toDate(str) {
  var arr = str.split("/");
  return new Date(arr[0], arr[1] - 1, arr[2]);
}

function version(date) {
	const len = changeDays.length;
	let i = 0;
	while (i < len) {
		if (date < toDate(changeDays[i]).getTime()) {
			return `ver${i + 1}`
		}
		i++;
	}
	return `ver${len+1}`
}

const date2016 = new Date(2016, 4,2);
const date2017 = new Date(2017, 4,2);
const date2018 = new Date(2018, 4,2);
const date2030 = new Date(2030, 4,2);
console.log(version(date2016));// => ver1
console.log(version(date2017));// => ver2
console.log(version(date2018));// => ver3
console.log(version(date2030));// => ver5

