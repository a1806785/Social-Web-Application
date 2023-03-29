var app = new Vue({
    el: "#app",
    data: {
        event_active: false,
        sign_up_active: false,
        desc_active: false,
        start_time_input: '',
        end_time_input: '',
        name_input: '',
        desc_input: '',
        item_index: 0,
        delete_index: 0,
        event: [],
        delete_event_active: false,
        calender_active: false,
        list_active: false,
        info_active: false,
        modify_active: true,
        show_detail_active: false,
        // sign_in: false
        people_active: false,
        delete_people_active: false,
        delete_people_index: 0,
    },
    computed: {
        show_detail: function () {
            if (this.show_detail_active === true) {
                if (Object.keys(this.event).length != 0) {
                    return this.event[this.item_index].desc;
                }
            }
        },
        show_time_1: function () {
            if (Object.keys(this.event).length >= 1) {
                return this.event[(this.event).length - 1].start_time;
            }
        },
        show_name_1: function () {
            if (Object.keys(this.event).length >= 1) {
                return this.event[(this.event).length - 1].name;
            }
        },
        show_detail_1: function () {
            if (Object.keys(this.event).length >= 1) {
                return this.event[(this.event).length - 1].desc;
            }
        },
        show_time_2: function () {
            if (Object.keys(this.event).length >= 2) {
                return this.event[(this.event).length - 2].start_time;
            }
        },
        show_name_2: function () {
            if (Object.keys(this.event).length >= 2) {
                return this.event[(this.event).length - 2].name;
            }
        },
        show_detail_2: function () {
            if (Object.keys(this.event).length >= 2) {
                return this.event[(this.event).length - 2].desc;
            }
        },
    },
    methods: {
        link_to_sign_in: function () {
            window.location.href = "../sign_in.html";
        },
        add_event: function () {
            this.start_time_input = this.start_time_input.replace("T", " ");
            this.end_time_input = this.end_time_input.replace("T", " ");
            let send_flag = false;

            if (this.event.length === 0) {
                send_flag = true;
            } else {
                for (let i = 0; i < this.event.length; i++) {
                    if ((this.start_time_input >= this.event[i].start_time && this.end_time_input <= this.event[i].end_time) || (this.start_time_input >= this.event[i].start_time && this.start_time_input <= this.event[i].end_time) || (this.end_time_input >= this.event[i].start_time && this.end_time_input <= this.event[i].end_time)) {
                        send_flag = false;
                        alert("The time you entered conflicts with the existing event time, please change the event time");
                        break;
                    } else {
                        send_flag = true;
                    }
                }
            }

            if (send_flag === true) {
                this.event.push({ start_time: this.start_time_input, end_time: this.end_time_input, name: this.name_input, desc: this.desc_input });

                let last_event = { start_time: this.start_time_input, end_time: this.end_time_input, name: this.name_input, desc: this.desc_input };
                let xhttp = new XMLHttpRequest();

                xhttp.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {

                    }
                };

                xhttp.open("POST", "/event", true);
                xhttp.setRequestHeader("Content-type", "application/json");
                xhttp.send(JSON.stringify(last_event));

            }
        },
        delete_event: function () {
            let delete_event = { start_time: this.event[this.delete_index].start_time, end_time: this.event[this.delete_index].end_time, name: this.event[this.delete_index].name };
            this.event.splice(this.delete_index, 1);

            let xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {

                }
            };

            xhttp.open("POST", "/delete_event", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify(delete_event));
        },
        get_information: function () {
            let xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    let info = JSON.parse(this.responseText);
                    document.getElementsByClassName("user_info")[0].value = info.Username;
                    document.getElementsByClassName("user_info")[1].value = info.Email;
                    document.getElementsByClassName("user_info")[2].value = info.Password;
                }
            };

            xhttp.open("POST", "/user_information", true);
            xhttp.send();
        },
        add_people: function () {
            this.people_active = true;

            let xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    let people = JSON.parse(this.responseText);
                    let size = Object.keys(people).length;

                    let list = `<p class="people_text">Name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Email</p>`;
                    for (let i = 0; i < size; i++) {
                        list += `<li class="people_text">${people[i].Username}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${people[i].Email}</li>`;
                    }
                    document.getElementsByClassName("people")[0].innerHTML = list;
                }
            };

            xhttp.open("GET", "/people", true);
            xhttp.send();
        },
        popup_delete_people: function () {
            this.delete_people_active = true;

            let xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    let people = JSON.parse(this.responseText);
                    let size = Object.keys(people).length;

                    let list = `<p class="people_text">Name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Email</p>`;
                    for (let i = 0; i < size; i++) {
                        list += `<li class="people_text">${people[i].Username}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${people[i].Email}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button v-on:click="delete_people_index = i" onclick="delete_people(this)"}">Delete</button></li>`;
                    }
                    document.getElementsByClassName("people")[1].innerHTML = list;
                }
            };

            xhttp.open("GET", "/people", true);
            xhttp.send();
        },
        link_to_calendar: function () {
            window.location.href = "../calendar.html";
        }
    }
});

function show_hide(input, icon) {
    if (input.type === "password") {
        input.type = "text";
    } else {
        input.type = "password";
    }
    icon.classList.toggle('fa-eye-slash');
}

var main_class = document.querySelector(".main");

main_class.addEventListener("click", event => {
    if (event.target.matches(".fa-eye")) {
        let icon_elm = event.target;
        let input_elm = icon_elm.previousElementSibling;
        show_hide(input_elm, icon_elm);
    }
});

// var el;
function delete_people(x) {
    let delete_username = x.previousSibling.nodeValue.trim().split(/\s+/)[0];
    let delete_email = x.previousSibling.nodeValue.trim().split(/\s+/)[1];

    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            app.popup_delete_people();
        }
    };

    xhttp.open("POST", "/delete_people", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({ username: delete_username, email: delete_email }));
}

function show_event() {
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let arr = JSON.parse(this.responseText);
            let size = Object.keys(arr).length;

            for (let i = 0; i < size; i++) {
                app.event.push({ start_time: arr[i].Start_time, end_time: arr[i].End_time, name: arr[i].Event_name, desc: arr[i].Detail });
            }
        }
    };

    xhttp.open("GET", "/show_event", true);
    xhttp.send();
}