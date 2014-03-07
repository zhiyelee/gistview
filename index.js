var request = require('request');
var utils = require('./lib/utils');
var path = require('path');

var express = require('express');
var app = express();
app.use(function(req, res, next){
    res.setHeader( 'X-Powered-By', 'Nodejs' );
    next();
});

app.use(express.compress());
app.set('view engine', 'jade');
app.use(express.static(__dirname + "/static"));


var siteConfig = utils.loadConfig();
var marked = utils.getMarked();

app.get('/:gistid([0-9a-zA-Z]*)', function(req, res){
    var gistId = req.params.gistid;
    var gistInfoDefer = utils.fetchGistInfo(gistId);
    gistInfoDefer.promise.then(function (gistInfo) {
        var mdFiles = [];
        var gistFiles = gistInfo.files;

        // when provided invalid gist id, user property is `null`
        if (gistInfo.user) {
            Object.keys(gistFiles).map(function(f) {
                var ext = path.extname(f);
                var file = gistFiles[f];
                if (ext === '.md' || ext === '.markdown') {
                    file.html = marked(file.content);
                    mdFiles.push(file);
                }
            });
        }
        res.render('gist', {
            gistUrl: gistInfo['html_url'],
            gistId: gistInfo['id'],
            title: gistInfo['description'],
            files: mdFiles
        });
    });
});

app.get('*', function(req, res){
    res.render('index', {
        siteUrl: siteConfig.siteUrl,
        title: 'gist view - by @zhiyelee'
    });
});

app.listen(siteConfig.port);
