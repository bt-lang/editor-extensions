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

	const run = vscode.commands.registerCommand('extension.runBTScript', () => {
        // 获取 bt.exe 的路径
        const exePath = path.join(context.extensionPath, 'bt.exe'); // 替换为你的 bt.exe 路径

        // 获取当前工作区的第一个文件夹的路径
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage("No workspace folder is open.");
            return;
        }
        // 运行 bt.exe
        execFile(exePath, [], (error, stdout, stderr) => {
            if (error) {
                vscode.window.showErrorMessage(`Error: ${stderr}`);
                return;
            }
            vscode.window.showInformationMessage(`Output: ${stdout}`);
        });
    });

    context.subscriptions.push(run);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
