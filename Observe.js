/**
 * 监听者，将data中数据绑定defineProperty
 * [Observer description]
 */
let Observer = function (data) {
	this.data = data;
	this.init();
}

Observer.prototype.init = function () {
	Object.keys(this.data).forEach(key =>  {
		this.defineReactive(key, this.data[key]);
	})
}

Observer.prototype.defineReactive = function (key, value) {
	let self = this;
	Observer.install(value);
	let dep = new Dep();
	Object.defineProperty(this.data, key, {
		configurable: true,
		enumerable: true,
		get () {
			if (Dep.target) {
				dep.addSub(Dep.target)
			}
			return value;
		},
		set (newVal) {
			if (newVal === value) {
				return;
			}
			value = newVal;
			dep.notify();
		}
	})
}

Observer.install = function (data) {
	if (!data || typeof data !== 'object') {
		return;
	}
	return new Observer(...arguments);
}

