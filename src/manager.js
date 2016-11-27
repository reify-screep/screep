var _ = require('lodash')
var memoryManager = require('memoryManager')

manager = {

    getResourceAssignment: function(creep) {

        var resources = Memory[creep.room.id].energySources;

        for (var i=0; i < resources.length; i++) {
            var assignments = Memory.assignments[resources[i].id];
            if(assignments.length == 0) {
                creep.memory.assignedResource = resources[i].id;
                var nearestContainer = resources[i].pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_CONTAINER;
                    }
                });
                creep.memory.assignedStorage = nearestContainer.id;
            }
            return true;
        }
        return false;
    },
    // for now very simple, mimic old logic mostly. next round do job struct?
    assignJob: function(creep) {

        if(Memory[creep.room.id].lastUpgraded + 3000 < Game.time) {
            return 'upgrading';
        } else if(creep.room.energyCapacityAvailable > creep.room.energyAvailable) {
            return 'storing';
        } else {
            return 'building';
        }

    }

}

module.exports = manager;
