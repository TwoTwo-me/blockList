var fso = new ActiveXObject("Scripting.FileSystemObject");
var shell = new ActiveXObject("WScript.Shell");

var RESULT_FOLDER = "result";
var BATCH_SIZE = 10;

var scriptPath = WScript.ScriptFullName;
var scriptDir = fso.GetParentFolderName(scriptPath);
var resultPath = fso.BuildPath(scriptDir, RESULT_FOLDER);

function parseUrlsFromFile(filePath) {
    var urls = [];
    if (!fso.FileExists(filePath)) return urls;
    
    var file = fso.OpenTextFile(filePath, 1, false, 0);
    while (!file.AtEndOfStream) {
        var line = file.ReadLine();
        line = line.replace(/^\s+|\s+$/g, "");
        
        if (line === "" || line.charAt(0) === "#" || line.indexOf("->") !== -1) continue;
        
        if (line.indexOf("://") === -1) {
            line = "https://" + line;
        }
        urls.push(line);
    }
    file.Close();
    return urls;
}

function openUrls(urls, startIndex) {
    var endIndex = Math.min(startIndex + BATCH_SIZE, urls.length);
    for (var i = startIndex; i < endIndex; i++) {
        shell.Run(urls[i]);
        WScript.Sleep(300);
    }
    return endIndex;
}

function main() {
    WScript.Echo("============================================================");
    WScript.Echo(" Site Opener - Open accessible sites in browser");
    WScript.Echo("============================================================");
    WScript.Echo("");
    
    if (!fso.FolderExists(resultPath)) {
        WScript.Echo("[ERROR] Result folder not found: " + resultPath);
        WScript.Quit(1);
    }
    
    var allUrls = [];
    var folder = fso.GetFolder(resultPath);
    var files = new Enumerator(folder.Files);
    
    for (; !files.atEnd(); files.moveNext()) {
        var file = files.item();
        if (file.Name.toLowerCase().indexOf(".txt") === -1) continue;
        if (file.Name.charAt(0) === "_") continue;
        
        WScript.Echo("[LOADING] " + file.Name);
        var urls = parseUrlsFromFile(file.Path);
        for (var i = 0; i < urls.length; i++) {
            allUrls.push(urls[i]);
        }
    }
    
    WScript.Echo("");
    WScript.Echo("Total URLs loaded: " + allUrls.length);
    WScript.Echo("Press ENTER to open " + BATCH_SIZE + " sites at a time.");
    WScript.Echo("Press Ctrl+C to exit.");
    WScript.Echo("");
    
    var currentIndex = 0;
    
    while (currentIndex < allUrls.length) {
        var remaining = allUrls.length - currentIndex;
        WScript.StdOut.Write("[" + currentIndex + "/" + allUrls.length + "] Press ENTER to open next " + Math.min(BATCH_SIZE, remaining) + " sites... ");
        WScript.StdIn.ReadLine();
        
        currentIndex = openUrls(allUrls, currentIndex);
        WScript.Echo("  Opened " + currentIndex + "/" + allUrls.length);
    }
    
    WScript.Echo("");
    WScript.Echo("============================================================");
    WScript.Echo(" All sites opened!");
    WScript.Echo("============================================================");
}

main();
