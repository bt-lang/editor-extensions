import sublime
import sublime_plugin
import subprocess
import platform

class BuildBTCommand(sublime_plugin.TextCommand):
    def run(self, edit):
        # 根据操作系统选择编译器
        if platform.system() == "Windows":
            compiler = "bt.exe"
        else:
            compiler = "bt"

        # 调用编译器
        process = subprocess.Popen([compiler], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        output, error = process.communicate()
        
        # 显示输出结果
        if process.returncode == 0:
            sublime.message_dialog("Build Successful:\n" + output.decode())
        else:
            sublime.message_dialog("Build Failed:\n" + error.decode())
