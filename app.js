const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const expressSanitizer = require('express-sanitizer');
const express = require('express');
const app = express();


//----------------------------------------APP CONFIG----------------------------------------//


mongoose.connect('mongodb://localhost/restful_blog_app');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(expressSanitizer());



//----------------------------------------DATABASES----------------------------------------//


var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body:  String,
    created: {type: Date, default: Date.now}
});


var Blog = mongoose.model('Blog', blogSchema);


// Blog.create({
//     title: "Test Blog",
//     image: "https://www.oliverolaw.com/wp-content/uploads/2015/06/JPEG-Image-1240-%C3%97-775-pixels-Scaled-86-1200x750.jpeg?66ed9d&66ed9d",
//     body: "Just a quick front page blog preparation"
// });

//----------------------------------------ROUTING----------------------------------------//

app.get('/', (req, res)=> {
    res.redirect('/blogs');
});

//INDEX ROUTE
app.get('/blogs', (req, res)=> {
    Blog.find({}, (err, blogs)=> {
        if(err){
            console.log(err);
        }else{
            res.render('index', {blogs: blogs});
        };
    });
});

//NEW ROUTE
app.get('/blogs/new', (req,res)=> {
    res.render('new');
});

//CREATE ROUTE
app.post('/blogs', (req, res)=> {
    
    req.body.blog.body = req.sanitize(req.body.blog.body);
    
    Blog.create(req.body.blog, (err, newBlog)=> {
        if(err){
            console.log(err);
            res.render('new');
        } else{
            res.redirect('/blogs');
        };
    });
});

//SHOW ROUTE
app.get('/blogs/:id', (req, res)=> {
    Blog.findById(req.params.id, (err, foundBlog)=> {
        if(err){
            console.log(err);
            res.redirect('/blogs');
        } else{
            res.render('show', {blog: foundBlog});
        }
    });
});

//EDIT ROUTE
app.get('/blogs/:id/edit', (req, res)=> {
    Blog.findById(req.params.id, (err, foundBlog)=> {
        if(err){
            console.log(err);
            res.redirect('/blogs');
        } else{
            res.render('edit', {blog: foundBlog});
        }
    })
   
});

//UPDATE ROUTE
app.put('/blogs/:id', (req, res)=>{
    
    req.body.blog.body = req.sanitize(req.body.blog.body);
    
    Blog.findByIdAndUpdate(req.params.id, req.body.blog,(err, updatedBlog)=>{
        if(err){
            console.log(err);
            res.redirect('/blogs');
        } else{
            res.redirect('/blogs/' + req.params.id);   
        }
    });
});

//DELETE ROUTE
app.delete('/blogs/:id', (req, res)=> {
    Blog.findByIdAndRemove(req.params.id, (err)=> {
        if(err){
            console.log(err);
            res.redirect('/blogs');
        }else{
            res.redirect('/blogs');
        }
    });
});

app.listen(3000, ()=> {
    console.log('Server is listening...');
});