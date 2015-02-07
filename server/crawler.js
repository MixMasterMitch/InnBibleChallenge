var Crawler = require("crawler").Crawler;
var fs = require('fs');

if (!fs.existsSync('./scripture')) {
    fs.mkdirSync('./scripture');
}

if (!fs.existsSync('./scripture/niv')) {
    fs.mkdirSync('./scripture/niv');
}

if (!fs.existsSync('./scripture/theMessage')) {
    fs.mkdirSync('./scripture/theMessage');
}

var queries = [];
for (var i = 2; i < process.argv.length; i++) {
    var query = process.argv[i];
    queries.push({
        uri : 'https://www.biblegateway.com/passage/?search=' + query + '&version=NIV',
        query : query,
        callback : function(error, result, $) {
            var niv = $(".result-text-style-normal");
            niv.find('h1').remove();
            niv.find('.footnotes').remove();
            niv.find('.crossrefs').remove();
            niv.find('sup.footnote').remove();
            writeFile(niv.html(), 'niv', this.query);
        }
    });
    queries.push({
        uri : 'https://www.biblegateway.com/passage/?search=' + query + '&version=MSG',
        query : query,
        callback : function(error, result, $) {
            var message = $(".result-text-style-normal");
            message.find('h1').remove();
            writeFile(message.html(), 'theMessage', this.query);
        }
    });
}
var crawler = new Crawler({});
crawler.queue(queries);
var writeFile = function(text, version, query) {
    fs.writeFileSync('../scripture/' + version + '/' + query + '.html', text);
};