/**
 *  server.js
 *
 *  Created on: October 22, 2013
 *      Author: Valeri Karpov <valeri.karpov@mongodb.com>
 *
 *  Lightweight NodeJS tool for watching a file, like a mongod
 *  log, and streaming it to socket.io on a specified port.
 *
 */

var commander = require('commander'),
    spawn = require('child_process').spawn,
    io = require('socket.io');

commander.
    option('-f, --file <file>', 'specify the file to watch', String).
    option('-p, --port <port>', 'specify the port to broadcast on', Number).
    parse(process.argv);

if (!commander.file || !commander.port) {
  console.log("Please specify both file and port!");
  process.exit(1);
}

io = io.listen(commander.port);

var tail = spawn('tail', ['-f', commander.file]);

tail.stdout.on('data', function (data) {
  io.sockets.emit('log', data);
  console.log(data.toString().trim());
});
