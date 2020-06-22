let Dep = function () {
	this.sub = [];
}

Dep.prototype.addSub = function (sub) {
	this.sub.push(sub);
}

Dep.prototype.notify = function () {
	this.sub.forEach(item => {
		item.update && item.update();
	})
}

Dep.prototype.depend = function () {
	if (Dep.target) {
		Dep.target.addDep(this);
	}
}

Dep.prototype.removeSub = function () {

}

Dep.target = null;
var targetStack = [];

function pushTarget(_target) {    
    targetStack.push(_target);
    Dep.target = _target;
}

function popTarget() {
    targetStack.pop();
    Dep.target = targetStack[targetStack.length - 1]
    // Dep.target = target;
}