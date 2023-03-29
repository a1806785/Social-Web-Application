var container = document.getElementById('container1');

function active() {
    container.classList.add('right-panel-active');
}

function remove() {
    container.classList.remove('right-panel-active');
}

var all_psw = document.querySelector(".container1");

function show_hide(input, icon) {
    if (input.type === "password") {
        input.type = "text";
    } else {
        input.type = "password";
    }
    icon.classList.toggle('fa-eye-slash');
}

container.addEventListener("click", event => {
    if (event.target.matches(".fa-eye")) {
        let icon_elm = event.target;
        let input_elm = icon_elm.previousElementSibling;
        show_hide(input_elm, icon_elm);
    }
});

var psw = document.getElementById("psw");
var confirm_psw = document.getElementById("confirm_psw");

function verify_password() {
    if (psw.value != confirm_psw.value) {
        confirm_psw.setCustomValidity("Password don't match");
    } else {
        confirm_psw.setCustomValidity('');
    }
}

psw.onchange = verify_password;
confirm_psw.onkeyup = verify_password;

// sign in
function sign_in() {
    let user = {
        username: document.getElementsByName("username")[1].value,
        password: document.getElementsByName("password")[1].value
    };

    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let receive = this.responseText;
            if (receive === 'normal') {
                window.location.href = "../index.html";
            } else {
                window.location.href = "../admin.html";
            }
        } else if (this.readyState == 4 && this.status >= 400) {
            alert("Sign in fail");
        }
    };

    xhttp.open("POST", "/sign_in");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(user));
}

// sign up
function sign_up() {

    let user = {
        username: document.getElementsByName('username')[0].value,
        email: document.getElementsByName('email')[0].value,
        password: document.getElementsByName('password')[0].value
    };

    if (user.username === '') {
        alert("Please enter your Username");
        return;
    } else if (user.email === '') {
        alert("Please enter your Email");
        return;
    } else if (user.password === '') {
        alert("Please enter your Password");
        return;
    }

    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            window.location.href = "../index.html";
        } else if (this.readyState == 4 && this.status == 409) {
            alert("The Username already exists, please change your Username.");
        }
    };

    xhttp.open("POST", "/sign_up");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(user));

}