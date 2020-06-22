let Compile = function (el, vm) {
	this.vm = vm;
	this.el = el;
	if (typeof el === 'string') {
		this.el = document.querySelector(el);
	}
	this.fragment = null;
	this.init();
}

Compile.prototype.init = function () {
	if (this.el) {
		this.fragment = this.nodeToFragment();
		this.createElement(this.fragment);
		this.el.append(this.fragment);
	} else {
		new Error('can not found el');
	}
}

Compile.prototype.nodeToFragment = function () {
	let sp = document.createDocumentFragment();
	let childNode = this.el.firstChild;
	while (childNode) {
		sp.appendChild(childNode);		/* 会将原本的节点删除掉，所以这里才不会死循环，将树形节点扁平化 */
		childNode = this.el.firstChild;
	}
	return sp;
}

Compile.prototype.createElement = function (el) {
	let childNodes = el.childNodes;
	[].slice.call(childNodes).forEach(node => {
		var reg = /\{\{(.*)\}\}/;
		var text = node.textContent;
		/* 通过节点类型处理 */
		if (this.isElementNode(node)) {
			this.compile(node);
		} else if (this.isTextNode(node) && reg.test(text)) {
			this.compileText(node, reg.exec(text)[1])
		}

		if (node.childNodes && node.childNodes.length) {
			this.createElement(node);
		}
	})
}

Compile.prototype.compile = function (node) {
	let nodeAttrs = node.attributes;
	let self = this;
	Array.prototype.forEach.call(nodeAttrs, function (attr) {
		// exp: {name: 'class', value: 'className'}
		let attrName = attr.name;
		if (self.isDirective(attrName)) {
			let value = attr.value;
			let dir = attrName.substring(2);
			if (self.isEventDirective(dir)) {
				self.compileEvent(self.vm, node, value, dir);
			} else {
				self.compileModel(self.vm, node, value, dir);
			}
			node.removeAttribute(attrName);
		}
	})
}

Compile.prototype.compileEvent = function (vm, node, value, dir) {
	var eventType = dir.split(':')[1];
	var cb = vm.methods && vm.methods[value];
	if (eventType && cb) {
		node.addEventListener(eventType, cb.bind(vm), false);
	}
}

Compile.prototype.compileModel = function (vm, node, value, dir) {
	var oldValue = vm[value];
	var self = this;
	this.updateModel(node, oldValue);

	new Watcher(vm, value, function (value) {
		self.updateModel(node, value);
	})

	node.addEventListener('input', function (e) {
		var val = e.target.value;
		if (val ===  oldValue) {
			return;
		}
		vm[value] = val;
		self.updateModel(node, val);
	})
}

Compile.prototype.updateModel = function (node, value) {
	node.value = typeof value === 'undefined' ? '' : value;
}

Compile.prototype.compileText = function (node, dir) {
	var value = this.vm[dir];
	this.updateText(node, value);
	if (this.vm.computed.hasOwnProperty(dir)) {
		this.vm._computedWatchers[dir]['cb'] = (val) => {
			this.updateText(node, val);
		}
	} else {
		new Watcher(this.vm, dir, val => {
			this.updateText(node, val);
		})
	}
}

Compile.prototype.updateText = function (node, value) {
	node.textContent = typeof value === 'undefined' ? '' : value;
}

Compile.prototype.isEventDirective = function (attrName) {
	return attrName.indexOf(':on') !== -1;
}

Compile.prototype.isDirective = function (attrName) {
	return attrName.indexOf('v-') !== -1;
}

Compile.prototype.isElementNode = function (node) {
	return node.nodeType === 1;
}

Compile.prototype.isTextNode = function (node) {
	return node.nodeType === 3;
}