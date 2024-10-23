const fs = require('fs');
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
    menuTitle: 'The Blog!',
    copyright: 'LISTOK.js',
    author: (params) => {
        return 'Red Spirit ' + JSON.stringify(params);
    },
    booksArr: [{name: 'book 1'}, {name: 'book 2'}],
    booksObj: {name: 'For dummies )'},
    booksFunc: () => {
        return {name: 'Zloy Awaw'};
    }

};

// let tpl = '<p>Hello, {{author}}! {{getItems()}}</p>';
// let tpl = 'Last 3 items of <b>{{header}}</b>: {{#books}} <h1>{{name}}</h1> {{/books}} <br> {{footer(name=123)}}';
let tpl = fs.readFileSync('./themes/listok_test.html').toString();

let content = listok.render(tpl, view);
console.log('--------------------------------------------');
console.log(content);