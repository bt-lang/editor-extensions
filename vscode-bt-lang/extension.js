// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const { execFile } = require('child_process');
const path = require('path');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "bt-lang" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	const highlight = vscode.commands.registerCommand('bt-lang.highlight', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		// 显示重启提示
		vscode.window.showInformationMessage(
			'The extension has been successfully installed, you need to restart VS Code to apply the changes.',
			{ modal: true }, // modal 为 true 会让对话框成为模态的，阻止其他操作
			'Restart' // 添加按钮
		).then(selection => {
			if (selection === 'Restart') {
				// 触发重启 VS Code
				vscode.commands.executeCommand('workbench.action.reloadWindow');
			}
		});
	});
	context.subscriptions.push(highlight);
	let terminal; // 用于存储终端实例的变量（尽管在这个例子中我们每次都创建新的）

	const run = vscode.commands.registerCommand('extension.runBTScript', () => {  
		vscode.window.showInformationMessage(
			'The extension has been successfully installed, you need to restart VS Code to apply the changes.',
			{ modal: true }, // modal 为 true 会让对话框成为模态的，阻止其他操作
			'Restart' // 添加按钮
		).then(selection => {
			if (selection === 'Restart') {
				// 触发重启 VS Code
				vscode.commands.executeCommand('workbench.action.reloadWindow');
			}
		});

        // 获取当前工作区的第一个文件夹的路径  
        const workspaceFolders = vscode.workspace.workspaceFolders;  
        if (!workspaceFolders) {  
            vscode.window.showErrorMessage("No workspace folder is open.");  
            return;  
        }
  
        const workspacePath = workspaceFolders[0].uri.fsPath; // 获取第一个工作区的路径  
        const exePath = path.join(workspacePath, 'bt.exe'); // 构建编译器的路径  

		// vscode.window.showInformationMessage(`Output: ${exePath}`); 


        // 检查是否已经有一个终端实例存在  
        if (!terminal) {
            // 如果没有，则创建一个新的终端实例  
            terminal = vscode.window.createTerminal('BT Script Terminal');  
            // 可以选择显示终端（通常默认是显示的）  
            terminal.show();  
        } else {  
            // 如果已经存在，则清除终端中的任何先前内容  
            terminal.clear();  
        }  
		terminal.show(true);
  
        // 在终端中运行 bt.exe  
        terminal.sendText(`${exePath}`); // 注意：这里使用了双引号来确保路径中的空格被正确处理  
    });  
  
    context.subscriptions.push(run); 
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
