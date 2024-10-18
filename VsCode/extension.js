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
    var lang = {
        installMsg: 'The extension has been successfully installed, you need to restart VS Code to apply the changes.',
        restartBtn: 'Restart',
        notWorkspace: 'No workspace folder is open.',
        compilerNotExist: 'The BT compiler does not exist, Please place the BT compiler in the root directory of the project!',
    };
    if (vscode.env.language.startsWith('zh-')){
        lang = {
            installMsg: '扩展已成功安装，您需要重新启动VS Code以应用更改。',
            restartBtn: '重启',
            notWorkspace: '没有打开任何工作区文件夹。',
            compilerNotExist: 'BT编译器不存在，请将BT编译器放置在项目的根目录中！',
        }
    }
    const highlight = vscode.commands.registerCommand('bt-lang.highlight', function () {
        vscode.window.showInformationMessage(
            lang.installMsg,
            { modal: true },
            lang.restartBtn
        ).then(selection => {
            if (selection === lang.restartBtn) {
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
            vscode.window.showErrorMessage(lang.notWorkspace);
            return;
        }

        const workspacePath = workspaceFolders[0].uri.fsPath;
        const isWindows = os.platform() === 'win32'; // 检查是否为 Windows 系统
        const exeName = isWindows ? 'bt.exe' : 'bt'; // 根据系统选择文件名
        const exePathInWorkspace = path.join(workspacePath, exeName); // 工作区中的 bt.exe 路径
        // const exePathInExtension = path.join(context.extensionPath, 'compiler/'+exeName); // 扩展内置的 bt.exe 路径

        let exePath;
        // 检查工作区中是否存在 bt.exe
        if (fs.existsSync(exePathInWorkspace)) {
            exePath = exePathInWorkspace; // 使用工作区中的 bt.exe
        } else {
            vscode.window.showErrorMessage(lang.compilerNotExist);
            return;
        }
        // if (fs.existsSync(exePathInWorkspace)) {
            // exePath = exePathInWorkspace; // 使用工作区中的 bt.exe
        // } else {
        //     exePath = exePathInExtension; // 使用扩展内置的 bt.exe
        // }

        // 每次运行前关闭现有终端并创建一个新的终端
        if (terminal) {
            terminal.dispose(); // 销毁现有的终端实例
        }
        terminal = vscode.window.createTerminal('BT Run');
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