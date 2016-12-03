var _ = require('lodash')
var manager = require('manager')
var lib = require('lib')

actions = {

    harvest: function(creep) {
        if(creep.memory.assignedResource == undefined) {
            manager.getResourceAssignment(creep);
        } else if(creep.carry.energy == creep.carryCapacity) {
            actions.storeLocally(creep);
        } else {
            var energySource = Game.getObjectById(creep.memory.assignedResource);
            switch(creep.harvest(energySource)) {
                case ERR_NOT_IN_RANGE:
                    creep.moveTo(energySource);
                    break;
            }
        }
    },

    workerHarvest: function(creep) {
        if(creep.carry.energy == creep.carryCapacity) {
            creep.memory.state == 'deciding';
        } else {
            var energySource = creep.pos.findClosestByPath(FIND_SOURCES);
            if (energySource != undefined) {
                switch(creep.harvest(energySource)) {
                    case ERR_NOT_IN_RANGE:
                        creep.moveTo(energySource);
                        break;
                }
            } else {
                console.log('err: ' + creep.name + ' - cannot find energy source')
            }
        }
    },

    storeLocally: function(creep) {
        var storage = Game.getObjectById(creep.memory.assignedStorage);
        switch(creep.transfer(storage, RESOURCE_ENERGY)) {
            case ERR_NOT_IN_RANGE:
                creep.moveTo(storage);
                break;
        }
    },

    pickupEnergy: function(creep) {
        var storage = lib.containerWithEnergy(creep.pos, 2500);
        if(storage == undefined) {
            storage = lib.containerWithEnergy(creep.pos, 1000);
        }
        if(storage == undefined) {
            storage = lib.containerWithEnergy(creep.pos, 400);
        }
        if(storage == undefined) {
            storage = Game.rooms[Memory.home].storage;
        }

        switch(creep.withdraw(storage, RESOURCE_ENERGY)) {
            case ERR_NOT_IN_RANGE:
                creep.moveTo(storage);
                break;
        }

        creep.memory.state = 'deciding';
    },

    storeEnergy: function(creep) {
        var storage = creep.pos.findClosestByPath(FIND_STRUCTURES, {
           filter: (structure) => {
               return (structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_SPAWN ||
                    structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
           }
        });

        if(storage == undefined || storage == null) {
            creep.memory.state = 'deciding';
        } else {
            switch(creep.transfer(storage, RESOURCE_ENERGY)) {
                case ERR_NOT_IN_RANGE:
                    creep.moveTo(storage);
                    break;
            }
        }
    },

    upgrade: function(creep) {
        switch(creep.upgradeController(creep.room.controller)) {
            case ERR_NOT_IN_RANGE:
                creep.moveTo(creep.room.controller);
                break;
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
                    var raw = creep.memory.buildPos;
                    var buildPos = Game.rooms[raw.roomName].getPositionAt(raw.x, raw.y);
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
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES, {
                filter: (structure) => {
                    console.log(creep.name + ' ' + structure + ' ' + structure.structureType);
                    return structure.structureType != STRUCTURE_ROAD; // temporarily skip roads! remove!
                }
            });
            console.log(creep.name + ' found build targets ' + targets);
            if(targets.length) {
                creep.memory.buildTarget = targets[0].id;
                creep.memory.buildPos = targets[0].pos;
            } else {
                creep.memory.state = 'deciding';
            }
        }
    },

    layRoad: function(creep) {
        var target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        if(target != undefined) {
            switch(creep.build(target)) {
                case ERR_NOT_IN_RANGE:
                    creep.moveTo(target);
                    break;
            }
        } else {
            Memory.layRoads = false;
        }
    },

    repair: function(creep) {
        if(!actions.repairType(creep, STRUCTURE_CONTAINER, .75)) {
            if(!actions.repairType(creep, STRUCTURE_RAMPART, .01)) {
                if(!actions.repairType(creep, STRUCTURE_ROAD, .5)) {
                    if(!actions.repairType(creep, STRUCTURE_TOWER, 1)) {
                        if(!actions.repairType(creep, STRUCTURE_WALL, .001)) {
                            creep.memory.state = 'deciding';
                        }
                    }
                }
            }
        }
    },

    repairType: function(creep, structureType, percentage) {
        var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == structureType && (structure.hits / structure.hitsMax < percentage);
            }
        });
        if(target != undefined) {
            if(creep.repair(target)) {
                creep.moveTo(target);
            }
            return true;
        } else {
            return false;
        }
    },

    newJob: function(creep) {
        manager.assignJob(creep);
    },

    goHome: function(creep) {
        var dest = Game.rooms[creep.memory.home].controller;
        creep.moveTo(dest);
    },

}

module.exports = actions;
