//jshint esversion:8

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");


const app = express();

mongoose.connect("mongodb+srv://krissdiamond:favour22@cluster0.tbgzn.mongodb.net/todolistDB", {useNewUrlParser: true});

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const itemsSchema = {
  name: String,
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item ({
  name: "Welcome to your todolist"
});

const item2 = new Item ({
  name: "Hit + button to add a new item"
});

const item3 = new Item ({
  name: "<--- Hit that button to delete an item"
});

const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);



app.get("/", function(req, res) {



  Item.find({}, function(err, foundItems){

    if(foundItems.length === 0){
      Item.insertMany(defaultItems, (err)=>{
        if (err){
          console.log(err);
        }else {
          console.log("Documents added successfully");
        };
      });
      res.redirect("/");
    } else {
      res.render("list", {
        listTitle: "Today",
          newListItems: foundItems,
      });
    }
  });

  app.get("/:customListName", (req, res)=>{
     const customListName = _.capitalize(req.params.customListName);


     List.findOne({name: customListName}, (err, foundlist)=>{
       if (!err){
         if(!foundlist){
           // create a new list
           const list = new List ({
             name: customListName,
             items: defaultItems
           });
           list.save();
           res.redirect("/" + customListName);
         } else{
           // Show an existing list
           res.render("list",{
             listTitle: foundlist.name,
               newListItems: foundlist.items,
           });
         }
       }
     });



  });

      app.post("/", function(req, res){
      const itemName =  req.body.newItem;
         const listName = req.body.list;

      const item = new Item ({
        name: itemName
      });

      if (listName === "Today"){
        item.save();
        res.redirect("/");
      } else {
        List.findOne({name: listName}, (err, foundlist)=>{
          foundlist.items.push(item);
          foundlist.save();
          res.redirect("/" + listName);
        });
      }
    });

    app.post("/delete", (req, res)=>{
      const checkedItemId = req.body.checkbox;
      const listName = req.body.listName;

      if(listName === "Today"){
        Item.findByIdAndRemove(checkedItemId, (err)=>{
          if (err){
            console.log(err);
          }else {
            console.log("Documents removed successfully");
            res.redirect("/");
          };
        });
      } else {
        List.findOneAndUpdate({name: listName}, {$pull: {items:{_id: checkedItemId}}}, (err, foundlist)=>{
          if (!err){
            res.redirect("/" + listName);
          }
        });
      }

    });



app.post("/work", function(req, res){
  let item = req.body.newItem;
  workItems.push(item);
  res.redirect("/work");
});

app.get("/about", function(req, res){
  res.render("about");
})

    });

    app.listen(3000, function() {
      console.log("Server is running on port 3000");
    });
