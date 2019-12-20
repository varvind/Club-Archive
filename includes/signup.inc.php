<?php
        $dbServerName = "localhost";
        $dbUserName = "root";
        $dbPassword = "";
        $dbName = "clubarchiveusers";
        
        
        
        
        $conn = mysqli_connect($dbServerName, $dbUserName, $dbPassword , $dbName );
        $firstName = hash('sha256',$_POST['fname']);
        $lastName = hash('sha256', $_POST['lname']);
        $email = hash('sha256', $_POST['email']); 
        $userName =hash('sha256', $_POST['uname']);
        $pass = hash('sha256', $post['pwd']);
        $sql = "INSERT INTO users (first_name, last_name, email, username, pwd) VALUES ('$firstName', '$lastName', '$email', '$userName', '$pass');";
        mysqli_query($conn, $sql);

        header("Location: ../index.html?signup=success");
?>