"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
const lsp = require("vscode-languageserver");
const tokenTypes = new Map();
const tokenModifiers = new Map();
const legend = (function () {
    const tokenTypesLegend = [
        'comment', 'string', 'keyword', 'number', 'regexp', 'operator', 'namespace',
        'type', 'struct', 'class', 'interface', 'enum', 'typeParameter', 'function',
        'method', 'decorator', 'macro', 'variable', 'parameter', 'property', 'label'
    ];
    tokenTypesLegend.forEach((tokenType, index) => tokenTypes.set(tokenType, index));
    const tokenModifiersLegend = [
        'declaration', 'documentation', 'readonly', 'static', 'abstract', 'deprecated',
        'modification', 'async'
    ];
    tokenModifiersLegend.forEach((tokenModifier, index) => tokenModifiers.set(tokenModifier, index));
    return new vscode.SemanticTokensLegend(tokenTypesLegend, tokenModifiersLegend);
})();
function activate(context) {
    context.subscriptions.push(vscode.languages.registerDocumentSemanticTokensProvider({ language: 'semanticLanguage' }, new DocumentSemanticTokensProvider(), legend));
}
exports.activate = activate;
class DocumentSemanticTokensProvider {
    async provideDocumentSemanticTokens(document, token) {
        const allTokens = this._parseText(document.getText());
        const builder = new vscode.SemanticTokensBuilder();
        allTokens.forEach((token) => {
            builder.push(token.line, token.startCharacter, token.length, this._encodeTokenType(token.tokenType), this._encodeTokenModifiers(token.tokenModifiers));
        });
        return builder.build();
    }
    /**
   * .
   *
   * @param x - The first input number
   * @param y - The second input number
   * @returns The arithmetic mean of `x` and `y`
   *
   */
    _encodeTokenType(tokenType) {
        if (tokenTypes.has(tokenType)) {
            return tokenTypes.get(tokenType);
        }
        else if (tokenType === 'notInLegend') {
            return tokenTypes.size + 2;
        }
        return 0;
    }
    _encodeTokenModifiers(strTokenModifiers) {
        let result = 0;
        for (let i = 0; i < strTokenModifiers.length; i++) {
            const tokenModifier = strTokenModifiers[i];
            if (tokenModifiers.has(tokenModifier)) {
                result = result | (1 << tokenModifiers.get(tokenModifier));
            }
            else if (tokenModifier === 'notInLegend') {
                result = result | (1 << tokenModifiers.size + 2);
            }
        }
        return result;
    }
    /**
   * . translate text onto IParsedToken frame
   *
   * @param text - text of a documment
   *
   * @returns the list of tokens informations on the IParsedToken frame
   *
   */
    _parseText(text) {
        const r = []; // initialisation de la structure des tokens
        const lines = text.split(/\r\n|\r|\n/);
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            let currentOffset = 0;
            do {
                const openOffset = line.indexOf('[', currentOffset); // openoffset se positionne sur le [ d'un token
                if (openOffset === -1) {
                    break;
                }
                const closeOffset = line.indexOf(']', openOffset); // closeoffset se positionne sur le ] d'un token
                if (closeOffset === -1) {
                    break;
                }
                const tokenData = this._parseTextToken(line.substring(openOffset + 1, closeOffset)); // 
                //				console.log("t",tokenData.tokenType) ;
                r.push({
                    line: i,
                    startCharacter: openOffset + 1,
                    length: closeOffset - openOffset - 1,
                    tokenType: tokenData.tokenType,
                    tokenModifiers: tokenData.tokenModifiers
                });
                currentOffset = closeOffset; // se positionne derrère le token traité  
            } while (true);
        }
        const tmp = lsp;
        //lsp.SemanticTokensRequest ;
        //extensions.getExtension("langium.langium-vscode");
        console.log(tmp);
        return r;
    }
    /**
   * .extract pos of a token in a text
   *
   * @param text - string of a token
   *
   * @returns a token with tokenType and tokenModifiers area
   *
   */
    _parseTextToken(text) {
        const parts = text.split('.');
        return {
            tokenType: parts[0],
            tokenModifiers: parts.slice(1)
        };
    }
}
//# sourceMappingURL=extension.js.map