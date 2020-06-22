let ComputedWatcher = function (vm, getter, option) {
	this.lazy = option.lazy;
	this.dirty = this.lazy;  
	this.vm = vm;
	this.getter = getter;
	this.value = this.lazy ? undefined: this.get();
	this.deps = [];
	this.newDeps = [];
}

ComputedWatcher.prototype.get = function () {
	pushTarget(this);
	var value = this.getter.call(this.vm, this.vm);
	popTarget();
	this.deps = this.newDeps;
	this.newDeps = [];
	return value;
}

ComputedWatcher.prototype.evaluate = function () {
	this.value = this.get();
	this.dirty = false;
}

ComputedWatcher.prototype.update = function () {
	// console.log('update');
	let newVal = this.get();
	let oldVal = this.value;
	if (newVal !== oldVal) {
		this.value = newVal;
		this.cb && this.cb.call(this.vm, this.value, oldVal);
	}
	if (this.lazy) {
		this.dirty = true
	} else {
		console.log('update');
	}
}

ComputedWatcher.prototype.depend = function (dep) {
	var i = this.deps.length;
	while (i--) {
		dep.depend()
	}
}

ComputedWatcher.prototype.addDep = function (dep) {
	this.newDeps.push(dep);
	dep.addDep(this);
}