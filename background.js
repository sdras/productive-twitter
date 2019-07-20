/*
 * Copyright (c) 2016, David Smith <dizzyd@dizzyd.com>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * 3. Neither the name of the copyright holder nor the names of its contributors
 * may be used to endorse or promote products derived from this software without
 * specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

function makeRule(urlRegex) {
  return {
    conditions: [
      new chrome.declarativeContent.PageStateMatcher({
        pageUrl: { urlMatches: urlRegex }
      })
    ],
    actions: [new chrome.declarativeContent.ShowPageAction()]
  };
}

// Enable action if we're on a codepen page
chrome.runtime.onInstalled.addListener(function(details) {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([
      makeRule(".+://codepen.io/.+/pen/.+"),
      makeRule(".+://s.codepen.io/.+/debug/.+")
    ]);
  });
});

// Given a codepen URL, convert from pen<->debug
function invertUrl(url) {
  // Strip off any query parameters
  url = url.split(/[?#]/)[0];
  if (url.includes("/pen/")) {
    return url.replace("/pen/", "/debug/")
              .replace("/codepen.io/", "/s.codepen.io/");
  } else {
    return url.replace("/debug/", "/pen/")
              .replace("/s.codepen.io/", "/codepen.io/");
  }
}

// Determine if a codepen URL is debug view
function isDebugUrl(url) {
  return url.includes("/debug/");
}

function toggleDebug(tab) {
  // Extract the URL from the tab
  var invertedUrl = invertUrl(tab.url);

  chrome.tabs.query({url: invertedUrl + "*"}, function(tabs) {
    if (tabs.length > 0) {
      // Activate the URL
      chrome.tabs.update(tabs[0].id, {"active": true});

      // If this is a debug URL, go ahead and reload the tab
      if (isDebugUrl(invertedUrl)){
        chrome.tabs.reload(tabs[0].id);
      }
    } else {
      chrome.tabs.create({"url": invertedUrl});
    }
  });
}


chrome.runtime.onUpdateAvailable.addListener(function() {
  ga('send', 'event', 'action', 'updated', '')
  chrome.runtime.restart();
});

chrome.pageAction.onClicked.addListener(function(tab) {
  // Toggle the debugger; declarativeContent rules ensure
  // the active tab is a codepen
  ga('send', 'event', 'action', 'toggle', 'button');
  toggleDebug(tab);
});


chrome.commands.onCommand.addListener(function(cmd) {
  if (cmd == "toggle-codepen-dbg") {
    // If the active tab is a codepen.io, toggle it
    chrome.tabs.query({active:true,
                       url: ["*://codepen.io/*/pen/*",
                             "*://s.codepen.io/*/debug/*"]},
                      function(tabs) {
                        if (tabs.length > 0) {
                          ga('send', 'event', 'action', 'toggle', 'keyboard');
                          toggleDebug(tabs[0]);
                        }
                      });
  }
});

// Setup analytics
if (!window.ga) {
  (function(){
    window.ga = function() {
      (window.ga.q = window.ga.q || []).push(arguments);
    }, window.ga.l = 1 * new Date();

    var tag = 'script';
    var a = document.createElement(tag);
    var m = document.getElementsByTagName(tag)[0];

    a.async = 1;
    a.src = 'https://www.google-analytics.com/analytics.js';
    m.parentNode.insertBefore(a, m);
  })();

  ga('create', 'UA-44410703-2', 'auto');
  ga('set', 'checkProtocolTask', null);
}
