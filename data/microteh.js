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

    console.log(articles);

    return articles;
}

export default {
    parseTable: parseTable
};