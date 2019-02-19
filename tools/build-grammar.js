// Dependencies
const CSON = require('cson');
const toCapitalCase = require('to-capital-case');
const toSlugCase = require('to-slug-case');
const { join } = require('path');
const { languages, meta } = require('@nsis/language-data');
const { mkdir, writeFile } = require('fs');
const languageNames = Object.keys(languages);

mkdir('./grammars', {}, err => {
    if (err && err.code !== 'EEXIST') throw err;

    languageNames.forEach(language => {
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
        });
    });
});
