// Dependencies
const CSON = require('cson');
const toCapitalCase = require('to-capital-case');
const toSlugCase = require('to-slug-case');
const { join } = require('path');
const { languages, meta } = require('@nsis/language-data');
const { mkdir, writeFile } = require('fs');

const languageNames = Object.keys(languages);
const output = {};

mkdir('./snippets', {}, err => {
    if (err && err.code !== 'EEXIST') throw err;

    languageNames.forEach(language => {
        const long = (meta[language] && meta[language].long) ? meta[language].long : language;
        const capital = toCapitalCase(long);
        const slug = toSlugCase(long);

        const snippets = {};

        Object.keys(languages[language].strings).forEach((stringKey, index ) => {
            const key = stringKey;
            const value = languages[language].strings[key];

            const snippet = {
                'body': `# ^${key}\n$\{1:${value}\}$0`,
                'prefix': key,
            };
            snippets[key] = snippet;
        })

        output[`.source.nlf.${slug}`] = snippets;
    });

    const outName = 'core.NLF.cson';
    const outFile = join(__dirname, '..', 'snippets', outName);
    const contents = CSON.stringify(output, null, 2);

    writeFile(outFile, contents, (err) => {
        if (err) throw err;
    });
});
