var request = require('request');
var when = require('when');
var hljs = require('highlight.js');
var yaml = require('js-yaml');
var fs = require('fs');
var path = require('path');

var configFilePath = path.resolve('config/conf.yml');
exports.loadConfig = function() {
    return yaml.load(fs.readFileSync(configFilePath, 'utf8'));
};
exports.fetchGistInfo = function(gistId) {
    var deferred = when.defer();
    var options = {
            url: 'https://api.github.com/gists/' + gistId,
            headers: {
                'User-Agent': 'request'
            }
    };
    var gistInfo;
    request.get(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
             gistInfo = JSON.parse(body);
             deferred.resolve(gistInfo);
        }

        if (error) {
            deferred.reject(error);
        }
    });

    return deferred;
};

exports.highlight = function(code, lang) {
    var o;

    if(lang == 'js') {
        lang = 'javascript';
    } else if (lang == 'html') {
        lang = 'xml';
    }

    hljs.configure({ classPrefix: '' });
    if(lang){
        o = hljs.highlight(lang, code);
    } else {
        o = hljs.highlightAuto(code).value;
    }
    var html = o.value;
    if(html){
        return html;
    } else {
        return code;
    }
};

var marked = require('marked');
exports.getMarked = function() {
    // set default marked opt
    marked.setOptions({
        gfm: true,
        tables: true,
        breaks: true,
        pedantic: false,
        sanitize: false,
        smartLists: true,
        langPrefix: '',
        highlight: this.highlight
    });
    return marked;
}
