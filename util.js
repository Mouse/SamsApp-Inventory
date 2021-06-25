module.exports = {
	getTimeString: function () {
		const now = new Date();
		return (
			now.getFullYear() +
			'-' +
			('0' + (now.getMonth() + 1)).slice(-2) +
			'-' +
			('0' + (now.getDay() + 1)).slice(-1) +
			'-' +
			now.getTime()
		);
	},
	groupBy: function(xs, key) {
		return xs.reduce(function(rv, x) {
		  (rv[x[key]] = rv[x[key]] || []).push(x);
		  return rv;
		}, {});
	  }
};
