$(document).ready(function(){

  $("#suggestBook").click(function(){
    $(".centerPanel").toggle();
  })
  google.books.load();
  function initialize(){
    var viewer = new google.books.DefaultViewer(document.getElementById('viewerCanvas'));
    viewer.load("ISBN:0738531367");
  }

  google.books.setOnLoadCallback(initialize);

  $("#searchbar").on("keydown", function(event){
    var keyPress;
    if(window.event){
      keyPress = event.which;
    }else{
      keyPress = event.keyCode;
    }

    if(keyPress == 13){
      var input = $("#searchbar").val();
      $("#bookList").empty();
      displayResults(input);
    }

  })

  $(".exitButton").click(function(){
    $(".centerPanel").toggle();
  })

})

var displayResults = function(input){
  $.ajax({
    url: "https://www.googleapis.com/books/v1/volumes?q=" + input,
    datatype: "json",
    success: function(data){
      var resultLimit = 20;
      if(resultLimit > data.items.length){
        resultLimit = data.items.length;
      }
      console.log("result limit is " + resultLimit);
      for(var i=0; i<resultLimit; i++){
        $("#bookList").append("<li>" + data.items[i].volumeInfo.title + " by " + data.items[i].volumeInfo.authors[0] + "</li>");
      }
    },
    type: 'GET'

  })
  console.log(input);
}
