var _ = require('lodash')

var roleDistanceHarvester = {

    run: function(creep) {

        var flags = [
            'distanceHarvestA',
            'distanceHarvestB',
            'distanceHarvestC'
        ];

        // initialize a new creep correctly
        if(creep.memory.harvesting == undefined || creep.memory.target == undefined) {
            creep.memory.harvesting = false;
        }

        if(creep.carry.energy == 0 && creep.memory.harvesting == false) {
            creep.memory.harvesting = true;
            creep.memory.target = _.shuffle(flags)[0];
        }

        if(creep.carry.energy == creep.carryCapacity) {

            creep.memory.harvesting = false;

            if(creep.room.name != Memory.home) {
                creep.moveTo(Game.rooms[Memory.home].controller);
            } else {
                var storage = Game.rooms[Memory.home].storage;
                switch(creep.transfer(storage, RESOURCE_ENERGY)) {
                    case ERR_NOT_IN_RANGE:
                        creep.moveTo(storage);
                        break;
                }
            }

        } else if(creep.memory.harvesting) {
            if(creep.room.name != Game.flags[creep.memory.target].pos.roomName) {
                creep.moveTo(Game.flags[creep.memory.target]);
            } else {
               var target = creep.pos.findClosestByPath(FIND_SOURCES);
               if(creep.harvest(target)) {
                 creep.moveTo(target);
               }
            }
        }
    },

};

module.exports = roleDistanceHarvester;
