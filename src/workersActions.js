workersActions = {

    maybeHarvest: function(creep) {
        if(creep.memory.state != 'harvesting' && creep.carry.energy == 0) {
            creep.memory.state = 'harvesting';
        }
    },

    harvest: function(creep) {
        if(creep.memory.state == 'harvesting' && creep.carry.energy == creep.carryCapacity) {
            _.pull(Memory.energySources[creep.memory.targetEnergy], creep.name);
            creep.memory.targetEnergy = null;
            creep.memory.state = 'deciding';
        }
        if(creep.memory.state == 'harvesting') {
            if(!('targetEnergy' in creep.memory) || creep.memory.targetEnergy == null) {
                workersActions.selectResource(creep);
            }
            var source = Game.getObjectById(creep.memory.targetEnergy);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
    },

    selectResource: function(creep) {

        // initialize the global registration if it has not been already
        if(!('energySources' in Memory)) {
            Memory.energySources = {};
            sources = creep.room.find(FIND_SOURCES);
            for (var i=0; i < sources.length; i++) {
                Memory.energySources[sources[i].id] = [];
            }
        }

        // pick by two criteria, the one with least users or in the case of a tie closest
        var lowestCount = Infinity;
        var lowestSources = [];
        for (var source in Memory.energySources) {
            var currentLength = Memory.energySources[source].length;
            if(currentLength < lowestCount) {
                lowestCount = currentLength;
                lowestSources = [source];
            } else if(currentLength == lowestCount) {
                lowestSources.push(source)
            }
        }

        // register the creep on the source
        if(lowestSources.length == 1) {
            var source = lowestSources[0];
            Memory.energySources[source].push(creep.name)
            creep.memory.targetEnergy = source;
            return source;
        } else {
            // todo : replace this random decision with picking the closest
            var source = _.shuffle(lowestSources)[0];
            Memory.energySources[source].push(creep.name)
            creep.memory.targetEnergy = source;
            return source;
        }

    },

    upgrade: function(creep) {
        if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller);
        }
    },

    build: function(creep) {
        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        if(targets.length) {
            if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0]);
            }
        } else {
            creep.memory.state = 'deciding';
        }
    },

    store: function(creep) {
        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_SPAWN ||
                    structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
            }
        });
        if(targets.length > 0) {
            if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0]);
            }
        } else {
            creep.memory.state = 'deciding';
        }
    }
};

module.exports = workersActions;
