import IDOMParser from 'advanced-html-parser';

const parseRow = (row, baseUrl) => {
    const article = {
        id: 0,
        name: '',
        price: 0,
        available: 0,
        image: '',
        url: ''
    }

    const nameColumn = row.querySelector('.title');

    if(!nameColumn) return null;

    const a = nameColumn.querySelector('a');
    if(!a) return null;

    article.name = nameColumn.text();
    article.url = baseUrl + a.getAttribute('href');

    const image = row.querySelector('div.img.imgsize2 img');

    if(image) {
        let url = '';
        if(image.getAttribute('src').startsWith('http')) {
            url = image.getAttribute('src');
        } else {
            url = baseUrl + image.getAttribute('src');
        }
        article.image = url;
    }

    const available = row.querySelector('.price .td_val')?.text();

    if(available) {
        if(!available.toLowerCase().includes('немає')) {
            article.available = parseInt(available);
        }
    }

    const price = row.querySelector('td.cena nobr')?.text();

    if(price) {
        article.price = parseFloat(price.replace(',', '.'));
    }

    return article;
}

const parseTable = (table, baseUrl) => {
    const rows = table.querySelectorAll('tr');

    const articles = [];

    for (let i = 3; i < rows.length; i++) {
        const article = parseRow(rows[i], baseUrl);

        if(article != null) {
            article.id = i;
            articles.push(article);
        }
    }

    return articles;
}

const parseCategoryCell = (category, html, baseUrl) => {
    const a = html.querySelector('a');
    if(!a) return null;

    const href = a.getAttribute('href');
    category.url = href.startsWith('http') ? href : baseUrl + href;

    category.title = a.text();

    return category;
}

const parseCategoryDiv = (html, baseUrl) => {
    const category = {
        id: 0,
        title: '',
        url: '',
        image: ''
    };

    const a = html.querySelector('a');
    if(!a) return null;

    const title = html.querySelector('div.product_info a');
    if(!title) return null;

    const href = a.getAttribute('href');
    category.url = href.startsWith('http') ? href : baseUrl + href;
    category.title = title.text();
    category.image = getCategoryImage(html, baseUrl);

    return category;
}

const getCategoryImage = (html, baseUrl) => {
    const src = html.querySelector('img')?.getAttribute('src');
    if(src) {
        return src.startsWith('http') ? src : baseUrl + src;
    }

    return '';
}

const parseCategoryTable = (html, baseUrl) => {
    const categories = [];
    const categoriesHtml = html.querySelectorAll('td.body-elements tr td > div');
    
    let category = {
        id: 0,
        title: '',
        url: '',
        image: ''
    };

    for(let i = 0; i < categoriesHtml.length; i++) {
        if(categoriesHtml[i].classList.has('product_info')) {
            parseCategoryCell(category, categoriesHtml[i], baseUrl);
            if(category != null) {
                category.id = i;
                categories.push(category);
                category = {
                    id: 0,
                    title: '',
                    url: '',
                    image: ''
                };
            }
        } else {
            category.image = getCategoryImage(categoriesHtml[i], baseUrl);
        }
    }

    return categories;
}

const parseCategoryDivs = (categoriesHtml, baseUrl) => {
    const categories = [];

    for(let i = 0; i < categoriesHtml.length; i++) {
        const category = parseCategoryDiv(categoriesHtml[i], baseUrl);
        if(category != null) {
            category.id = i;
            categories.push(category);
        }
    }

    return categories;
}

const parseCategories = (html, baseUrl) => {
    const categoriesHtml = html.querySelectorAll('div.catalog-pic-block');

    if(!categoriesHtml || categoriesHtml.length === 0) {
        return parseCategoryTable(html, baseUrl);
    }

    return parseCategoryDivs(categoriesHtml, baseUrl);
}

const parseFilters = (html) => {
    const filters = {
        code: '',
        filters: []
    };

    const filtersHtml = html.querySelectorAll('div.check-filter-block');
    const code = filtersHtml[0]?.parentNode?.getAttribute('id')?.replace('filter_', '');

    if(!code) return null;

    filters.code = code;
    
    for(let i = 0; i < filtersHtml.length; i++) {
        const filter = parseFilter(filtersHtml[i]);
        if(filter) {
            filter.id = i;
            filters.filters.push(filter);
        }
    }

    return filters;
}

