// ============================================================
// Block List URL Checker for Windows (cscript)
// Usage: cscript //nologo check_blocklist.js
// ============================================================

var fso = new ActiveXObject("Scripting.FileSystemObject");
var shell = new ActiveXObject("WScript.Shell");

var BLOCKED_MESSAGES = [
    "접근할 수 없는 사이트 입니다."
];
var LIST_FOLDER = "list";
var RESULT_FOLDER = "result";
var TIMEOUT_MS = 10000;
var SAVE_INTERVAL = 10;
var MAX_REDIRECTS = 10;

// Get script directory
var scriptPath = WScript.ScriptFullName;
var scriptDir = fso.GetParentFolderName(scriptPath);
var listPath = fso.BuildPath(scriptDir, LIST_FOLDER);
var resultPath = fso.BuildPath(scriptDir, RESULT_FOLDER);

// Create result folder if not exists
if (!fso.FolderExists(resultPath)) {
    fso.CreateFolder(resultPath);
}

// Parse URLs from file (skip comments and empty lines)
function parseUrlsFromFile(filePath) {
    var urls = [];
    if (!fso.FileExists(filePath)) return urls;
    
    var file = fso.OpenTextFile(filePath, 1, false, 0); // ASCII/ANSI (default)
    while (!file.AtEndOfStream) {
        var line = file.ReadLine();
        line = line.replace(/^\s+|\s+$/g, ""); // trim
        
        // Skip empty lines and comments
        if (line === "" || line.charAt(0) === "#") continue;
        
        // Add http:// if no protocol
        if (line.indexOf("://") === -1) {
            line = "http://" + line;
        }
        urls.push(line);
    }
    file.Close();
    return urls;
}

// Check URL accessibility
function checkUrl(url) {
    var result = {
        accessible: false,
        blocked: false,
        finalUrl: url,
        error: null,
        redirectCount: 0
    };
    
    try {
        var xhr = new ActiveXObject("MSXML2.ServerXMLHTTP.6.0");
        xhr.setOption(2, 13056); // Ignore SSL errors
        xhr.setTimeouts(TIMEOUT_MS, TIMEOUT_MS, TIMEOUT_MS, TIMEOUT_MS);
        
        var currentUrl = url;
        var redirects = 0;
        
        while (redirects < MAX_REDIRECTS) {
            xhr.open("GET", currentUrl, false);
            xhr.setRequestHeader("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36");
            
            try {
                xhr.send();
            } catch (e) {
                result.error = e.message || "Connection failed";
                result.blocked = true;
                return result;
            }
            
            var status = xhr.status;
            var responseText = "";
            try {
                responseText = xhr.responseText;
            } catch (e) {}
            
            // Check for blocked messages
            for (var j = 0; j < BLOCKED_MESSAGES.length; j++) {
                if (responseText.indexOf(BLOCKED_MESSAGES[j]) !== -1) {
                    result.blocked = true;
                    result.error = BLOCKED_MESSAGES[j];
                    return result;
                }
            }
            
            // Handle redirects (301, 302, 303, 307, 308)
            if (status >= 300 && status < 400) {
                var location = "";
                try {
                    location = xhr.getResponseHeader("Location");
                } catch (e) {}
                
                if (location && location !== currentUrl) {
                    // Handle relative URLs
                    if (location.indexOf("://") === -1) {
                        if (location.charAt(0) === "/") {
                            var matches = currentUrl.match(/^(https?:\/\/[^\/]+)/);
                            if (matches) {
                                location = matches[1] + location;
                            }
                        } else {
                            location = currentUrl.replace(/\/[^\/]*$/, "/") + location;
                        }
                    }
                    currentUrl = location;
                    redirects++;
                    result.redirectCount = redirects;
                    continue;
                }
            }
            
            // Success (2xx) or client/server error (4xx, 5xx but accessible)
            if (status >= 200 && status < 600) {
                result.accessible = true;
                result.finalUrl = currentUrl;
                return result;
            }
            
            break;
        }
        
        if (redirects >= MAX_REDIRECTS) {
            result.error = "Too many redirects";
        }
        
    } catch (e) {
        result.error = e.message || "Unknown error";
        result.blocked = true;
    }
    
    return result;
}

