var express = require('express');
var mongoose = require('mongoose');
var _ = require('underscore');
var Movie = require('./models/movie');
var logger = require('morgan');
var bodyParser = require('body-parser');
var port = process.env.PORT || 3000;
var path = require('path');
var app = express();
var db = mongoose.connect('mongodb://127.0.0.1:27017/hu');
// db.connection.on('error', function(error) {
//     console.log("wocaoni");
// })


app.set('views', './views/pages');
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')))
app.locals.moment = require('moment');
app.listen(port);
console.log("port is:" + port);
//首页
app.get('/', function(req, res) {
        Movie.fetch(function(err, movies) {
            if (err)
                console.log(err)
            res.render('index', {
                title: "imooc 首页",
                movies: movies
            })

        })

    })
    //电影详情
app.get('/movies/:id', function(req, res) {
        var id = req.params.id;
        Movie.findById(id, function(err, movie) {
            res.render('detail', {
                title: "imooc" + movie.title,
                movie: movie
            })

        })

    })
    //输入电影
app.get('/admin/movie', function(req, res) {
        res.render('admin', {
            title: "imooc 后台录入页",
            movie: {
                title: '',
                doctor: '',
                country: '',
                year: '',
                poster: '',
                flash: '',
                summary: '',
                language: ''
            }

        })
    })
    //admin update movie
app.get('/admin/update/:id', function(req, res) {
        var id = req.params.id;

        if (id) {
            Movie.findById(id, function(err, movie) {
                res.render('admin', {
                    title: 'imooc 后台更新页',
                    movie: movie
                })
            })
        }
    })
    //admin post moive
app.post('/admin/movie/new', function(req, res) {
    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    var _moive;
    if (id !== 'undefined') {
        Movie.findById(id, function(err, moive) {
            if (err) {
                console.log(err);
            }
            _moive = _.extend(moive, movieObj);
            _moive.save(function(err, movie) {
                if (err)
                    console.log(err)
                res.redirect('/movies/' + movie._id)
            })
        })
    } else {
        _moive = new Movie({
            doctor: movieObj.doctor,
            title: movieObj.title,
            country: movieObj.country,
            language: movieObj.language,
            year: movieObj.year,
            poster: movieObj.poster,
            summary: movieObj.summary,
            flash: movieObj.flash
        })
        _moive.save(function(err, movie) {
            if (err)
                console.log(err)
            res.redirect('/movies/' + movie._id)
        })
    }
})

//list page
app.get('/admin/list', function(req, res) {
        Movie.fetch(function(err, movies) {
            res.render('list', {
                title: "imooc 列表",
                movies: movies
            })
        })

    })
    //list delete movie
app.delete('/admin/list', function(req, res) {
    var id = req.query.id
    console.log(id)
    if (id) {
        Movie.remove({ _id: id }, function(err, movie) {
            if (err) {
                console.log(err)
            } else {
                res.json({ success: 1 })
            }
        })
    }
})
