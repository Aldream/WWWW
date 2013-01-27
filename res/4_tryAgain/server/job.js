 /**
 * -----------------------------------------------------------
 * JOB - JS OBJECT
 * -----------------------------------------------------------
 * Author : Benjamin (Bill) Planche - Aldream (2012)
 *          Contact - benjamin.planche@aldream.net
 * ---------------------
 * Defines the server-side structure of the job.
 */
 
/* ------------------------------------
 * ATTRIBUTES
 * ------------------------------------
 */
 
 /**
  * Constructor
  * @param work - JS function. Defines the client algorithm.
  * @param index - Index of the given data.
  * @param master - Master node.
  */
 function Job(/* Function */ work, /* int */ index, /* Object:Node */ master) {
	this.work = work;
	this.index = index;
	this.master = master;
	
	this.dataChunks = {}; // Chunks of data asked by the workers and obtained from the master/
	this.workers = {master.id: master}; // Map of the workers on this job.
	this.results = {};
}

 
/* ------------------------------------
 * METHODS
 * ------------------------------------
 */

