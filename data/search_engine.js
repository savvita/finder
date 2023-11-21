import temp from './temp.js';
import IDOMParser from 'advanced-html-parser';
import radiomag from './radiomag.js';
import voron from './voron.js';
import microteh from './microteh.js';

const getAsync = async (url) => {
    let results = undefined;
    let controller = new AbortController();

    setTimeout(() => controller.abort(), 20000);
    await fetch(url, {
        method: 'get',
        signal: controller.signal
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
    searchAsync = async(text, city, maxPages) => {
        if(!text) return [];
        const searchText = text.replace(' ', '+');
        const url = `${ this.url }/search?q=${ searchText }`;
        const html = await getAsync(url);
        //const html = temp.radiomag;

        if(!html) return [];
        return this.#parseSearchResult(html, city, maxPages);
    }

    #getNextPage = (doc) => {
        const links = doc.querySelectorAll('div.panel-body div b');
        if(!links || links.length === 0) return null;
        if(!links[links.length - 1].text().toLowerCase().includes('наступна')) return null;

        return links[links.length - 1].querySelector('a')?.getAttribute('href');
    }

    #parseSearchResult = async (html, city, maxPages) => {
        const articles = [];
        let i = 0;
        do {
            const doc = IDOMParser.parse(html, {
                ignoreTags: ['head', 'style'],
                onlyBody: true,
                errorHandler: () => {}
            });
            const table = doc.documentElement.querySelector('table.productlist-table');

            const _articles = radiomag.parseTable(table, this.url, city);
            if(_articles.length === 0) break;
            articles.push(..._articles);

            const nextPage = this.#getNextPage(doc);
            if(!nextPage) break;
            html = await getAsync(this.url + nextPage);

            i++;
        } while(i < maxPages ?? 1);
        return articles;
    }
}

class Voron extends Basic {
    #lastHtml;
    constructor() {
        super('https://voron.ua');
    }
    static catalogUrl = 'https://voron.ua/uk/catalog';

    searchAsync = async(text) => {
        if(!text) return [];
        const searchText = text.replace(' ', '+');
        const url = `${ this.url }/search.php?search=${ searchText }`;
        // const html = await getAsync(url);
        //const html = temp.voron;
        const html = await this.#getBodyAsync(searchText);

        if(!html) return [];

        return this.#parseSearchResult(html);
    }

    #getBodyAsync = async (text) => {
        let results = undefined;
        let controller = new AbortController();
    
        setTimeout(() => controller.abort(), 20000);
        await fetch("https://voron.ua/uk/search-quick.php", {
            "headers": {
                "accept": "*/*",
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "x-requested-with": "XMLHttpRequest"
            },
            "body": `search=${ text }&command=all_product&amount=500`,
            "method": "POST",
            signal: controller.signal
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

    getCategoriesAsync = async (url) => {
        if(!url) {
            url = `${ this.url}/uk/catalog`;
        }
        const html = await getAsync(url);
        //const html = temp.categories;

        const doc = IDOMParser.parse(html, {
            ignoreTags: ['head', 'style'],
            onlyBody: true,
            errorHandler: () => {}
        });

        this.#lastHtml = doc;

        return voron.parseCategories(doc, this.url);
    }

    loadFiltersAsync = async () => {
        return voron.parseFilters(this.#lastHtml);
    }

    filterAsync = async (filters) => {
        const url = voron.getFilterUrl(filters, this.url);
        const html = await getAsync(url);
        const doc = IDOMParser.parse(html, {
            ignoreTags: ['head', 'style'],
            onlyBody: true,
            errorHandler: () => {}
        });

        return voron.parseFilteredResults(doc, this.url);
    }

    #parseSearchResult = (html) => {
        const doc = IDOMParser.parse(html, {
            ignoreTags: ['head', 'style'],
            onlyBody: true,
            errorHandler: () => {}
        });
        const table = doc.querySelector('table.table_grey');
        const articles = voron.parseTable(table, this.url);
        return articles;
    }
}

class Microteh extends Basic {
    constructor() {
        super('https://microteh.ck.ua/index.php');
    }
    searchAsync = async(text, maxPages) => {
        if(!text) return [];
        const searchText = text.replace(' ', '+');
        const url = `${ this.url }?route=product/search&search=${ searchText }`;
        const html = await getAsync(url);
        // const html = temp.microteh;

        return this.#parseSearchResult(html, maxPages);
    }

    checkAvailableAsync = async (item) => {
        const html = await getAsync(item.url);
        const doc = IDOMParser.parse(html, {
            ignoreTags: ['head', 'style'],
            onlyBody: true,
            errorHandler: () => {}
        });
        return microteh.checkAvailable(doc);
    }

    #getNextPage = (doc) => {
        const link = doc.querySelector('ul.pagination li.active + li a');
        if(!link) return null;

        return link.getAttribute('href');
    }

    #parseSearchResult = async (html, maxPages) => {
        const articles = [];
        let i = 0;
        do {
            const doc = IDOMParser.parse(html, {
                ignoreTags: ['head', 'style'],
                onlyBody: true,
                errorHandler: () => {}
            });

            const _articles = microteh.parseTable(doc.documentElement);
            if(_articles.length === 0) break;
            articles.push(..._articles);

            const nextPage = this.#getNextPage(doc);
            if(!nextPage) break;
            html = await getAsync(nextPage);

            i++;
        } while(i < maxPages ?? 1);
        return articles;
    }
}


export default {
    Radiomag: new Radiomag(),
    Voron: new Voron(),
    Microteh: new Microteh(),
    catalogUrl: Voron.catalogUrl
}