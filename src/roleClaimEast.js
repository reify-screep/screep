var actions = require('actions');
var _ = require('lodash');

var roleClaimEast = {
    run: function(creep) {
        var targetRoom = "W5N68";

        if(Game.rooms[targetRoom] == undefined) {
            var targetPos = new RoomPosition(25, 25, targetRoom);
            creep.moveTo(targetPos);
            return;
        }

        var controller = Game.rooms[targetRoom].controller;

        if (creep.reserveController(controller)) {
            creep.moveTo(controller);
        }
    }
};

module.exports = roleClaimEast;
