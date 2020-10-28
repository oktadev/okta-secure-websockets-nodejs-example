module.exports = function () {
    var rooms = [];

    rooms.push({
        name: 'General',
        users: []
    });

    rooms.push({
        name: 'Sports',
        users: []
    });

    rooms.push({
        name: 'Music',
        users: []
    });

    return rooms;
}