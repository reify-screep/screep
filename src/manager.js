var _ = require('lodash')
var memoryManager = require('memoryManager')

manager = {

    getResourceAssignment: function(creep) {

        if(creep.room.name != undefined) {
            var resources = Memory[creep.room.name].energySources;

            for (var i=0; i < resources.length; i++) {
                if(Memory.assignments == undefined) {
                    Memory.assignments = {};
                }
                var assignments = Memory.assignments[resources[i]];
                if(assignments == undefined) {
                    Memory.assignments[resources[i]] = [];
                    assignments = Memory.assignments[resources[i]];
                }
                if(assignments.length == 0) {
                    assignments.push(creep.name)
                    creep.memory.assignedResource = resources[i];
                    var nearestContainer = Game.getObjectById(resources[i]).pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: (structure) => {
                            console.log('found structure: ' + structure.structureType + ', ' + (STRUCTURE_CONTAINER == structure.structureType))
                            return structure.structureType == STRUCTURE_CONTAINER;
                        }
                    });
                    console.log('nearest container: ' + nearestContainer)
                    creep.memory.assignedStorage = nearestContainer.id;
                }
                return true;
            }
            return false;
        }
    },
    // for now very simple, mimic old logic mostly. next round do job struct?
    assignJob: function(creep) {

        if(Memory[creep.room.name].lastUpgraded + 3000 < Game.time) {
            creep.memory.state =  'upgrading';
        } else if(creep.room.energyCapacityAvailable > creep.room.energyAvailable) {
            creep.memory.state = 'storing';
        } else {
            creep.memory.state = 'building';
        }

    }

}

module.exports = manager;
