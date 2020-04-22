var express = require('express')
app = express();

app.set("view engine", "ejs")
app.set("views", __dirname);
app.use(express.static(__dirname));
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: false}))


app.get("/", function (req, res) {
    res.render('index');
    // res.send(__dirname)
})

app.post('/search', function (req, res) {
    var Twitter = require('twitter');
    var keyword = req.body.keyword;
    
    var client = new Twitter({
        consumer_key: process.env.CONS_KEY,
        consumer_secret: process.env.CONS_SECRET,
        access_token_key: process.env.ACCESS_KEY,
        access_token_secret: process.env.ACCESS_SECRET
    });

    var params = { q: keyword, count: 50, lang:'en' };

    client.get('search/tweets', params, function (error, tweets, response) {
        if (error) {
            res.send(error)
        }

        if (!error) {
            var data = []
            var images = []
            var names = []
            for (var k in tweets['statuses']) {
                if(tweets['statuses'][k]['user']["name"]!='Underline API'){
                data.push(tweets['statuses'][k]['text'])
                images.push(tweets['statuses'][k]['user']["profile_image_url_https"])
                names.push(tweets['statuses'][k]['user']["name"])
                }
            }
            res.render('tweets', { keyword:keyword, data: data, images: images, names: names })
            // res.send(images)
        }
    });

    // var data = ['aaa','bbb','ccc','ddd','eee']
    // var images = ['a.png','a.png','a.png','a.png','a.png']
    // var names = ['aaa','bbb','ccc','ddd','eee']
    // res.render('tweets', { data: data, images: images, names: names })

})


app.listen(8080, function () {
    console.log('server started');
});