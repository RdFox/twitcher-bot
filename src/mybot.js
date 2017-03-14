// Dependencies =========================
var twit = require('twit');
var ura = require('unique-random-array');
var config = require('./config');
var strings = require('./helpers/strings');
var username = "RealRotfuks";

var Twitter = new twit(config);

// Frequency in minutes
var retweetFrequency = 1;

// RANDOM QUERY STRING  =========================

var randomSearchQuery = ura(strings.queryString);
var randomResultType = ura(strings.resultType);
var rs = ura(strings.responseString);

var tweetWithRandomQuery = function() {
    var query = randomSearchQuery();
    var resultType = randomResultType();
    var params = {
        q: query + formattedBlockedWords(),
        result_type: resultType,
        count: 100,
        lang: 'en'
    };
    return Twitter.get('search/tweets', params, function(err, data) {
        if (!err) {
            try {
                console.log(query + " ~~ " + data.statuses.length);
                // try get tweet id, derp if not
                retweetNow(random(data.statuses).id_str, query);
            } catch (e) {
                console.log('retweetId of ' + query + ' DERPED BADLY!', 'Error is: ', e.message);
            }
        }
        // if unable to Search a tweet
        else {
            console.log('Even Unicorns cry sometimes because of ' + query, 'Error is: ' + err)
        }
    });
};

// returns an array of ids from users specific User follows
var friendsList = function () {
   Twitter.get('friends/ids', { screen_name: username }).then(function (err, data, response) {
        if (!err) {
            return data.ids;
        } else {
            console.log('I think ' + username + ' has no friends :( ', 'Error is: ' + err);
        }
    })
};

var retweetFromFriend = function(userId) {
    var params = {
        user_id: userId,
        exclude_replies: true,
        include_rts: false
    };
    Twitter.get('statuses/user_timeline', params,  function (err, data, response) {
        if (!err) {
             data.ids;
        } else {
            console.log('I think ' + username + ' has no friends :( ', 'Error is: ' + err);
        }
    })
};




console.log(tweetWithRandomQuery());



function retweetNow(retweetId, query) {
    // Tell TWITTER to retweet
    Twitter.post('statuses/retweet/:id', {
        id: retweetId
    }, function(err, response) {
        if (response) {
            console.log('You did it! RETWEETED some s*it with ' + query + '!')
        }
        // if there was an error while tweeting
        if (err) {
            console.log('Argh! What is wrong with you, ', query, '? Maybe: ',  err)
        }
    });
}


function tweetNow(tweetTxt) {
    var tweet = {
        status: tweetTxt
    };

    // HARCODE user name in and check before RT
    var n = tweetTxt.search(/@RealRotfuks/i)

    if (n != -1) {
        console.log('TWEET SELF! Skipped!!')
    }
    else {
        Twitter.post('statuses/update', tweet, function(err, data, response) {
            if (err) {
                console.log('Cannot Reply to Follower. ERROR!: ' + err)
            }
            else {
                console.log('Reply to follower. SUCCESS!')
            }
        })
    }
}



// function to generate a random tweet tweet
function random(arr) {
    var index = Math.floor(Math.random() * arr.length);
    return arr[index];
}

function formattedBlockedWords() {
    var ret = '',
        arr = strings.blockedStrings,
        i, n;
    for (i = 0, n = arr.length; i < n; i++) {
        ret += ' -' + arr[i];
    }
    return ret;
}

