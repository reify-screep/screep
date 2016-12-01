var actions = require('actions')
var _ = require('lodash')

var roleSniper = {
    run: function(creep) {
        if(creep.room.name != Game.flags.GOTIME.pos.roomName) {
            creep.moveTo(Game.flags.GOTIME);
        } else {
            var target = creep.findClosestByRange(FIND_HOSTILE_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType != STRUCTURE_CONTROLLER;
                }
            });
            if(target != undefined) {
                if(creep.rangedAttack(target)) {
                    creep.moveTo(RoomPosition(10, 3, 'W8N67'))
                }
            }
	    }
    }
};

module.exports = roleSniper;
