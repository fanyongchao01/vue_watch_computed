let Watcher = function (vm, exp, cb) {
	this.vm = vm;
	this.cb = cb;
	this.exp = exp;
	this.value = this.get();
}

Watcher.prototype.init = function () {

}

Watcher.prototype.update = function () {
	this.run();
}

Watcher.prototype.run = function () {
	let value = this.vm[this.exp];
	let oldValue = this.value;
	if (value !== oldValue) {
		this.value = value;
		this.cb && this.cb.call(this.vm, this.value, oldValue);
		if (this.vm.watch && this.vm.watch[this.exp]) {
			this.vm.watch[this.exp].call(this.vm, value, oldValue);
		}
	}
}

Watcher.prototype.get = function () {
	// Dep.target = this;
	pushTarget(this)
	let value = this.vm.data[this.exp];
	popTarget();
	// Dep.target = null;
	return value;
}