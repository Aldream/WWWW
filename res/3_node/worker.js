
self.BlobBuilder = self.BlobBuilder ||
                   self.WebKitBlobBuilder || self.MozBlobBuilder;
				   
function arrayBuffer2String(buf, callback) {
    var bb = new BlobBuilder();
    bb.append(buf);
    var f = new FileReader();
    f.onload = function(e) {
        callback(e.target.result)
    }
    f.readAsText(bb.getBlob());
}

function asynchronousAjaxRequest(/* String */ action, /* String */ dest) {
	var xhr = new XMLHttpRequest();                     
	xhr.open(action, dest, false);
	xhr.send();                                         
	return xhr.response; 
}

onmessage = function(e) {
	
	var ret;
	try {
		var fn = new Function("data", e.data.work);
		ret = fn(e.data.data);
	} catch (e) {
		ret = e.toString();
	}
	postMessage(ret);
};