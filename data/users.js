var  user1 = {
    ID: 1,
    firstName: "John",
    lastName: "Doe",
    street: "Lovendijkstraat 61",
    city: "Breda",
    isActive: true,
    emailAdress: "John.Doe@server.com",
    password: "secret",
    phoneNumber: "06-11223344",
    
}
var user2 = {
    ID: 2,
    firstName: "John2",
    lastName: "Doe2",
    street: "Lovendijkstraat 61332",
    city: "Tilburg",
    isActive: false,
    emailAdress: "j.doe@server.com",
    password: "Dog",
    phoneNumber: "06-11223344",
}

let users = [user1, user2]

module.exports = users;