const parseFilter = (html) => {
    const filter = {
        id: 0,
        title: '',
        options: []
    }

    const title = html.querySelector('div.caption');
    if(!title) return null;

    filter.title = title.text();

    const optionsHtml = html.querySelectorAll('label');

    for(let i = 0; i < optionsHtml.length; i++) {
        const option = parseOption(optionsHtml[i]);
        if(option) {
            option.id = i;
            filter.options.push(option);
        }
    }

    return filter;
}

const parseOption = (html) => {
    const option = {
        id: 0,
        title: '',
        name: '',
        value: '',
        amount: 0,
        checked: false
    }

    const input = html.querySelector('input');
    if(!input) return null;

    option.name = input.getAttribute('name');
    option.value = input.getAttribute('value');

    if(!option.name || !option.value) return null;

    const title = html.querySelector('.check-filter-value');
    if(!title) return null;

    option.title = title.text();
    option.amount = html.querySelector('.check-filter-amount')?.text() ?? 0;

    return option;
}

const prepareFilters = (filters) => {
    const options = [];
    for(let filter of filters.filters) {
        for(let option of filter.options) {
            option.name = option.name.replace('anufacturer', '');
            option.name = option.name.replace('over', '');
            option.name = option.name.replace('aram_', '');
            options.push(option);
        }
    }

    options.push({
        name: 'vlbl',
        value: 0
    });

    options.push({
        name: 'sale',
        value: 0
    });

    options.push({
        name: 'disc',
        value: 0
    });

    options.push({
        name: 'sort1',
        value: 'none'
    });

    return options;
}

const getSearchArguments = (options) => {
    let args = 'method=param';
    for(let option of options) {
        args += `&${ option.name }=${ option.value }`;
    }

    return args;
}

const getFilterUrl = (filters, baseUrl) => {
    const options = prepareFilters(filters);
    const url = `${ baseUrl }/catalog/${ filters.code }?${ getSearchArguments(options) }`;

    return url;
}

const parseFilteredResults = (html, baseUrl) => {
    const articles = [];

    const rows = html.querySelectorAll('table#product_line tr[id^="product_line"]');
    const indexes = getColumnIndexes(rows[0]);

    for(let i = 1; i < rows.length; i++) {
        const article = parseFilteredRow(rows[i], baseUrl, indexes);
        if(article) {
            article.id = i;
            articles.push(article);
        }
    }

    return articles;
}

const getColumnIndexes = (headerRow) => {
    const columns = headerRow.querySelectorAll('th');
    const indexes = {
        'name': -1,
        'price': -1,
        'available': -1,
        'image': -1
    }

    for(let i = 0; i < columns.length; i++) {
        if(!columns[i]) continue;
        if(columns[i].text().includes('Найменування')) {
            indexes.name = i;
        } else if(columns[i].text().includes('Залишки')) {
            indexes.available = i;
        } else if(columns[i].text().includes('Ціна')) {
            indexes.price = i;
        } else if(columns[i].text().includes('photo_camera')) {
            indexes.image = i;
        }
    }

    return indexes;
}

const parseFilteredRow = (html, baseUrl, indexes) => {
    const article = {
        id: 0,
        name: '',
        price: 0,
        available: 0,
        image: '',
        url: ''
    }

    const columns = html.querySelectorAll('td');

    if(indexes.name > 0) {
        const a = columns[indexes.name]?.querySelector('a');
        if(!a) return null;
    
        article.name = columns[indexes.name].text();
        article.url = baseUrl + a.getAttribute('href');
    } else {
        return null;
    }

    if(indexes.image > 0) {
        const image = columns[indexes.image].querySelector('img');
        if(image) {
            let url = '';
            if(image.getAttribute('src').startsWith('http')) {
                url = image.getAttribute('src');
            } else {
                url = baseUrl + image.getAttribute('src');
            }
            article.image = url;
        }
    }

    if(indexes.available > 0) {
        const available = columns[indexes.price].querySelector('b')?.text();

        if(available) {
            if(!available.toLowerCase().includes('немає')) {
                article.available = parseInt(available.replace('всього: ', ''));
            }
        }
    }

    if(indexes.price > 0 && article.available > 0) {
        const priceColumns = columns[indexes.price].querySelectorAll('td');
        if(priceColumns.length > 1) {
            const price = priceColumns[1].querySelector('nobr');
            if(price) {
                article.price = parseFloat(price.replace(',', '.'));
            }
        }
    }

    return article;
}

export default {
    parseTable: parseTable,
    parseCategories: parseCategories,
    parseFilters: parseFilters,
    getFilterUrl: getFilterUrl,
    parseFilteredResults: parseFilteredResults
};