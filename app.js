const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://0.0.0.0:27017/wikiDB");

const articleSchema = new mongoose.Schema({
    title : String,
    content: String
    // 
});

const Article = mongoose.model("Article", articleSchema);

/* Request for all articles */
app.route("/articles")
    .get((req, res) => {
        Article.find()
            .then((foundArticles) =>{
                res.send(foundArticles);
        })
        .catch((error) => {res.send("Error : ", error)});
       
        
    })
    .post((req, res) => {

        const newArticle = new Article({
            title : req.body.title,
            content : req.body.content 
        });
    
        newArticle.save()
            .then((savedArticle)=>{
                const r1= savedArticle;
                const r2 = "Sucessfully Saved";
                res.send([r1, r2]);
    
            })
            .catch((error)=>{
                res.send(error);
            })
    })
    .delete((req, res)=>{
        Article.deleteMany()
            .then((deleted)=>{
                res.send("Sucessfully Deleted");
            })
            .catch((error)=>{
                res.send(error);
            })
    });

/* Request for specific articles */

app.route("/articles/:articleTitle")
    .get((req, res)=>{
        Article.findOne({ title : req.params.articleTitle})
            .then((foundArticle)=>{
                res.send(foundArticle);
            })
            .catch((error)=>{
                res.send(error);
            });
    })
    .put((req, res)=>{
        Article.findOneAndUpdate(
            {title : req.params.articleTitle},
           {$set: {title : req.body.title, content : req.body.content}},
            {new : true}
            )
            .then(()=>{
                res.send("Updated Sucessfully");
            })
            .catch((error)=>{
                res.send(error);
            })
    })
    .patch((req, res)=>{
        Article.findOneAndUpdate({title : req.params.articleTitle},
            {$set : req.body},
            {new : true})
            .then(()=>{
                res.send("Sucessfully Updated");
            })
            .catch((error)=>{
                res.send(error);
            })
    })
    .delete((req, res)=>{
        Article.deleteOne({title: req.params.articleTitle})
            .then((foundArticle)=>{
                const r1 = foundArticle;
                const r2 = "Sucessfully Deleted the Article"
                res.send([r1, r2]);
            })
            .catch((error)=>{
                res.send(error);
            });
    });

const port = 3000;

app.listen(port, (req, res)=>{
    console.log("Server Started");
});