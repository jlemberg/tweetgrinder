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
            var sort = [];
            for(var source in sources) {
                sort.push([source, sources[source]]);
            }
            sort.sort(function(a, b) { return a[1] - b[1]} );
            for(var i= 0, j=sort.length; i<j; i++) {
                t.log(sort[i][1] + ' tweet(s) from source "'+sort[i][0]+'"');
            }
        }
    }

    plugin.prototype = t.pluginPrototype;
    t.hookPlugin(new plugin());
})(tweetgrinder)