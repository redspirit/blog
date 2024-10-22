const get = require('get-value');

class Listok {
    constructor() {
        this.tags = ['{{', '}}'];
        this.tagReg = new RegExp(`${this.tags[0]}([a-z_. ]+?)${this.tags[1]}`, 'gi');
        this.tagFuncReg = new RegExp(`${this.tags[0]}([a-z_. ]+?)\\((.*)\\)${this.tags[1]}`, 'gi');
        this.sectionSearch = new RegExp(this.tags[0] + '\#([a-z_.]+?)' + this.tags[1], 'gi');
    }

    parseFunctionParams(str) {
        let params = {};
        str.split(',').forEach(p => {
            let chunks = p.trim().split('=');
            if (chunks[1])
                params[chunks[0].trim()] = chunks[1].trim();
        });
        return params;
    }

    render(template, view) {
        this.template = template;
        this.context = view;

        // simple placeholder
        this.template = this.template.replaceAll(this.tagReg, (tag, key) => {
            let value = get(this.context, key);
            if(typeof value === 'string') {
                return value;
            } else if (typeof value === 'function') {
                return value();
            } else {
                return value ? value.toString() : '';
            }
        });

        // function with params
        this.template = this.template.replaceAll(this.tagFuncReg, (tag, key, strParams) => {
            let func = get(this.context, key);
            if(typeof func === 'function') {
                return func(this.parseFunctionParams(strParams));
            } else {
                return '';
            }
        });


        const sectionMatch = [...this.template.matchAll(this.sectionSearch)];
        // let sectionMatch = this.sectionSearch.exec(this.template);
        sectionMatch.forEach(section => {
            let name = section[1];
            console.log(name);
        })


        return this.template;
    }

}

module.exports = Listok;