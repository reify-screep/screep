var actions = require('actions')
var _ = require('lodash')

var roleReserver = {
    run: function(creep) {

        var targetRoom = 'W7N69';
        var controller = Game.rooms[targetRoom].controller;

        if (creep.reserveController(controller)) {
            creep.moveTo(controller);
        }
    }
};

module.exports = roleReserver;
