var utils = require('./utils');
var path = require('path');

/**
 * pick out markdown files and compile the file
 *  content with `marked`
 */
function pickAndCompileFiles(gistFiles) {
    var res = [],
        marked = utils.getMarked();

    Object.keys(gistFiles).map(function(f) {
        var ext = path.extname(f);
        var file = gistFiles[f];
        if (ext === '.md' || ext === '.markdown') {
            file.html = marked(file.content);
            res.push(file);
        }
    });

    return res;
}

exports.init = function(app) {
    var siteConfig = utils.loadConfig();

    // gist page
    app.get('/:gistid([0-9a-zA-Z]*)', function(req, res) {
        var gistId = req.params.gistid;
        var gistInfoDefer = utils.fetchGistInfo(gistId);

        gistInfoDefer.promise.then(function (gistInfo) {
            var parmas = {};

            if (!Object.keys(gistInfo.files).length) {
                params.files = [];
            } else {
                params = {
                    gistUrl: gistInfo['html_url'],
                    gistId: gistInfo['id'],
                    // also used as page title
                    title: gistInfo['description'],
                    files: pickAndCompileFiles(gistInfo.files)
                };
            }

            res.render('gist', params);
        });
    });

    // default page
    app.get('*', function(req, res) {
        res.render('index', {
            siteUrl: siteConfig.siteUrl,
            title: 'gist view - view gist markdown files'
        });
    });
};
