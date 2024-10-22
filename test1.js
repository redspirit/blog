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
    author: "Joe",
    getItems: (params) => {
        return JSON.stringify(params)
    }

};

// let tpl = '<p>Hello, {{author}}! {{getItems()}}</p>';
let tpl = 'Last 3 items of <b>{{author}}</b>: {{#getitems}} <h1>{{name}}</h1> {{/getitems}}';

let content = listok.render(tpl, view);

console.log(content);