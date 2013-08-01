(function(t){
    var plugin = function() {

        this.name = 'Link types';

        var links;
        var linkTypes;
        var urlRegex = /\/\/.+?(?: |$)/;

        /**
         * Called before any data is fed to the plugin
         */
        this.before = function(c) {
            links={};
            linkTypes = [
                'youtube',
                'instagram',
                'twitter_picture',
                'twitpic',
                'imgur',
                'wikipedia',
                'vine'
            ];
            for(var i= 0,j=linkTypes.length;i<j;i++) {
                links[linkTypes[i]] = 0;
            }
        }

        /**
         * Receives one line of data at a time
         */
        this.during = function(line, c) {
            var text = line[c.text];
            if(text.indexOf('http://') == -1) return;
            if(text.indexOf('//t.co')) {
                text = line[c.expanded_urls];
                if(!text) return;
            }

            var match = text.match(urlRegex)[0];

            if(match.indexOf('youtube') != -1 || match.indexOf('youtu.be') != -1) {
                links.youtube++;
            } else if(match.indexOf('instagram') != -1) {
                links.instagram++;
            } else if(match.indexOf('twitter') != -1 && match.indexOf('/photo/') != -1) {
                links.twitter_picture++;
            } else if(match.indexOf('twitpic') != -1) {
                links.twitpic++;
            } else if(match.indexOf('imgur') != -1) {
                links.imgur++;
            } else if(match.indexOf('wikipedia') != -1) {
                links.wikipedia++;
            } else if(match.indexOf('vine.co') != -1) {
                links.vine++;
            }
        }

        /**
         * Called after all data has been fed to the plugin
         */
        this.after = function(c) {
            var sort = [];
            for(var link in links) {
                sort.push([link, links[link]]);
            }
            sort.sort(function(a, b) { return a[1] - b[1]} );
            for(var i= 0, j=sort.length; i<j; i++) {
                t.log('Link type "' + sort[i][0] + '" used '+sort[i][1]+' times');
            }
        }
    }

    plugin.prototype = t.pluginPrototype;
    t.hookPlugin(new plugin());
})(tweetgrinder)