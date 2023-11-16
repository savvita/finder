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
    // const categoriesHtml = html.querySelectorAll('td.body-elements tr td > div.product_info');
    
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

    console.log("parseCategoryDivs: " + categories);

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
    const filters = [];

    const filtersHtml = html.querySelectorAll('div.check-filter-block');
    // console.log(filtersHtml.length);


    // console.log(filters);

    return filters;
}

export default {
    parseTable: parseTable,
    parseCategories: parseCategories,
    parseFilters: parseFilters
};