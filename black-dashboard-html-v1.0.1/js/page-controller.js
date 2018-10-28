
    /**
     * This function is called at the beginning or when the logout button is pressed
     */
    function displayLogin () {
        //hide the following elements 
        document.getElementById("login-loading").style.display = "none";
        document.getElementById("repository-choice").style.display = "none"; 
        document.getElementById("clash-of-issues-chart").style.display = "none"; 
        document.getElementById("clash-of-commit-chart").style.display = "none"; 
        document.getElementById("clash-of-lines-chart").style.display = "none"; 

        //show the following elements
        document.getElementById("login").style.display = "block"; 
        document.getElementById("login-button").style.display = "block";   
    };

    /**
     * That function is called when the user press the login button, during the process of login with gituhub
     */
    function displayLoginLoading()  {
        //show the following elements
        document.getElementById("login-loading").style.display = "block";
    };

    function displayRepos(){
        //show the following elements 
        document.getElementById("repository-choice").style.display = "block"; 
        document.getElementById("clash-of-issues-chart").style.display = "block"; 
        document.getElementById("clash-of-commit-chart").style.display = "block"; 
        document.getElementById("clash-of-lines-chart").style.display = "block"; 
    };



