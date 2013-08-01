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
        'linecount',
        'wordcount',
        'tweetsource',
        'swears',
        'hashtagusage',
        'linktypes',
        'tweettimes'
    ];

    var pluginCount = pluginsToLoad.length;
    var pluginsLoaded = 0;

    var tweet_data = null;

    var ready = false;

    var $drop = document.getElementById('drop');

    function log(msg, noNewline) {
        //console.log(msg);
        document.getElementById('output').innerHTML += msg;
        if(!noNewline) {
            document.getElementById('output').innerHTML += '<br />';
        }
    }

    function err(msg) {
        // todo ... something
    }

    function main() {
        var i, j, k, l;

        var start = new Date().getTime();

        document.getElementById('output').innerHTML = '';

        log('Executing '+pluginCount+' plugins');
        log('');

        for(i=0,j=plugins.length;i<j; i++) {
            if(plugins[i].useGraph) {
                document.getElementById('graph_output').style.display='block';
                document.getElementById('graph_output').previousElementSibling.style.display='block';

                // clear plugin canvas
                plugins[i].graphContext.canvas.width = plugins[i].graphContext.canvas.width;

                var nextOfKin = plugins[i].graphContext.canvas.nextSibling;
                while(nextOfKin) {
                    var next = nextOfKin.nextSibling;
                    nextOfKin.parentNode.removeChild(nextOfKin);
                    nextOfKin = next;
                }
            }

            plugins[i].before(c);
            plugins[i].global(tweet_data, c);
        }
        for(i=1,j=tweet_data.length;i<j;i++) {
            for(k=0,l=plugins.length;k<l; k++) {
                plugins[k].during(tweet_data[i], c);
            }
        }
        for(i=0,j=plugins.length;i<j; i++) {
            log('Plugin '+plugins[i].name+':');
            plugins[i].after(c);
            log('');
        }

        var end = new Date().getTime();
        var time = end - start;
        log('Total plugin execution time: ' + time + 'ms');
    }

    function hookPlugin(plug) {
        plugins.push(plug);
    }

    function loadPlugins() {
        log('Loading plugins');
        for(var i=0; i<pluginCount; i++) {
            log('Loading plugin "'+pluginsToLoad[i]+'" ('+(i+1)+'/'+pluginCount+')');
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = 'src/plugins/'+pluginsToLoad[i]+'.js';
            script.onload = scriptOnload;
            var tag = document.getElementsByTagName('script')[0];
            tag.parentNode.insertBefore(script, tag);
        }
    }

    function scriptOnload() {
        ready = (++pluginsLoaded == pluginCount);
        if(ready) {
            log('All plugins loaded');
            initPlugins();
        }
    }

    function initPlugins() {
        var confAnchor = document.getElementById('config_anchor');
        var outputAnchor = document.getElementById('output_anchor');

        for(var i = 0, j=plugins.length; i<j; i++) {
            log('Initializing plugin "'+plugins[i].name+'"... ', true);
            if(plugins[i].config) {
                var element = document.createElement('div');
                element.className = 'config_element';
                document.getElementById('config_area').style.display='block';
                document.getElementById('config_area').previousElementSibling.style.display='block';

                for (var item in plugins[i].config) {
                    var configInput = document.createElement('input');
                    configInput.type = plugins[i].config[item].type;
                    configInput.value = plugins[i].config[item].value;
                    configInput.id = 'plugin_'+i+'_config_'+item;
                    configInput.onchange = (function(plugin, configItem){
                        return function(){
                            plugin.config[configItem].value = this.value;
                        }
                    })(plugins[i],item);
                    var label = document.createElement('label');
                    label.innerHTML = plugins[i].config[item].label;
                    label.htmlFor = configInput.id;
                    var title = document.createElement('span');
                    title.style.fontWeight = 'bold';
                    title.innerHTML = plugins[i].name;
                    element.appendChild(title);
                    element.appendChild(document.createElement('br'));
                    element.appendChild(configInput);
                    element.appendChild(label);
                    element.appendChild(document.createElement('br'));
                }

                confAnchor.parentNode.insertBefore(element,confAnchor);
            }
            if(plugins[i].useGraph) {
                element = document.createElement('div');
                element.className = 'output_element';
                var canvas = document.createElement('canvas');
                canvas.width = canvas.height = '500';
                element.appendChild(canvas);
                outputAnchor.parentNode.insertBefore(element,outputAnchor);
                var context = canvas.getContext('2d');
                plugins[i].graphContext = context;
            }
            log('done');
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

        $drop.removeEventListener('drop', drop);
        $drop.removeEventListener('dragover', dragOver);

        var file = event.dataTransfer.files[0];

        var fileReader = new FileReader();

        fileReader.onload = function(readEvent) {
            tweet_data = parser.csv.toArrays(readEvent.target.result);
            $drop.innerHTML = 'Now click here to start GRINDING';
            $drop.addEventListener('click', main);
        };

        fileReader.readAsText(file);
    }

    function dragOver(e){
        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer.dropEffect='copy';
    }

    function init() {
        loadPlugins();

        $drop.addEventListener('drop', drop, false);
        $drop.addEventListener('dragover', dragOver, false);
    }

    var exports = {
        'hookPlugin': hookPlugin,
        'init': init,
        'log' : log,
        'pluginPrototype' : {
            name:'',
            before:function(){},
            global:function(){},
            during:function(){},
            after:function(){},
            useGraph:false,
            graphContext:null,
            config:null
        }
    }

    return exports;
})();

tweetgrinder.init();