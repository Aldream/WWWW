 /**
 * -----------------------------------------------------------
 * NODE - JS OBJECT
 * -----------------------------------------------------------
 * Author : Benjamin (Bill) Planche - Aldream (2012)
 *          Contact - benjamin.planche@aldream.net
 * ---------------------
 * Define a node, which will deal with Web-workers to execute a given job.
 */
 
 var Node = {};
 
/* ------------------------------------
 * ATTRIBUTES
 * ------------------------------------
 */
 
 /**
  * Job to be executed by this node. (see the definition of the class Job)
  */
 Node.job = {};
 
 /**
  * Workers lauched by the node to execute the job.
  */
 Node.workers = [];
 
 /**
  * Results of the job, returned by the workers.
  */
 Node.result = {};
 
/* ------------------------------------
 * METHODS
 * ------------------------------------
 */

/* ---- LAUCH ---- */
/**
 * Lauch the job, initializing the workers.
 */
Node.lauch = function nodeLauch() {
	this.workers[0] = new Worker('worker.js');
	this.workers[0].onmessage = function(e) {
		Node.onMessage(e);
    };
	this.workers[0].postMessage( Node.job.toJson());
}

/* ---- ONMESSAGE ---- */
/**
 * Triggered by the worker after its execution, process the given result.
 * @parameter e Message from the worker
 */
Node.onMessage = function nodeOnmessage(/* Data */ e) {
	/** @todo Implement a global processor. */
	alert(e.data);
}