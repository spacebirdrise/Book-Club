$(document).ready(function(){
  $("#login").click(function(){
    var userName = $("#usernameInput").val();
    var password = $("#passwordInput").val();

    console.log(userName + " " + password);
    //Check if input exists
    if(userName == "" || userName == undefined || password == "" || password == undefined){
      $(".invalidInputHolder").text("Invalid username or password");
    }else{
      //If input exists, make ajax post to our url/login.
      $.ajax({
        type: "POST",
        url: "http://localhost:3000/login",
        data: {'username': userName, 'password': password},
        success: loginHandler,
        error: errorHandler
      });
    }


    //window.location = "html/main.html";
  })

  //listen for going to sign up page.
  $("#signUp").click(function(){
    window.location = "html/userRegistration.html";
  })
})

//Define function to handle successful login.
var loginHandler = function(result, status, xhr){
  if(xhr.status == 200){
    $(".invalidInputHolder").text("status 200, we were successful!");
  }else{

    $(".invalidInputHolder").text("status is " + status);
  }
}

//Define function to handle unsuccessful login
var errorHandler = function(xhr, status, error){
  if(xhr.status == 400){
      $(".invalidInputHolder").text("Undefined input for username/password");
  }else{
      $(".invalidInputHolder").text("Username/password not found")
  }

}
