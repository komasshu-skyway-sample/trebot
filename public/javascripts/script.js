/**
 * script.js
 *
 */


var onAuthorize = function(obj) {
  updateLoggedIn();
  Trello.members.get("me", { "boards": "all"}, function(member){
    console.log(member);
    var mesg = [ "Welcome, ", member.fullName, " !!"].join("");
    $("#logged-in .welcome").text(mesg);

    var iconurl = [ "https://trello-avatars.s3.amazonaws.com/" , member.avatarHash , "/30.png" ].join("");
    $("<img>").attr("src", iconurl).appendTo("#logged-in .welcome");

    showBoards(member.boards);

  });
}

var showBoards = function(boards) {
  console.log(boards);
  boards.map(function(b) { b.url = "https://trello.com/b/" + b.id; });
  $("#boards-container .boards ul").loadTemplate($("#board-template"), boards);
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
