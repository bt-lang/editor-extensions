const { spawn } = require('child_process');
const hx = require("hbuilderx");
const path = require('path');
const fs = require('fs');
const os = require('os');
//该方法将在插件激活的时候调用
function activate(context) {
	let outputChannel = hx.window.createOutputChannel("BT");
	let disposable = hx.commands.registerCommand('extension.runBT', () => {
		outputChannel.show();
		
		// 获取当前工作区的第一个文件夹的路径
		const workspaceFolders = hx.workspace.workspaceFolders;
		if (!workspaceFolders) {
			hx.window.showErrorMessage('没有打开任何工作区文件夹。');
			return;
		}

		const workspacePath = workspaceFolders[0].uri.fsPath;
		const isWindows = os.platform() === 'win32'; // 检查是否为 Windows 系统
		const exeName = isWindows ? 'bt.exe' : 'bt'; // 根据系统选择文件名
		const exePathInWorkspace = path.join(workspacePath, exeName); // 工作区中的 bt.exe 路径

		let exePath;
		// 检查工作区中是否存在 bt.exe
		if (fs.existsSync(exePathInWorkspace)) {
			exePath = exePathInWorkspace; // 使用工作区中的 bt.exe
		} else {
			hx.window.showErrorMessage(lang.compilerNotExist);
			return;
		}

		// 创建一个子进程来执行 .exe 文件  
		const child = spawn(exePath, [/* 可选的命令行参数数组 */], {  
		  // 可以设置环境变量、工作目录等选项  
		  env: process.env,  
		  cwd: workspacePath,  
		  stdio: ['ignore', 'pipe', 'pipe'] // 忽略输入，捕获标准输出和标准错误  
		});  
		  
		// 监听标准输出数据  
		child.stdout.on('data', (data) => {
		  outputChannel.appendLine(`\n${data.toString()}`);
		});  
				
	});
	//订阅销毁钩子，插件禁用的时候，自动注销该command。
	context.subscriptions.push(disposable);
}
//该方法将在插件禁用的时候调用（目前是在插件卸载的时候触发）
function deactivate() {

}
module.exports = {
	activate,
	deactivate
}