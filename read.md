# vue双向绑定实现原理

## 目录说明

	index.html 	入口文本

	index.js 	入口脚本

	Compile		AST/虚拟DOM入口

	Watcher		订阅者

	Observe		监听者

	Dep 		收集者

## 实现目标

	1、实现基本数据双向绑定		-- 已完成

	2、实现watcher方法注入		-- 已完成

	3、实现computed方法			-- 已完成