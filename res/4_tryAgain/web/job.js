 /**
 * -----------------------------------------------------------
 * JOB - JS OBJECT
 * -----------------------------------------------------------
 * Author : Benjamin (Bill) Planche - Aldream (2012)
 *          Contact - benjamin.planche@aldream.net
 * ---------------------
 * Defines the structure of the jobs the user will give.
 */
 
/* ------------------------------------
 * ATTRIBUTES
 * ------------------------------------
 */
 
 /**
  * Constructor
  * @param work - JS function in string format. Defines the client algorithm.
  * @param data - Data (or shard of data) to be processed by the job.
  * @param index - Index of the given data.
  */
 function Job(/* String*/ work, /* Data */ data, /* int */ index) {
	this.work = work;
	this.data = data;
	this.index = index;
}

 
/* ------------------------------------
 * METHODS
 * ------------------------------------
 */
 
 /* ---- TOJSON ---- */
/**
 * Return a JSON object which contains a copy of the job.
 * @param withData Flag to add or not the data.
 * @return JSON object
 */
Job.prototype.toJson = function JobToJson(/* bool */ withData) {
	return (withData)?
		{work : this.work, data : this.data, index : this.index}
		: {work : this.work, index : this.index};
}

 /* ---- FROMJSON ---- */
/**
 * Set the Job's attributes with the values og the given JSON object.
 * @param JSON object (see the structure in the function toJson)
 * @return Job
 */
Job.prototype.fromJson = function JobFromJson(/* Object */ jsonObj) {
	this.work = jsonObj.work;
	this.data = jsonObj.data;
	this.index = jsonObj.index;
}

/* ---- NEXTDATA ---- */
/**
 * Returns a split of data (type : Data) which will be assigned to a node for the Map process.
 */
Job.prototype.nextData = function JobNextData(/* int */ index) {
	return null; // TO DO
}

/* ---- MAP ---- */
/**
 * Process the split of data.
 * Returns a value of type T (defined by the user).
 */
Job.prototype.map = function JobMap() {
	var fnWork = new Function("data", this.work); // Converting the string into function
	return fnWork(this.data);
}

/* ---- REDUCE ---- */
/**
 * Process the data furnished by the mappers to build a more condensate result.
 * Returns a value of type T (defined by the user).
 */
Job.prototype.reduce = function JobReduce(/* T */ data) {
	return null; // TO DO
}
