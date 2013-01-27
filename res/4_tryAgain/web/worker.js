/**
 * -----------------------------------------------------------
 * WORKER - JS OBJECT
 * -----------------------------------------------------------
 * Author : Benjamin (Bill) Planche - Aldream (2012)
 *          Contact - benjamin.planche@aldream.net
 * ---------------------
 * Define a worker, a client node associated with a job to help execute it.
 */
 
/* ------------------------------------
* ATTRIBUTES
* ------------------------------------
*/

/**
* Constructor
* @param id - ID given to this worker.
* @param job - Job this node will work on.
* @param socket - Socket to communicate with the server.
*/
function Worker(/* int */ id, /* Object:Job */ job, /* Socket */ socket) {
	this.id = id;
	this.job = job;
	this.socket = socket;

	this.dataChunk = {}; // Chunk of data the worker is currently dealing with.
	this.results = {};
	
	// Defining how to handle some socket events:
	/** @todo */
	this.socket.on('connect', function () { 
		// "connect" is emitted when the socket connected successfully
		
	});
	this.socket.on('connecting', function () {
		// "connecting" is emitted when the socket is attempting to connect with the server.
		
	});
	this.socket.on('disconnect', function () {
		// "disconnect" is emitted when the socket disconnected
		
	});
	this.socket.on('connect_failed', function () {
		// "connect_failed" is emitted when socket.io fails to establish a connection to the server and has no more transports to fallback to.
		
	});
	this.socket.on('error', function () {
		// "error" is emitted when an error occurs and it cannot be handled by the other event types.
		
	});
	this.socket.on('message', function (message, callback) {
		// "message" is emitted when a message sent with socket.send is received. message is the sent message, and callback is an optional acknowledgement function.
		
	});
	this.socket.on('anything', function(data, callback) {
		// "anything" can be any event except for the reserved ones. data is data, and callback can be used to send a reply.
		
	});
	this.socket.on('reconnect_failed', function () {
		// "reconnect_failed" is emitted when socket.io fails to re-establish a working connection after the connection was dropped.
		
	});
	this.socket.on('reconnect', function () {
		// "reconnect" is emitted when socket.io successfully reconnected to the server.
		
	});
	this.socket.on('reconnecting', function () {})
		
	});
}


/* ------------------------------------
 * METHODS
 * ------------------------------------
 */
Worker.prototype = {
	
	/** Communications Methods **/
	
	askChunk: function() {
		var worker = this;
		this.socket.emit('chunk', {}, function(data) {
			/** @todo */
			if data is a chunk
				worker.dataChunk = data;
				worker.map();
		});
	},
	
	sendResults: function() {
	
	}
	
	/** Algorithm Methods **/
	
}