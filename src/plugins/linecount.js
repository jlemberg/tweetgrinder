(function(t){
    var plugin = function() {

        /**
         * Receives all data at once
         */
        this.global = function(data, c) {
            t.log('Line count: ' + data.length);
        }
    }

    plugin.prototype = t.pluginPrototype;
    t.hookPlugin(new plugin());
})(tweetgrinder)