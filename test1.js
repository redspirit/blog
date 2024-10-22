const Listok = require('./Listok');

let listok = new Listok();

let dataSource = (limit, sort) => {
    // получаем какие-нибудь данные по параметрам
    return [
        {name: 'first'},
        {name: 'second'},
    ]
}

const view = {
    author: 'Joe',
    booksArr: [{name: 'book 1'}, {name: 'book 2'}],
    books: {name: 'book obj'},
    getItems: (params) => {
        return JSON.stringify(params)
    }

};

// let tpl = '<p>Hello, {{author}}! {{getItems()}}</p>';
let tpl = 'Last 3 items of <b>{{author}}</b>: {{#books}} <h1>{{name}}</h1> {{/books}}';

let content = listok.render(tpl, view);

console.log(content);