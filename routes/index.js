module.exports = function Route(app){
  app.get('/', function(req, res){
    res.render('index');
  });
  var users = {}; // create an object to keep track of all the users
  app.post('/login', function(req, res){
    // console.log('POST INFO', req.body);  //notice that the post information is stored in req.body
    name = req.body.name; // assign the post data to a local variable
    req.session.name = name; // then add it to the session variable
    users[req.sessionID]={name:name}
    //unique sessionID for the user
    app.io.broadcast('new_user',{name:name});
    req.session.save(function(){ // save it to session
       res.redirect('/chat'); // redirect 
    });
  })
  app.get('/chat',function(req,res){
    res.render('chat',req.session);
  });
  app.io.route('umessage',function(req){
    var message = req.data.message;// get the message from the user so you can broadcast it to everyone
    var user = users[req.sessionID]; // when someone sends a message you get the id associated with it by looking into the array
    app.io.broadcast('chat',{new_message:message, user_data:user});
  })
  app.io.route('logoff',function(req,res){
    delete users[req.sessionID];
  });

  app.get('/log_off', function(req, res){
    res.redirect('/');
  })


}