const getColumnIndexes = (headerRow) => {
    const columns = headerRow.querySelectorAll('th');
    const indexes = {
        'name': -1,
        'price': -1,
        'available': -1
    }

    for(let i = 0; i < columns.length; i++) {
        if(!columns[i]) continue;
        if(columns[i].text().includes('Назва')) {
            indexes.name = i;
        } else if(columns[i].text().includes('Доступність')) {
            indexes.available = i;
        } else if(columns[i].text().includes('Ціна')) {
            indexes.price = i;
        }
    }

    return indexes;
}

const parseRow = (row, indexes, baseUrl, city) => {
    const columns = row.querySelectorAll('td');
    const article = {
        id: 0,
        name: '',
        price: 0,
        available: 0,
        image: '',
        url: ''
    }

    const image = columns[0].querySelector('img');
    if(image) {
        let url = '';
        if(image.getAttribute('src').startsWith('http')) {
            url = image.getAttribute('src');
        } else {
            url = baseUrl + image.getAttribute('src');
        }
        article.image = url;
    }

    if(indexes.name >= 0) {
        const a = columns[indexes.name].querySelector('a');

        if(!a) return null;

        article.name = a.text();
        article.url = baseUrl + a.getAttribute('href');
    } else {
        return null;
    }

    if(indexes.available >= 0) {
        const available = columns[indexes.available]?.text() ?? '';

        if(available.includes(city)) {
            const endIndex = available.substring(0, available.length - city.length).lastIndexOf('шт');
            const startIndex = available.substring(0, endIndex).lastIndexOf(' ');
            article.available = parseInt(available.substring(startIndex, endIndex).trim());
        }
    }

    
    if(indexes.price >= 0 && article.available > 0) {
        const priceColumns = columns[indexes.price]?.querySelectorAll('table tr td');

        if(priceColumns && priceColumns[1] && priceColumns[1].text()) {
            article.price = parseFloat(priceColumns[1].text().replace(',', '.'));
        }
    }

    const datasheet = row.querySelector('a.datasheet-link');
    if(datasheet) {
        let url = datasheet.getAttribute('href');
        if(!url.startsWith('http')) {
            url = baseUrl + url;
        }
        article.datasheet = url;
    }

    return article;
}

const parseTable = (table, baseUrl, city) => {
    const rows = table.querySelectorAll('tr');
    const indexes = getColumnIndexes(rows[0]);
    
    const articles = [];

    for (let i = 1; i < rows.length; i++) {
        const article = parseRow(rows[i], indexes, baseUrl, city);

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