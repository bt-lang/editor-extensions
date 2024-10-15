// 模块“vscode”包含VS Code可扩展性API
const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const os = require('os');

// 当您的扩展被激活时，会调用此方法
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    const highlight = vscode.commands.registerCommand('bt-lang.highlight', function () {
        vscode.window.showInformationMessage(
            'The extension has been successfully installed, you need to restart VS Code to apply the changes.',
            { modal: true },
            'Restart'
        ).then(selection => {
            if (selection === 'Restart') {
                vscode.commands.executeCommand('workbench.action.reloadWindow');
            }
        });
    });
    context.subscriptions.push(highlight);

    let terminal; // 用于存储终端实例的变量
    const run = vscode.commands.registerCommand('extension.runBTScript', () => {

        // 获取当前工作区的第一个文件夹的路径
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage("No workspace folder is open.");
            return;
        }

        const workspacePath = workspaceFolders[0].uri.fsPath;
        const isWindows = os.platform() === 'win32'; // 检查是否为 Windows 系统
        const exeName = isWindows ? 'bt.exe' : 'bt'; // 根据系统选择文件名
        const exePathInWorkspace = path.join(workspacePath, exeName); // 工作区中的 bt.exe 路径
        const exePathInExtension = path.join(context.extensionPath, 'compiler/'+exeName); // 扩展内置的 bt.exe 路径

        let exePath;
        // 检查工作区中是否存在 bt.exe
        if (fs.existsSync(exePathInWorkspace)) {
            exePath = exePathInWorkspace; // 使用工作区中的 bt.exe
        } else {
            exePath = exePathInExtension; // 使用扩展内置的 bt.exe
        }

        // 每次运行前关闭现有终端并创建一个新的终端
        if (terminal) {
            terminal.dispose(); // 销毁现有的终端实例
        }
        terminal = vscode.window.createTerminal('BT Script Terminal');
        terminal.show(true);

        // 在终端中运行 bt.exe
        terminal.sendText(`${exePath}`);
    });

    context.subscriptions.push(run);
}

// 当您的扩展被停用时，会调用此方法
function deactivate() {}

module.exports = {
    activate,
    deactivate
};