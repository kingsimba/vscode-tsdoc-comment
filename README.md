# TSDoc Comment

A VSCode extension for converting simple C/C++ style comments into TSDoc style comments

## Features

Convert:

```ts
// This is a multi-line comment
// And will be converted into
// TSDoc style comment
name: string;
@Expose({name: 'len'})
length: number; // this a single line comment
```

Into:

```ts
/** This is a multi-line comment
 * And will be converted into
 * TSDoc style comment
 */
name: string;
/** this a single line comment */
@Expose({name: 'len'})
length: number;
```

![features](images/tsdoc-comment.gif)

## How to Use

1. Select a block of text
2. Press Ctrl+Shift+P. Select `TSDoc Comment: convert selected text into TSDoc style comment`

## License

MIT.

## Code Repository

https://github.com/kingsimba/vscode-tsdoc-comment

## Release Notes

### 1.1.0

- Support `///< COMMENT` style single line comment.
- Put comment before TypeScript annotations.

### 1.0.0

- First release.
