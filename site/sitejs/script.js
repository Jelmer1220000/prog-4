let loopcount = 0;
let apicount = 0;

document.addEventListener("animationiteration", () => {
    loopcount++;
    if (loopcount == 6){
   loop();
loopcount = 0;    
}
})

function loop() {
apicount = apicount + 1;
switch(apicount){
    case 1:
    displayName("GET /api/users")
    displayDescr("Retrieves all users in the Database")
    displayExample("No examples available for this GET request")
    break;
    case 2:
    displayName("GET /api/user/{id}")
    displayDescr("Retrieves specified user in the Database by ID")
    displayExample("/api/user/1")
    break;
    case 3:
    displayName("POST /api/user")
    displayDescr("Creates user in the Database")
    displayExample(`{firstName: "John", lastName: "Doe",street: "Lovendijkstraat 61",city: "Breda",isActive: true,emailAdress: "John.Doe@server.com",password: "secret",phoneNumber: "06-11223344",}`)
    break;
    case 4:
    displayName("PUT /api/user/{id}")
    displayDescr("Changes specified user in the Database")
    displayExample(`{firstName: "John", lastName: "Doe",street: "Lovendijkstraat 61",city: "Breda",isActive: true,emailAdress: "John.Doe@server.com",password: "secret",phoneNumber: "06-11223344",}`)
    break;
    case 5:
    displayName("DELETE /api/user/{id}")
    displayDescr("Deletes specified user from the Database")
    displayExample("/api/user/1")
    break;
    default:
    displayName("Start")
    displayDescr("Start")
    displayExample("Start")
        apicount = 0;
        break;
}
    }

function displayName(text) {
    document.getElementById("changeText").innerHTML = text;
}
function displayDescr(text) {
    document.getElementById("changeDescr").innerHTML = text;
}
function displayExample(text){
    document.getElementById("changeExample").innerHTML = text;
}