"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    const insertLogs = vscode.commands.registerCommand('logtrace.insertLogs', () => {
        const editor = vscode.window.activeTextEditor;
        const code = [];
        let count = 1;
        if (editor) {
            const document = editor.document;
            const selection = editor.selection;
            const text = document.getText(selection);
            const lines = text.split('\n');
            lines.forEach(line => {
                if (line[line.length - 1] === ';') {
                    code.push(line);
                    code.push(`console.log(${count})`);
                    count++;
                }
                else {
                    code.push(line);
                }
            });
            editor.edit(editBuilder => {
                editBuilder.replace(selection, code.join('\n'));
            });
        }
    });
    const removeLogs = vscode.commands.registerCommand('logtrace.removeLogs', () => {
        const editor = vscode.window.activeTextEditor;
        const code = [];
        if (editor) {
            const document = editor.document;
            const text = document.getText();
            const lines = text.split('\n');
            const re = new RegExp(/console.log\(\d+/);
            lines.forEach(line => {
                if (!re.test(line)) {
                    code.push(line);
                }
            });
            const firstLine = editor.document.lineAt(0);
            const lastLine = editor.document.lineAt(editor.document.lineCount - 1);
            const textRange = new vscode.Range(0, firstLine.range.start.character, editor.document.lineCount - 1, lastLine.range.end.character);
            editor.edit(editBuilder => {
                editBuilder.replace(textRange, code.join('\n'));
            });
        }
    });
    context.subscriptions.push(insertLogs, removeLogs);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map