// Prevent console from causing errors in IE
if (!(window.console && console.log)) {
  (function() {
    var noop = function() {};
    var methods = ['assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error', 'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log', 'markTimeline', 'profile', 'profileEnd', 'markTimeline', 'table', 'time', 'timeEnd', 'timeStamp', 'trace', 'warn'];
    var length = methods.length;
    var console = window.console = {};
    while (length--) {
      console[methods[length]] = noop;
    }
  }());
}

var cashierDebug = true;

// if the debugger is on, show output in html and console
if (cashierDebug == true) {

  // create style elements
  var cashierCSSContainer = document.createElement("style");
  cashierCSSContainer.setAttribute("type", "text/css");
  cashierCSSContainer.setAttribute("media", "screen");

  cashierCSSContainer.appendChild(document.createTextNode( "#cashier-debug-container { position: absolute; top:0; left:0; width: 100%; background: rgba(0,0,0,0.75); z-index: 9999; }" ));
  cashierCSSContainer.appendChild(document.createTextNode( "#cashier-debug-container div { color: white; margin: 10px 25px; float: left; font-size: 12px; text-shadow: 0 1px 0 black; }" ));
  document.getElementsByTagName("head")[0].appendChild(cashierCSSContainer);

  // create html elements for log output
  var cashierDebugContainer = document.createElement('div');
  cashierDebugContainer.id = 'cashier-debug-container';
  document.getElementsByTagName('body')[0].appendChild(cashierDebugContainer);

}

function cashierLogger(message) {
  if (cashierDebug == true) {
    console.log(message);
    document.getElementById("cashier-debug-container").innerHTML = '<div>' + message + '</div>';
  }
}

// Convenience array of status values
var cacheStatusValues = [];
cacheStatusValues[0] = 'uncached';
cacheStatusValues[1] = 'idle';
cacheStatusValues[2] = 'checking';
cacheStatusValues[3] = 'downloading';
cacheStatusValues[4] = 'updateready';
cacheStatusValues[5] = 'obsolete';

// Listeners for all possible events
var cache = window.applicationCache;
cache.addEventListener('cached', logEvent, false);
cache.addEventListener('checking', logEvent, false);
cache.addEventListener('downloading', logEvent, false);
cache.addEventListener('error', logEvent, false);
cache.addEventListener('noupdate', logEvent, false);
cache.addEventListener('obsolete', logEvent, false);
cache.addEventListener('progress', logEvent, false);
cache.addEventListener('updateready', logEvent, false);

// Log every event to the console
function logEvent(event) {
  var online, status, type, message;
  online = (isOnline()) ? 'yes' : 'no';
  status = cacheStatusValues[cache.status];
  type = event.type;
  message = 'online: ' + online;
  message += ', event: ' + type;
  message += ', status: ' + status;
  if (type == 'error' && navigator.onLine) {
    message += ' There was an unknown error, check your Cache Manifest.';
  }
  cashierLogger(message);
}

function isOnline() {
  return navigator.onLine;
}

// Swap in newly download files when update is ready
cache.addEventListener('updateready', function(event){

  // Don't perform "swap" if this is the first cache
  if (cacheStatusValues[cache.status] != 'idle') {
    cache.swapCache();
    cashierLogger('Swapped/updated the Cache Manifest.');
  }
}, false);

// These two functions check for updates to the manifest file
function checkForUpdates(){
  cache.update();
}

function autoCheckForUpdates(){
  setInterval(function() {
    cashierLogger('Checking for updates...')
    cache.update()
  }, 1000);
}

cashierLogger({
  isOnline: isOnline,
  checkForUpdates: checkForUpdates,
  autoCheckForUpdates: autoCheckForUpdates
})

if (!$('html').attr('manifest')) {
  cashierLogger('No Cache Manifest')
}





