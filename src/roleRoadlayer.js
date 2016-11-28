var actions = require('actions')
var _ = require('lodash')

var roleRoadlayer = {
    run: function(creep) {

        var targetRoom = Memory.roadTarget;

        if(creep.carry.energy == 0) {
            if(creep.room.name != Memory.home) {
                creep.moveTo(Game.rooms[Memory.home]);
            } else {
                actions.pickupEnergy(creep);
            }
        } else {
            if(Game.rooms[targetRoom] == undefined) {
                var targetPos = Game.flags.roadTarget;
                creep.moveTo(targetPos);
                return;
            }
            actions.layRoad(creep);
        }
    }
};

module.exports = roleRoadlayer;
