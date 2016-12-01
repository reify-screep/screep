var actions = require('actions')
var _ = require('lodash')

var roleReserver = {
    run: function(creep) {

        if(creep.memory.claimTarget == undefined) {
            roleReserver.getClaimTarget(creep);
        }
        var targetRoom = creep.memory.claimTarget;

        if(Game.rooms[targetRoom] == undefined) {
            var targetPos = RoomPosition(25, 25, targetRoom);
            creep.moveTo(targetPos);
            return;
        }

        var controller = Game.rooms[targetRoom].controller;

        if (creep.reserveController(controller)) {
            creep.moveTo(controller);
        } else {
            Memory.claimTargets[targetRoom].ticks = controller.reservation.ticksToEnd;
        }
    },

    getClaimTarget: function(creep) {

        for (var target in Memory.claimTargets) {
            var best = undefined;
            var ticks = Infinity; // ticks until unclaimed
            if(Memory.claimTargets[target].ticks < ticks && Memory.claimTargets[target].worked == undefined) {
                best = target;
            }
        }
        Memory.claimTargets[target].worked = creep.name;
        creep.memory.claimTarget = target;

    },

    expiringSoon: function() {
        for (var target in Memory.claimTargets) {
            if(Memory.claimTargets[target].ticks < 2000) { // arbitrary?
                return true;
            }
        }
        return false;
    },
};

module.exports = roleReserver;
