var actions = require('actions')
var _ = require('lodash')

var roleAttacker = {
    run: function(creep) {
        if(creep.room.name != Game.flags.GOTIME.pos.roomName) {
            creep.moveTo(Game.flags.GOTIME);
        } else {
            var target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
            if(target == undefined) {
                target = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType != STRUCTURE_CONTROLLER;
                    }
                });
            }
            // the wall
            if(target == undefined) {
                target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structureType == STRUCTURE_WALL;
                    }
                });
            }
            if(target != undefined) {
                if(creep.attack(target)) {
                    creep.moveTo(target);
                }
            }
	    }
    }
};

module.exports = roleAttacker;
