(function(t){
    var plugin = function() {

        this.name = 'template';

        /**
         * Set to true if you want to be assigned a canvas 2d context to make a graph with
         * @type {boolean}
         */
        this.useGraph = false;

        /**
         * Plugin configuration
         */
        this.config = null;

        /**
         * Called before any data is fed to the plugin
         */
        this.before = function(c) {

        }

        /**
         * Receives all data at once
         */
        this.global = function(data, c) {

        }

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