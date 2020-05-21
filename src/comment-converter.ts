export class CommentConverter {
    private lines: string[];
    private lineIndex: number;
    private newLines: string[] = [];

    convertComment(lines: string[]): string[] {
        this.lines = lines;
        this.lineIndex = 0;
        this.newLines = [];

        for (this.lineIndex = 0; this.lineIndex < lines.length; this.lineIndex++) {
            const line = lines[this.lineIndex];

            // one line comment
            const m = line.match(/(\s*)([^\s].*)\/\/([^\/]*)/);
            if (m != undefined) {
                const indent = m[1];
                const code = m[2].trimRight();
                let comment = m[3];
                if (comment.startsWith('/<')) {
                    // for '///< COMMENT' style comment
                    comment = comment.slice(2);
                }
                comment = comment.trim();
                this.newLines.push(`${indent}/** ${comment.trim()} */`);
                this.newLines.push(indent + code);
            } else if (this.handleMultilineComment()) {
            } else {
                this.newLines.push(line);
            }
        }

        return this.newLines;
    }

    private handleMultilineComment(): boolean {
        const startIndex = this.lineIndex;
        const comments = [];
        const lines = this.lines;
        let indent = -1;
        for (let i = startIndex; i < lines.length; i++) {
            const line = lines[i];
            const m = line.match(/(\s*)\/\/(.*)/);

            // for none-pure-comment line
            if (m == undefined) {
                if (comments.length != 0) {
                    const firstCodeLineIndent = line.length - line.trimLeft().length;
                    if (firstCodeLineIndent === indent) {
                        // found well aligned comments
                        const leadingIndent = ' '.repeat(indent);
                        if (comments.length == 1) {
                            this.newLines.push(`${leadingIndent}/** ${comments[0]} */`);
                        } else {
                            this.newLines.push(leadingIndent + `/**`);
                            for (const comment of comments) {
                                this.newLines.push(leadingIndent + ` * ${comment}`);
                            }
                            this.newLines.push(leadingIndent + ` */`);
                        }
                        this.newLines.push(line);
                        this.lineIndex = i;
                        return true;
                    }
                }

                this.lineIndex = startIndex;
                return false;
            } else {
                // pure comment line

                // save indent
                const newIndent = m[1].length;
                if (indent == -1) {
                    indent = newIndent;
                }

                // save comments
                if (m[2].startsWith(' ')) {
                    comments.push(m[2].slice(1).trimRight());
                } else {
                    comments.push(m[2].trimRight());
                }

                // found mis-aligned comment, failed
                if (newIndent !== indent) {
                    this.lineIndex = startIndex;
                    return false;
                }
            }
        }
    }
}
