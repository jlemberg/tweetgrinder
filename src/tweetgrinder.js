var tweetgrinder = (function() {

    /**
     * Twitter-CSV-Constants
     */
    var c =
    {
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


    /**
     * Plugins
     */
    var pluginsToLoad =
    [
        'linecount',
        'wordcount',
        'tweetsource',
        'swears',
        'hashtagusage',
        'linktypes',
        'tweettimes'
    ];

    var plugins = [];
    var pluginCount = pluginsToLoad.length;
    var pluginsLoaded = 0;
    var allPluginsLoaded = false;

    /**
     * Parsed CSV-Array
     */
    var tweetData = null;


    /**
     * Commonly used elements
     */
    var $drop = $('#drop');
    var $output = $('#output');
    var $graphOutput = $('#graph_output');
    var $configArea = $('#config_area');


    /**
     * Main function
     */
    function grind()
    {
        var i, j, k, l;

        var start = new Date().getTime();

        $output.html('');

        log("Executing "+pluginCount+" plugins\n");

        for(i = 0, j = plugins.length; i < j; i++) {
            if(plugins[i].useGraph) {
                $graphOutput.css({ display: 'block' });
                $graphOutput.prev().css({ display: 'block' });

                plugins[i].graphContext.canvas.width = plugins[i].graphContext.canvas.width;

                $(plugins[i].graphContext.canvas.parentNode).children().not('canvas').remove();
            }

            plugins[i].before(c);
            plugins[i].global(tweetData, c);
        }
        for(i = 1, j = tweetData.length; i < j; i++) {
            for(k = 0, l = plugins.length; k < l; k++) {
                plugins[k].during(tweetData[i], c);
            }
        }
        for(i = 0, j = plugins.length; i < j; i++) {
            log('Plugin '+plugins[i].name+':');
            plugins[i].after(c);
            log('');
        }

        var end = new Date().getTime();
        var time = end - start;
        log('Total plugin execution time: ' + time + 'ms');
    }


    /**
     * Util functions
     */
    function log(msg, noNewline)
    {
        if(!noNewline) msg += '<br />';
        $output.append(msg);
    }


    /**
     * Plugin functions
     */
    function hookPlugin(plug)
    {
        plugins.push(plug);
    }

    function loadPlugins()
    {
        log('Loading plugins');
        for(var i = 0; i < pluginCount; i++) {
            log('Loading plugin "'+pluginsToLoad[i]+'" ('+(i+1)+'/'+pluginCount+')');
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = 'src/plugins/'+pluginsToLoad[i]+'.js';
            script.onload = scriptOnload;
            var tag = document.getElementsByTagName('script')[0];
            tag.parentNode.insertBefore(script, tag);
        }
    }

    function scriptOnload()
    {
        allPluginsLoaded = (++pluginsLoaded == pluginCount);
        if(allPluginsLoaded) {
            log('All plugins loaded');
            initPlugins();
        }
    }

    function initPlugins()
    {
        var $confAnchor = $('#config_anchor');
        var $outputAnchor = $('#output_anchor');

        for(var i = 0, j=plugins.length; i < j; i++) {
            log('Initializing plugin "'+plugins[i].name+'"... ', true);

            if(plugins[i].config) {
                var $element = $('<div class="config_element"></div>');
                $configArea.css({display:'block'});
                $configArea.prev().css({display:'block'});

                for (var item in plugins[i].config) {
                    var p = plugins[i].config[item];
                    var $configInput = $('<input type="'+ p.type+'" value="'+ p.value +'" id="plugin_'+i+'_config_'+item+'"/>');

                    $configInput.bind('change', (function(plugin, configItem){
                        return function(){
                            plugin.config[configItem].value = this.value;
                        }
                    })(plugins[i],item));

                    var $label = $('<label for="'+$configInput.attr('id')+'">'+ p.label +'</label>');
                    var $title = $('<span>'+plugins[i].name+'</span>');

                    $element.append($title)
                            .append('<br />')
                            .append($configInput)
                            .append($label)
                            .append('<br />');
                }

                $element.insertBefore($confAnchor);
            }
            if(plugins[i].useGraph) {
                $element = $('<div class="output_element"></div>');
                var $canvas = $('<canvas width="500" height="500"></canvas>')

                $element.append($canvas);
                $element.insertBefore($outputAnchor);
                var context = $canvas[0].getContext('2d');
                plugins[i].graphContext = context;
            }
            log('done');
        }
    }


    /**
     * Event listeners
     */
    function drop(event)
    {
        event.stopPropagation();
        event.preventDefault();

        originalEvent = event.originalEvent;

        if(originalEvent.dataTransfer.files.length > 1 || !allPluginsLoaded) {
            return;
        }

        $drop.unbind('drop', drop);
        $drop.unbind('dragover', dragOver);

        var file = originalEvent.dataTransfer.files[0];

        var fileReader = new FileReader();

        fileReader.onload = function(readEvent) {
            tweetData = $.csv.toArrays(readEvent.target.result);
            $drop.html('Now click here to start GRINDING');
            $drop.bind('click', grind);
        };

        fileReader.readAsText(file);
    }

    function dragOver(e)
    {
        e.stopPropagation();
        e.preventDefault();
        e.originalEvent.dataTransfer.dropEffect = 'copy';
    }


    /**
     * Init function
     */
    function init()
    {
        loadPlugins();

        $drop.bind('drop', drop);
        $drop.bind('dragover', dragOver);
    }


    /**
     * Public exports
     */
    var exports =
    {
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

$(document).ready(function(){tweetgrinder.init();})