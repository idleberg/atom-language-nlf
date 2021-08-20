// Dependencies
const { join } = require('path');
const { languages, meta } = require('@nsis/language-data');
const { mkdir, writeFile } = require('fs');
const CSON = require('cson');
const languageNames = Object.keys(languages);
const logSymbols = require('log-symbols');
const toCapitalCase = require('to-capital-case');
const toSlugCase = require('to-slug-case');

mkdir('./grammars', {}, err => {
    if (err && err.code !== 'EEXIST') throw err;

    languageNames.map(language => {
        const long = (meta[language] && meta[language].long) ? meta[language].long : language;
        const capital = toCapitalCase(long);
        const slug = toSlugCase(long);

        const output = {
            'fileTypes': [
                `${capital}.nlf`
            ],
            'name': `NSIS Language File (${capital})`,
            'patterns': [
                {
                    include: "source.nlf"
                }
            ],
            "scopeName": `source.nlf.${slug}`
        };

        const outName = `nlf-${slug}.cson`;
        const outFile = join(__dirname, '..', 'grammars', outName);
        const contents = CSON.stringify(output, null, 2);

        writeFile(outFile, contents, (err) => {
          if (err) throw err;
          console.log(logSymbols.success, `grammars/${outName}`);
        });
    });
});
