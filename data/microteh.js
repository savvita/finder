const parseRow = (row) => {
    const article = {
        id: 0,
        name: '',
        price: 0,
        available: 0,
        image: '',
        url: ''
    }

    const nameColumn = row.querySelector('div.caption h4');

    if(!nameColumn) return null;

    const a = nameColumn.querySelector('a');
    if(!a) return null;

    article.name = nameColumn.text();
    article.url = a.getAttribute('href');

    const image = row.querySelector('div.image img');

    if(image) {
        article.image = image.getAttribute('src');
    }

    article.available = 1;

    const price = row.querySelector('p.price')?.text();

    if(price) {
        article.price = parseFloat(price.replace(',', '.'));
    }

    return article;
}

const parseTable = (table) => {
    const rows = table.querySelectorAll('div.product-layout');

    const articles = [];

    for (let i = 0; i < rows.length; i++) {
        const article = parseRow(rows[i]);

        if(article != null) {
            article.id = i;
            articles.push(article);
        }
    }

    return articles;
}

const checkAvailable = (html) => {
    const content = html.querySelector('div#content div.col-sm-4 ul.list-unstyled')?.querySelectorAll('li');
    const div = content[content.length - 1]?.querySelectorAll('div');
    if(!div || div.length === 0) return false;


    const text = div[div.length - 1].text().toLowerCase();
    if(!text.includes('наявності')) return false;

    return !div[div.length - 1].text().toLowerCase().includes('немає');
}

export default {
    parseTable: parseTable,
    checkAvailable: checkAvailable
};