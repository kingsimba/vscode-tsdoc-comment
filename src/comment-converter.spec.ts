//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import { expect } from 'chai';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
// const vscode = require('vscode');
import { CommentConverter } from './comment-converter';

describe("CommentConverter", () => {

    const converter = new CommentConverter();

    it("can convert one line comment", () => {
        const lines = converter.convertComment([
            '    mn: string	// name ',
            '    birthYear: number	// the year of birth   '
        ]);
        expect(lines.join('\n')).equals([
            '    /** name */',
            '    mn: string',
            '    /** the year of birth */',
            '    birthYear: number',
        ].join('\n'));
    });

    it("can convert multi-line comment", () => {
        const lines = converter.convertComment([
            '    // This is',
            '    // the year of birth',
            '    birthYear: number'
        ]);
        expect(lines.join('\n')).equals([
            '    /**',
            '     * This is',
            '     * the year of birth',
            '     */',
            '    birthYear: number',
        ].join('\n'));
    });

    it("can't convert mis-aligned comment", () => {
        const lines = converter.convertComment([
            '    // This is',
            '      // the year of birth',
            '    birthYear: number'
        ]);
        expect(lines.join('\n')).equals([
            '    // This is',
            '      // the year of birth',
            '    birthYear: number'
        ].join('\n'));
    });

    it("can convert mixed comments", () => {
        const lines = converter.convertComment([
            '    mn: string	// name ',
            '        // This is',
            '        // the year of birth',
            '        birthYear: number'
        ]);
        expect(lines.join('\n')).equals([
            '    /** name */',
            '    mn: string',
            '        /**',
            '         * This is',
            '         * the year of birth',
            '         */',
            '        birthYear: number',
        ].join('\n'));
    });

    it("can handle ///< COMMENT", () => {
        const lines = converter.convertComment([
            '    tollbooth: Tollbooth;     ///< COMMENT'
        ]);
        expect(lines.join('\n')).equals([
            '    /** COMMENT */',
            '    tollbooth: Tollbooth;'
        ].join('\n'));
    });

    it("can handle decorators well", () => {
        const lines = converter.convertComment([
            '    age: number;',
            '    @_if((o: Maneuver) => o.mnTy == ManeuverType.passTollbooth)',
            '    tollbooth: Tollbooth;     // 收费站详情'
        ]);
        expect(lines.join('\n')).equals([
            '    age: number;',
            '    /** 收费站详情 */',
            '    @_if((o: Maneuver) => o.mnTy == ManeuverType.passTollbooth)',
            '    tollbooth: Tollbooth;'
        ].join('\n'));
    });

});
