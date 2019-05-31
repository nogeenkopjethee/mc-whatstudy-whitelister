
let input = document.getElementById("useful-input");
let button = document.getElementById("useful-button");
let statusText = document.getElementById('status-text');


/**
 * addButtonActions is an essential feature
 */
function addButtonActions() {


    input.addEventListener("keydown", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            input.disabled = true;
            getToken();
        }
    })
    button.addEventListener("click", function () {
        input.disabled = true;
        getToken();
    })
}

/**
 * Get token from Epic and call function tokenReceived when done
 * Due to CORS, there's no other way to get the token in vanilla JS.
 */
function getToken() {
    var s = document.createElement("script");
    s.src = "https://epic.clow.nl/token?callback=tokenReceived";
    document.body.appendChild(s);
}

/**
 * Determine whether a valid token or an error is received
 */
function tokenReceived(token) {
    // console.log('Token received:', token);
    if (token.error) {
        tokenError(token.error.message);
    } else {
        tokenSuccess(token);
    }
}

// Implement the following functions in your own code:

/**
 * When the token isn't fetched.
 * @param {string} message 
 */
function tokenError(message) {
    console.log(message);
    statusText.textContent = "Ben je ingelogd op EPIC? Token verkrijgen mislukt."
    statusText.style.color = "red";
    input.disabled = false
}

/**
 * When the token is fetched
 * @param {string} token The token
 */
function tokenSuccess(token) {
    console.log(token);
    statusText.textContent = "Laden...";
    statusText.style.color = "initial";
    register(token.token);
}


/**
 * The essential function to register.
 * @param {string} token The token
 */
function register(token) {
    fetch("https://tcarbonclocks.me/mcwsapi/add", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: input.value,
            token: token
        })
    })
        .then(function (response) {
            if (!response.ok) {
                statusText.textContent = "Er is een fout. Waarschijnlijk bent u al geregistreerd."
                statusText.style.color = "red";
                input.disabled = false
                throw Error(response.statusText);
            } else {
                return response.json();
            }
        }).then(function (json) {
            console.log(json);
            input.disabled = false;
            statusText.style.color = "green";
            statusText.textContent = "Succesvol geregisteerd!"
        })
        .catch(function (error) {
            console.log(error);
            statusText.textContent = "Er is een fout. Waarschijnlijk bent u al geregistreerd."
            statusText.style.color = "red";
            input.disabled = false
        })
};

addButtonActions();