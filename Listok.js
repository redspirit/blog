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

    parseSections(template, context) {
        const sectionMatch = [...template.matchAll(this.sectionSearch)];
        const section = sectionMatch[0];
        if (section) {
            let name = section[1];
            let sectionReg = new RegExp(`{{\#${name}}}(.+){{\/${name}}}`, 'gi');
            let subContext = get(context, name);
            if(!subContext) return;

            // todo test type of subContext

            return template.replaceAll(sectionReg, (sect, body) => {
                // console.log('s', sect);
                // console.log('b', body);
                return this.parseSections(body, subContext);
            });

        } else {
            return this.renderTags(template, context);
        }
    }

    renderTags(template, context) {
        // simple placeholder
        template = template.replaceAll(this.tagReg, (tag, key) => {
            let value = get(context, key);
            if(typeof value === 'string') {
                return value;
            } else if (typeof value === 'function') {
                return value();
            } else {
                return value ? value.toString() : '';
            }
        });

        // function with params
        template = template.replaceAll(this.tagFuncReg, (tag, key, strParams) => {
            let func = get(context, key);
            if(typeof func === 'function') {
                return func(this.parseFunctionParams(strParams));
            } else {
                return '';
            }
        });

        return template;
    }

    render(template, context) {

        return this.parseSections(template, context);

    }

}

module.exports = Listok;