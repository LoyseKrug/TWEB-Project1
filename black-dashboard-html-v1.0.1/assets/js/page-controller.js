
let i = 0;

pageController = {

    

    /**
     * This function is called at the beginning or when the logout button is pressed
     */
    displayLogin: function() {
        //hide the following elements 
        document.getElementById("login-loading").style.display = "none";
        document.getElementById("repository-choice").style.display = "none"; 
        document.getElementById("clash-of-issues-chart").style.display = "none"; 
        document.getElementById("clash-of-commit-chart").style.display = "none"; 
        document.getElementById("clash-of-lines-chart").style.display = "none"; 
        document.getElementById("menu-logout").style.display = "none"; 

        //show the following elements
        document.getElementById("login").style.display = "block"; 
        document.getElementById("login-button").style.display = "block";   
    },

    /**
     * That function is called when the user press the login button, during the process of login with gituhub
     */
    displayLoginLoading: function()  {
        //show the following elements
        document.getElementById("login-loading").style.display = "block";
    },

    displayRepos: function(){
        //hide the following elements
        document.getElementById("login").style.display = "none"; 

        //show the following elements 
        document.getElementById("repository-choice").style.display = "block"; 
        document.getElementById("clash-of-issues-chart").style.display = "block"; 
        document.getElementById("clash-of-commit-chart").style.display = "block"; 
        document.getElementById("clash-of-lines-chart").style.display = "block"; 
        document.getElementById("menu-logout").style.display = "block"; 
    },

    playfunctions: function(){
        if(i % 3 == 0){
            displayLogin();
        }else if(i % 3 == 1){
            displayLoginLoading();
        } else {
            displayRepos();
        }
        ++i;
    },

};

