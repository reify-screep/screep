var _ = require('lodash')
var manager = require('manager')

actions = {

    harvest: function(creep) {
        if(creep.energy == creep.carryCapacity) {
            actions.storeLocally(creep);
        } else if(creep.memory.assignedEnergy == undefined) {
            manager.getResourceAssignment(creep);
        } else {
            var energySource = Game.getObjectById(creep.memory.assignedEnergy);
            switch(creep.harvest(energySource)) {
                case ERR_NOT_IN_RANGE:
                    creep.moveTo(energySource);
                    break;
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
        var storage = creep.pos.findClosestByPath(FIND_STRUCTURES, {
           filter: (structure) => {
               return (structure.structureType == STRUCTURE_CONTAINER) && structure.energy > 100;
           }
        });

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

        switch(creep.transfer(storage, RESOURCE_ENERGY)) {
            case ERR_NOT_IN_RANGE:
                creep.moveTo(storage);
                break;
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
        // just don't do this, towers only for now
    },

    newJob: function(creep) {
        manager.assignJob(creep);
    },

    goHome: function(creep) {
        console.log('help me i am lost - ' + creep.name + ' my home is ' + Memory.home + ' i am in ' + creep.room.name);
        var dest = Game.rooms[Memory.home].controller;
        console.log('i am going home to ' + dest)
        creep.moveTo(dest);
    },

}

module.exports = actions;
