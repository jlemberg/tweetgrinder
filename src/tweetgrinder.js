var tweetgrinder = (function() {

    var c = {
        tweet_id                    : 0,
        in_reply_to_status_id       : 1,
        in_reply_to_user_id         : 2,
        retweeted_status_id         : 3,
        retweeted_status_user_id    : 4,
        timestamp                   : 5,
        source                      : 6,
        text                        : 7,
        expanded_urls               : 8
    };

    var plugins = [];

    var pluginsToLoad = [
        ['Line count', 'linecount.js'],
        ['Word count', 'wordcount.js'],
        ['Tweet sources', 'tweetsource.js'],
        ['Swear words', 'swears.js'],
        ['Hashtag usage', 'hashtagusage.js'],
        ['Link types', 'linktypes.js']
    ];

    var pluginCount = pluginsToLoad.length;
    var pluginsLoaded = 0;

    var ready = false;

    var output = [];

    function log(msg) {
        //console.log(msg);
        output.push(msg);
    }

    function err(msg) {
        // todo ... something
    }

    function main(lines) {
        var i, j, k, l;

        var start = new Date().getTime();

        log('Executing '+pluginCount+' plugins');
        log('');

        for(i=0,j=plugins.length;i<j; i++) {
            plugins[i].before(c);
            plugins[i].global(lines, c);
        }
        for(i=1,j=lines.length;i<j;i++) {
            for(k=0,l=plugins.length;k<l; k++) {
                plugins[k].during(lines[i], c);
            }
        }
        for(i=0,j=plugins.length;i<j; i++) {
            plugins[i].after(c);
            log('');
        }

        var end = new Date().getTime();
        var time = end - start;
        log('Total plugin execution time: ' + time + 'ms');

        document.getElementById('output').innerHTML = output.join('<br />');
    }

    function hookPlugin(plug) {
        plugins.push(plug);
    }

    function loadPlugins() {
        log('Loading plugins');
        for(var i=0; i<pluginCount; i++) {
            log('Loading plugin "'+pluginsToLoad[i][0]+'" ('+(i+1)+'/'+pluginCount+')');
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = 'src/plugins/'+pluginsToLoad[i][1];
            script.onload = scriptOnload;
            document.getElementsByTagName('script')[0].insertBefore(script);
        }
    }

    function scriptOnload() {
        ready = (++pluginsLoaded == pluginCount);
        if(ready) {
            log('All plugins loaded');
            document.getElementById('output').innerHTML = output.join('<br />');
        }
    }

    function drop(event) {

        event.stopPropagation();
        event.preventDefault();

        if(event.dataTransfer.files.length > 1 || !ready) {
            // more than one file ain't supported, yo
            // todo error reporting and such
            return;
        }

        var file = event.dataTransfer.files[0];

        var fileReader = new FileReader();

        fileReader.onload = function(readEvent) {
            main((parser.csv.toArrays(readEvent.target.result)));
        };

        fileReader.readAsText(file);
    }

    function init() {
        loadPlugins();

        document.getElementById('drop').addEventListener('drop', drop, false);
        document.getElementById('drop').addEventListener('dragover', function(e){e.stopPropagation();e.preventDefault();e.dataTransfer.dropEffect='copy';}, false);
    }

    var exports = {
        'hookPlugin': hookPlugin,
        'init': init,
        'log' : log,
        'pluginPrototype' : {
            before:function(){},
            global:function(){},
            during:function(){},
            after:function(){}
        }
    }

    return exports;
})();

tweetgrinder.init();