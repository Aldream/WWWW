/**
* -----------------------------------------------------------
* MASTER - JS OBJECT
* -----------------------------------------------------------
* Author : Benjamin (Bill) Planche - Aldream (2012)
* Contact - benjamin.planche@aldream.net
* ---------------------
* Define a master, a client node which owns and controls a job.
*/
 
/* ------------------------------------
* ATTRIBUTES
* ------------------------------------
*/

/**
* Constructor
* @param id - ID given to this master.
* @param job - Job this node will work on.
* @param serverAddress - Address of the server which will host the job.
*/
function Master(/* int */ id, /* Object:Job */ job, /* string */ serverAddress) {
	this.id = id;
	this.job = job;
	this.serverAddress = serverAddress;
	this.socket = io.connect(serverAddress);
	this.results = {};

	// Defining how to handle some socket events:
	/** @todo */
	this.socket.on('connect', function () {
		// "connect" is emitted when the socket connected successfully
		this.socket.emit('job', this.job.toJson(false));	
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
	this.socket.on('reconnect_failed', function () {
		// "reconnect_failed" is emitted when socket.io fails to re-establish a working connection after the connection was dropped.

	});
	this.socket.on('reconnect', function () {
		// "reconnect" is emitted when socket.io successfully reconnected to the server.

	});
	this.socket.on('reconnecting', function () {})

	});
	
	this.socket.on('chunk', function(idChunk, callback) {
		// "chunk" is emitted when the server request a new chunk to give it to a worker.
		this.job.fetchData(idChunk, callback);
	});
	
	this.socket.on('over', function (x) {
		this.job.callback(this.job.results);
	});
	
	
	this.reduce();
}


/* ------------------------------------
* METHODS
* ------------------------------------
*/
Master.prototype = {

	/**
	 * Processes the reduce phase.
	 */
	reduce: function MasterReduce() {
		var master = this;
		this.socket.emit('reduce', null, function(intermediateResults) {
			if (intermediateResults != null) {
				/** @todo Deal with the reduce function aynchronously (using webworkers)? */
				var result = master.job.reduce(intermediateResults.key, intermediateResults.values);
				
				/** @todo Ugly, and won't work for any kind of results. Need to specify more clearly what we want the reduce phase to be. */
				if (master.job.results[intermediateResults.key] == null) {
					master.job.results[intermediateResults.key] = result;
				}
				else {
					master.job.results[intermediateResults.key] += result
				}
			}
			
			/** @todo Again, ugly. Again, we need to specify more clearly what we want the reduce phase to be... */
			this.reduce();
		});
	}
}
