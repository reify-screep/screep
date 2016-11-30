var _ = require('lodash')

dev = {

    requestJob: function(creep) {

    },

    energyIn: function(target) {
        // todo : fill in with a switch on structure types
    },

    energyMax: function(target) {
        // todo : fill in with a switch on structure types
    },

    // returns true if the creep has completed the job, false if work remains
    runJob: function(creep, job) {

        var target = Game.getObjectById(job.target);

        switch (job.action.name) {
            case 'withdraw':
                if(creep.carry.energy == creep.carryCapacity || dev.energyIn(target) == 0) {
                    return true;
                } else if(!creep.withdraw(target, RESOURCE_ENERGY)) {
                    creep.moveTo(target);
                }
                break;
            case 'transfer':
                if(creep.carry.energy == 0 || dev.energyIn(target) == dev.energyMax(target)) {
                    return true
                } else if(!creep.transfer(target, RESOURCE_ENERGY)) {
                    creep.moveTo(target);
                }
                break;
            case 'build':
                if(creep.carry.energy == 0 || target == undefined) {
                    return true
                } else if (!creep.build(target)) {
                    creep.moveTo(target);
                }
                break;
            case 'repair':
                if(creep.carry.energy == 0 || target.hits == target.hitsMax) {
                    return true;
                } else if (!creep.repair(target)) {
                    creep.moveTo(target);
                }
                break;
            case 'harvest':
                if(creep.carry.energy == creep.carryCapacity) {
                    return true;
                } else if (!creep.harvest(target)) {
                    creep.moveTo(job.target);
                }
                break;
            case 'upgrade':
                if(creep.carry.energy == 0) {
                    return true;
                } else if (!creep.upgrade(target)) {
                    creep.moveTo(job.target);
                }
                break;
        }

    },

    buildJobQueue: function() {

        var jobQueue = {};
        dev.addConstructionJobs(jobQueue);
        dev.addUpgradeJobs(jobQueue);
        dev.addRepairJobs(jobQueue);
        dev.addTransportJobs(jobQueue);

    },

    addConstructionJobs: function(jobQueue) {
        // what rooms do we look at? probably all the ones in the room set.
        for(var room in Memory.activeRooms) {
            jobQueue[room].find(FIND_MY_CONSTRUCTION_SITES);
        }

    },

}

module.exports = dev;

/*

what are jobs?
- a target position
- an action to take at that position
- actions are a command and arguments
- basic defunctionalized representation

what does a worker get?
- a worker gets a list of jobs, to be done in order

 */
