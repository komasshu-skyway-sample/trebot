/**
 * script.js
 *
 */


var onAuthorize = function(obj) {
  updateLoggedIn();
  Trello.members.get("me", function(member){
    var mesg = [ "Welcome, ", member.fullName, " !!"].join("");
    $("#logged-in .welcome").text(mesg);

    var iconurl = [ "https://trello-avatars.s3.amazonaws.com/" , member.avatarHash , "/30.png" ].join("");
    $("<img>").attr("src", iconurl).appendTo("#logged-in .welcome");
        
  });
}


var logout = function() {
  Trello.deauthorize();
  updateLoggedIn();
};

var updateLoggedIn = function() {
  var isLoggedIn = Trello.authorized();
  $("#logged-in").toggle(isLoggedIn);
  $("#logged-out").toggle(!isLoggedIn);
}

Trello.authorize({
  interactive:false,
  success: onAuthorize
});
                          
$("#connect").click(function(){
   Trello.authorize({
     type: "popup",
     success: onAuthorize
   })
});
    
$("#disconnect").click(logout);
