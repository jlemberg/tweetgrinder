(function() {
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

    function drop(event) {
        event.stopPropagation();
        event.preventDefault();

        if(event.dataTransfer.files.length > 1) {
            // more than one file ain't supported, yo
            // todo error reporting and such
            return;
        }

        var file = event.dataTransfer.files[0];

        var fileReader = new FileReader();

        fileReader.onload = function(readEvent) {
            var content = readEvent.target.result;
            var result = parser.csv.toArrays(content);

            var totalLines = result.length;

            var filteredTweetCount = 0;
            var wordCount = 0;

            for(var i=0;i<totalLines;i++) {
                if(result[i][c.retweeted_status_id] != '') continue;
                filteredTweetCount++;

                wordCount += result[i][c.text].split(' ').length;
            }

            console.log(filteredTweetCount + ' out of ' + totalLines + ' "pure" tweets (retweets ignored)');
            console.log("word count: " + wordCount);
        };

        fileReader.readAsText(file);
    }

    document.getElementById('drop').addEventListener('drop', drop, false);
    document.getElementById('drop').addEventListener('dragover', function(e){e.stopPropagation();e.preventDefault();e.dataTransfer.dropEffect='copy';}, false);
})();