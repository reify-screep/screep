var actions = require('actions');
var _ = require('lodash');

var roleClaimSEast = {
    run: function(creep) {
        var targetRoom = "W5N67";
        console.log("targeting W5N67");

        if(Game.rooms[targetRoom] == undefined) {
            var targetPos = new RoomPosition(25, 25, targetRoom);
            console.log('target pos ' + targetPos);
            console.log('test room: ' + RoomPosition(25, 25, creep.room.name));
            res = creep.moveTo(targetPos);
            console.log('move to ' + res);
            return;
        }

        var controller = Game.rooms[targetRoom].controller;

        if (creep.reserveController(controller)) {
            creep.moveTo(controller);
        }
    }
};

module.exports = roleClaimSEast;