// Write results to file
function writeResults(categoryName, accessibleUrls) {
    if (accessibleUrls.length === 0) return;
    
    var resultFile = fso.BuildPath(resultPath, categoryName + "_accessible.txt");
    var file = fso.CreateTextFile(resultFile, true, true); // Overwrite, Unicode
    
    file.WriteLine("# ============================================================");
    file.WriteLine("# ACCESSIBLE SITES - " + categoryName.toUpperCase());
    file.WriteLine("# Checked: " + new Date().toLocaleString());
    file.WriteLine("# Total: " + accessibleUrls.length + " sites");
    file.WriteLine("# ============================================================");
    file.WriteLine("");
    
    for (var i = 0; i < accessibleUrls.length; i++) {
        var item = accessibleUrls[i];
        file.WriteLine(item.original);
        if (item.finalUrl !== item.original && item.finalUrl !== "http://" + item.original) {
            file.WriteLine("  -> Redirected to: " + item.finalUrl);
        }
    }
    
    file.Close();
    WScript.Echo("  [SAVED] " + resultFile);
}

// Main execution
function main() {
    WScript.Echo("============================================================");
    WScript.Echo(" Block List URL Checker");
    WScript.Echo(" " + new Date().toLocaleString());
    WScript.Echo("============================================================");
    WScript.Echo("");
    
    // Check if list folder exists
    if (!fso.FolderExists(listPath)) {
        WScript.Echo("[ERROR] List folder not found: " + listPath);
        WScript.Echo("Please create the 'list' folder and add blocklist files.");
        WScript.Quit(1);
    }
    
    var folder = fso.GetFolder(listPath);
    var files = new Enumerator(folder.Files);
    var totalBlocked = 0;
    var totalAccessible = 0;
    var totalChecked = 0;
    
    for (; !files.atEnd(); files.moveNext()) {
        var file = files.item();
        var fileName = file.Name;
        
        // Skip non-txt files
        if (fileName.toLowerCase().indexOf(".txt") === -1) continue;
        if (fileName.charAt(0) === "_") continue;
        
        var categoryName = fileName.replace(/\.txt$/i, "");
        WScript.Echo("[CHECKING] " + fileName);
        
        var urls = parseUrlsFromFile(file.Path);
        if (urls.length === 0) {
            WScript.Echo("  (No URLs found)");
            WScript.Echo("");
            continue;
        }
        
        var accessibleUrls = [];
        var blockedCount = 0;
        
        for (var i = 0; i < urls.length; i++) {
            var url = urls[i];
            var originalUrl = url.replace(/^https?:\/\//, "");
            
            WScript.StdOut.Write("  [" + (i + 1) + "/" + urls.length + "] " + originalUrl + " ... ");
            
            var result = checkUrl(url);
            totalChecked++;
            
            if (result.blocked) {
                WScript.Echo("[BLOCKED]");
                blockedCount++;
                totalBlocked++;
            } else if (result.accessible) {
                var redirectInfo = "";
                if (result.redirectCount > 0) {
                    redirectInfo = " (redirected " + result.redirectCount + "x)";
                }
                WScript.Echo("[ACCESSIBLE]" + redirectInfo);
                accessibleUrls.push({
                    original: originalUrl,
                    finalUrl: result.finalUrl
                });
                totalAccessible++;
                
                if (accessibleUrls.length % SAVE_INTERVAL === 0) {
                    writeResults(categoryName, accessibleUrls);
                }
            } else {
                WScript.Echo("[ERROR: " + (result.error || "Unknown") + "]");
                blockedCount++;
                totalBlocked++;
            }
        }
        
        WScript.Echo("  Summary: " + blockedCount + " blocked, " + accessibleUrls.length + " accessible");
        
        // Write accessible URLs to result file
        writeResults(categoryName, accessibleUrls);
        WScript.Echo("");
    }
    
    WScript.Echo("============================================================");
    WScript.Echo(" FINAL SUMMARY");
    WScript.Echo("============================================================");
    WScript.Echo(" Total URLs checked: " + totalChecked);
    WScript.Echo(" Blocked: " + totalBlocked);
    WScript.Echo(" Accessible: " + totalAccessible);
    WScript.Echo(" Results saved to: " + resultPath);
    WScript.Echo("============================================================");
}

main();
