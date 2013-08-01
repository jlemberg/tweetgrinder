(function(t){
    var plugin = function() {

        /**
         * Set to true if you want to be assigned a canvas 2d context to make a graph with
         * @type {boolean}
         */
        this.useGraph = true;

        /**
         * Plugin configuration
         */
        this.config = {
            word : {
                type : 'text',
                value : 'foo',
                label : 'text to search for'
            }
        };

        /**
         * Receives one line of data at a time
         */
        this.during = function(line, c) {

        }

        /**
         * Called after all data has been fed to the plugin
         */
        this.after = function(c) {

        }
    }

    plugin.prototype = t.pluginPrototype;
    t.hookPlugin(new plugin());
})(tweetgrinder)