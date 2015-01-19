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
  var $node = $("#boards-container .boards ul");
  boards = boards.filter(function(b) { console.log(b); return b.name !== "Welcome Board" })
  boards.map(function(b) { b.url = "https://trello.com/b/" + b.id; })
  $node
    .loadTemplate($("#board-template"), boards)
    .find("input[type=checkbox]")
    .on("click", getLists);
}

var getLists = function(){
  var bid = $(this).data("bid");
  var checked = $(this)[0].checked;

  $(".board[data-bid=" + bid + "] .lists")[ checked ? "show" : "fadeOut"]();
  var isLoaded = $(this).data("loaded");

  if(isLoaded) {
    return;
  } else {
    $(this).attr("data-loaded", true);
  }

  var $self = $(this);

  Trello.boards.get(bid, {"cards": "all", "lists": "all", "members": "all"}, function(res) {
    console.log(bid, res);
    var cards = res.cards
    , lists = res.lists
    , members = res.members;

    objMembers = {};
    members.forEach(function(member) {
      objMembers[member.id] = member;
    });

    // closedになっているlistは除外してから表示
    lists = lists.filter(function(list) { return list.closed ? null : list });
    $(".board[data-bid=" + bid + "] .lists ul").loadTemplate($("#list-template"), lists);

    // listId毎にcardsを整形する
    var objCards = {};
    cards.forEach(function(card) {
      var lid = card.idList;
      if(!objCards[lid]) objCards[lid] = [];
      card.mids = card.idMembers.join(",");
      objCards[lid].push(card);
    });
    console.log(objCards);

    // cardを表示する
    for(var lid in objCards) if( objCards.hasOwnProperty(lid) ) {
      var cards = objCards[lid];

      $(".board[data-bid=" + bid + "] .list[data-lid=" + lid + "] .cards ul")
        .loadTemplate($("#card-template"), cards);
    }

    // cardのassignメンバーを表示する（これだけ、template使うとつらそうなので、やめるぽ
    $(".board[data-bid=" + bid + "] .members").each(function(ev) {
      var mids = $(this).data("mids").split(",");
      var $self = $(this);
      mids.forEach(function(mid) {
        if(mid && objMembers[mid]) {
          var iconurl = [ "https://trello-avatars.s3.amazonaws.com/" , objMembers[mid].avatarHash , "/30.png" ].join("");
          $("<img>").attr("src", iconurl).appendTo($self);
        }
      });
    });
  }, function(err) {
    $self.attr("data-loaded", false);
    throw err;
  });
}

var showLists = function(lists) {
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
