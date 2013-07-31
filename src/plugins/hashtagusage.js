(function(t){
    var plugin = function() {

        var hashtags;
        var hashtagRegex;

        /**
         * Called before any data is fed to the plugin
         */
        this.before = function(c) {
            hashtags = {};
            hashtagRegex = /#[a-zA-Z0-9]+/g;
        }

        /**
         * Receives one line of data at a time
         */
        this.during = function(line, c) {
            var matches = line[c.text].match(hashtagRegex);
            if(!matches) return;

            for(var i= 0, j = matches.length;i<j;i++) {
                if( typeof(hashtags[matches[i]]) == 'undefined') {
                    hashtags[matches[i]] = 1;
                } else {
                    hashtags[matches[i]] ++;
                }
            }
        }

        /**
         * Called after all data has been fed to the plugin
         */
        this.after = function(c) {
            var sort = [];
            for(var tag in hashtags) {
                if(hashtags[tag] < 4) continue;
                sort.push([tag, hashtags[tag]]);
            }
            sort.sort(function(a, b) { return a[1] - b[1]} );
            for(var i= 0, j=sort.length; i<j; i++) {
                t.log('Hashtag ' + sort[i][0] + ' used '+sort[i][1]+' times');
            }
        }
    }

    plugin.prototype = t.pluginPrototype;
    t.hookPlugin(new plugin());
})(tweetgrinder)