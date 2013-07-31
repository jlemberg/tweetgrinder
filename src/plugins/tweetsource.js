(function(t){
    var plugin = function() {

        var sources;

        /**
         * Called before any data is fed to the plugin
         */
        this.before = function(c) {
            sources = {};
        }

        /**
         * Receives one line of data at a time
         */
        this.during = function(line, c) {
            var key = line[c.source].replace(/(<([^>]+)>)/ig,"");

            if(typeof(sources[key]) == 'undefined') {
                sources[key] = 1;
            } else {
                sources[key] ++;
            }
        }

        /**
         * Called after all data has been fed to the plugin
         */
        this.after = function(c) {
            for(var source in sources) {
                t.log(sources[source] + ' tweets from source ' + source);
            }
        }
    }

    plugin.prototype = t.pluginPrototype;
    t.hookPlugin(new plugin());
})(tweetgrinder)