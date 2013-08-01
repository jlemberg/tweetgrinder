(function(t){
    var plugin = function() {

        this.name = 'Hashtag usage';

        var hashtags;
        var hashtagRegex;

        this.useGraph = true;

        this.config = {
            minimumUsage : {
                type : 'text',
                value : 8,
                label : 'Min. amount of uses'
            }
        }

        function randCol() {
            return Math.ceil((Math.random()*255));
        }

        function labelSpan(label, color) {
            var s = document.createElement('span');
            s.style.color = color;
            s.style.fontWeight = 'bold';
            s.style.margin = '5px';
            s.innerHTML = label + ' ';
            return s;
        }

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
            var data = [];
            var outputDiv = this.graphContext.canvas.parentNode;
            outputDiv.appendChild(labelSpan(this.name+'<br />','#000'));
            for(var tag in hashtags) {
                if(hashtags[tag] < this.config.minimumUsage.value) continue;
                var dataColor = 'rgb('+randCol()+','+randCol()+','+randCol()+')';
                data.push({
                    value:hashtags[tag],
                    color:dataColor
                });
                outputDiv.appendChild(labelSpan(tag+'&nbsp;('+hashtags[tag]+')',dataColor));
            }

            new Chart(this.graphContext).Doughnut(data, {animation:false});
        }

    }

    plugin.prototype = t.pluginPrototype;
    t.hookPlugin(new plugin());
})(tweetgrinder)