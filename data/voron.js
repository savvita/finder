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

export default {
    parseTable: parseTable
};