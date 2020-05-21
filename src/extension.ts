// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import vscode from 'vscode'
import { CommentConverter } from './comment-converter';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('TSDoc comment converter activated!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    const disposable = vscode.commands.registerTextEditorCommand('extension.tsdocCommentConvert', (textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) => {

        // The code you place here will be executed every time your command is executed
        const document = textEditor.document;
        const selection = textEditor.selection;
        const startLine = selection.start.line;
        const endLine = selection.end.line;

        // get selected lines
        const lines = [];
        for (let i = startLine; i <= endLine; i++) {
            lines.push(document.lineAt(i).text);
        }

        // convert
        const converter = new CommentConverter();
        const newLines = converter.convertComment(lines);

        // replace
        const replaceRange = new vscode.Range(startLine, 0, endLine, lines[lines.length - 1].length);
        textEditor.edit((editBuilder: vscode.TextEditorEdit) => {
            editBuilder.replace(replaceRange, newLines.join('\n'));
        });
    });

    context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
    console.log('TSDoc comment converter deactivated.');
}

module.exports = {
    activate,
    deactivate
}
