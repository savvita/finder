import temp from './temp.js';
import IDOMParser from 'advanced-html-parser';
import radiomag from './radiomag.js';
import voron from './voron.js';
import microteh from './microteh.js';

const getAsync = async (url) => {
    let results = undefined;
    await fetch(url, {
        method: 'get'
    })
    .then(response => response.text())
    .then(response => {
        results = response;
    })
    .catch(() => {
        results = undefined;
    });

    return results;
}

class Basic {
    url;
    constructor(url) {
        this.url = url;
    }
}

class Radiomag extends Basic {
    constructor() {
        super('https://www.rcscomponents.kiev.ua/');
    }
    searchAsync = async(text, city) => {
        const searchText = text.replace(' ', '+');
        const url = `${ this.url }/search?q=${ searchText }`;
        // const html = await getAsync(url);
        const html = temp.radiomag;

        return this.#parseSearchResult(html, city);
    }

    #parseSearchResult = (html, city) => {
        const doc = IDOMParser.parse(html, {
            ignoreTags: ['head', 'style'],
            onlyBody: true
        });
        const table = doc.documentElement.querySelector('table.productlist-table');
        const articles = radiomag.parseTable(table, this.url, city);
        return articles;
    }
}

class Voron extends Basic {
    constructor() {
        super('https://voron.ua');
    }
    searchAsync = async(text) => {
        const searchText = text.replace(' ', '+');
        const url = `${ this.url }/search.php?search=${ searchText }`;
        //const html = await getAsync(url);
        const html = temp.voron;

        return this.#parseSearchResult(html);
    }

    #parseSearchResult = (html) => {
        const doc = IDOMParser.parse(html, {
            ignoreTags: ['head', 'style'],
            onlyBody: true
        });
        const table = doc.documentElement.querySelector('table.table_grey');
        const articles = voron.parseTable(table, this.url);
        return articles;
    }
}

class Microteh extends Basic {
    constructor() {
        super('https://microteh.ck.ua/index.php');
    }
    searchAsync = async(text) => {
        const searchText = text.replace(' ', '+');
        const url = `${ this.url }?route=product/search&search=${ searchText }`;
        //const html = await getAsync(url);
        const html = temp.microteh;

        return this.#parseSearchResult(html);
    }

    #parseSearchResult = (html) => {
        const doc = IDOMParser.parse(html, {
            ignoreTags: ['head', 'style'],
            onlyBody: true
        });
        const articles = microteh.parseTable(doc.documentElement);
        return articles;
    }
}


export default {
    Radiomag: new Radiomag(),
    Voron: new Voron(),
    Microteh: new Microteh()
}