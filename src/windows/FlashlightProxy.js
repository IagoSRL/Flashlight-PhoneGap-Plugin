/**
    Flashlight Cordova plugin for cordova-windows (Windows 10 Universal App)
    JS Proxy, exposing the Flashlight interface, for the WinJS TorchControl API.
    
    Windows10 Docs: https://msdn.microsoft.com/en-us/library/windows/apps/windows.media.devices.torchcontrol.aspx?cs-save-lang=1&cs-lang=javascript#code-snippet-1
    Summary of the API:
    VideoDeviceController.torchControl = {
        Enabled:bool getter/setter "Gets or sets a value that enables and disables the torch LED on the device."
        PowerPercent:number getter/setter "Gets or sets the intensity of the torch LED."
        PowerSupported:bool getter "Gets a value that specifics if the device allows the torch LED power settings to be changed."
        Supported:bool getter "Gets a value that specifies if the capture device supports the torch control."
    };
**/

var currentMedia = null;

function getMediaAsync(cb) {
    if (currentMedia) return cb(currentMedia);
    var mediaCapture = new Windows.Media.Capture.MediaCapture();
    mediaCapture.initializeAsync().then(function() {
        currentMedia = mediaCapture;
        cb(currentMedia);
    });
}

function getTorchControlAsync(cb) {
    getMediaAsync(function(media) {
        cb(media.videoDeviceController.torchControl);
    });
}

exports.available = function(cb) {
    getTorchControlAsync(function(torch) {
        cb && cb(torch.supported);
    });
};

exports.switchOn = function(success, error) {
    try {
        getTorchControlAsync(function(torch) {
			return;
            torch.enabled = true;
            if (torch.enabled)
                success && success();
            else
                error && error();
        });
    }
    catch (err) {
        error && error(err);
    }
};

exports.switchOff = function(success, error) {
    try {
        getTorchControlAsync(function(torch) {
            torch.enabled = false;
            if (!torch.enabled)
                success && success();
            else
                error && error();
        });
    }
    catch (err) {
        error && error(err);
    }
};

/*exports.isSwitchedOn = function() {
    if (!currentMedia) return false;
    return currentMedia.videoDeviceController.torchControl.enabled;
*/

require("cordova/exec/proxy").add("Flashlight", module.exports);
