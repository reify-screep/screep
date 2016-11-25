workersActions = {

    maybeHarvest: function(creep) {
        if(creep.memory.state == 'upgrading' && creep.carry.energy == 0) {
            Memory.lastUpgraded = Game.time;
        }
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
        // try to build item at target, if invalid target, look for ramparts and repair them
        if('buildTarget' in creep.memory && creep.memory.buildTarget != null) {
            var target = Game.getObjectById(creep.memory.buildTarget);
            var attempt = creep.build(target);
            if(attempt == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            } else if(attempt == ERR_INVALID_TARGET) {
                if('buildPos' in creep.memory && creep.memory.buildPos != null) {
                    var buildPos = Room.getPositionAt(creep.memory.buildPos);
                    var rampart = buildPos.lookFor(LOOK_STRUCTURES);
                    _.remove(rampart, (structure) => {
                        return structure.structureType != STRUCTURE_RAMPART;
                    });
                    if(rampart.length > 0) {
                        creep.repair(rampart[0]);
                    }
                    creep.memory.buildTarget = null;
                    creep.memory.buildPos = null;
                }
            }
        } else {
            // find something to build, and save it as the target
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                creep.memory.buildTarget = targets[0].id;
                creep.memory.buildPos = targets[0].pos;
            } else {
                creep.memory.state = 'deciding';
            }
        }
    },

    repair: function(creep) {
        if(!workersActions.repairType(creep, STRUCTURE_RAMPART, .5)) {
            if(!workersActions.repairType(creep, STRUCTURE_ROAD, .5)) {
                if(!workersActions.repairType(creep, STRUCTURE_WALL, .01)) {
                    creep.memory.state = 'deciding';
                }
            }
        }
    },

    repairType: function(creep, structureType, percentage) {
        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == structureType && (structure.hits / structure.hitsMax < percentage);
            }
        });
        if(targets.length > 0) {
            // unlike other actions, the huge number of repair targets possible could make a huge mess of this!
            if(creep.repair(targets[0])) {
                creep.moveTo(targets[0]);
            }
            return true;
        } else {
            return false;
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
