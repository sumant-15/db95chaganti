var express = require('express'); 
var router = express.Router(); 
 
// Require controller modules. 
var costume_controller = require('../controllers/costume'); 

const secured = (req, res, next) => { 
    if (req.user){ 
      return next(); 
    } 
    req.session.returnTo = req.originalUrl; 
    res.redirect("/login"); 
  }
  

router.get('/', costume_controller.costume_view_all_Page)

router.get('/detail', costume_controller.costume_view_one_Page); 

router.get('/create', secured,costume_controller.costume_create_Page); 
 
router.get('/update', secured,costume_controller.costume_update_Page);

router.get('/delete', secured,costume_controller.costume_delete_Page); 

module.exports = router; 