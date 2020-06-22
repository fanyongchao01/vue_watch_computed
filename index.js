let Vue = function (opts = {}) {
	if (typeof opts.data === 'function') {
		this.data = opts.data() || {};
	} else {
		this.data = opts.data || {};
	}
	this.methods = opts.methods || {};
	this.watch = opts.watch || {};
	this.computed = opts.computed || {};
	this.el = opts.el;
	/* 生命周期管理 */
	/* created */
	opts.created && opts.created.call(this);
	this.init();
	/* mounted */
	opts.mounted && opts.mounted.call(this);
}

Vue.prototype.init = function () {
	Object.keys(this.data).forEach(key => {
		this.proXyKeys(key);
	})
	Observer.install(this.data);
	this.initComputed();

	new Compile(this.el, this);
}

Vue.prototype.initComputed = function () {
	// Object.keys(this.computed).forEach(key => {
	// 	this.proXyKeysComputed(key);
	// })
	if (Object.keys(this.computed).length) {
		this._computedWatchers = Object.create(null);
		Object.keys(this.computed).forEach(key => {
			var computedUser = typeof this.computed[key] === 'function' ? this.computed[key] : this.computed[key].get;
			this._computedWatchers[key] = new ComputedWatcher(this, computedUser, {lazy: true});
			if (!(key in this)) {
				this.defineComputed(key, computedUser);
			}
		})
	}
}

Vue.prototype.defineComputed = function (key, userDef) {
	var set = function(){};
	if (userDef.set) set = userDef.set;
	Object.defineProperty(this, key, {
		set: set,
		get: this.createComputedGetter(key),
		enumerable: true,
  		configurable: true,
	})
}

Vue.prototype.createComputedGetter = function (key) {
	return function () {
		var watcher = this._computedWatchers[key];
		if (watcher.dirty) {
			watcher.evaluate();
		}
		if (Dep.target) {
			watcher.depend();
		}
		return watcher.value;
	}
}

/**
 * [proXyKeys description] 将data中的属性绑定到this上
 * @return {[type]} [description]
 */
Vue.prototype.proXyKeys = function (key) {
	var self = this;
	Object.defineProperty(this, key, {
		enumerable: true,		/* 是否可枚举 Object.keys() */
		configurable: true,		/* 不可修改，不可删除 */
		set (value) {
			self.data[key] = value;
		},
		get () {
			return self.data[key];
		}
	})
}

// Vue.prototype.proXyKeysComputed = function (key) {
// 	var self = this;
// 	Object.defineProperty(this, key, {
// 		enumerable: true,		/* 是否可枚举 Object.keys() */
// 		configurable: true,		/* 不可修改，不可删除 */
// 		get () {
// 			return self[key];
// 		}
// 	})
// }