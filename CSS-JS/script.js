// Long Press Events.
var el = document.getElementById('textBox');
el.addEventListener('long-press', function(e) {
  e.preventDefault();
  getLink();
});

var el = document.getElementById('button-play');
el.addEventListener('long-press', function(e) {
  e.preventDefault();
  VercelPlay();
});

var el = document.getElementById('clearBtn');
el.addEventListener('long-press', function(e) {
  e.preventDefault()
  document.getElementById('vid').value='';
  var elements = document.getElementsByClassName('secondRow'); for (var i = 0; i < elements.length; i++) { elements[i].style.display = (elements[i].style.display === 'none' || elements[i].style.display === '') ? 'inline' : 'none'; };
});

var el = document.getElementById('player');
el.addEventListener('long-press', function(e) {
  e.preventDefault()
  document.getElementById('player').style.maxHeight='195px';
});

var el = document.getElementById('post-container');
el.addEventListener('long-press', function(e) {
  e.preventDefault()
  fetchPosts();
});

// Copy the source of the currently playing video.
function copyVideoSrc() {
  if (document.getElementById('embedVideo').style.display === 'block') {
    iFramePlay().then(playUrl => navigator.clipboard.writeText(playUrl));
  } else {
    navigator.clipboard.writeText(document.getElementById('player').src);
  }
}

// Brightness Control Functionality.
const brSlider = document.getElementById('brightnessSlider');
brSlider.addEventListener('input', function () {
    const brightnessValue = this.value;
    document.getElementById('Default-Position-Elements').style.filter = `brightness(${brightnessValue}%)`;
    document.getElementById('player').style.filter = `brightness(${brightnessValue}%)`;
    document.getElementById('embedVideo').style.filter = `brightness(${brightnessValue}%)`;
    document.getElementById('menuBox').style.filter = `brightness(${brightnessValue}%)`;
    document.getElementById('thumbnailContainer').style.filter = `brightness(${brightnessValue}%)`;
});

// Show Alerts depending upon the response received.
function showAlert({ BgColor = '#fff', Text = 'Alert' } = {}) {
    var alertBox = document.createElement('div');
    alertBox.className = 'Alerts';
    alertBox.style.backgroundColor = BgColor;
    alertBox.textContent = Text;
    document.body.appendChild(alertBox);
    setTimeout(() => { 
        alertBox.remove(); 
    }, 1000);
  }
  
// Save the Link in KV Cloud storage.
    async function saveLink() {
      const textarea = document.getElementById('vid');
      const textValue = textarea.value.trim();
        if (textValue) {
            try {
                const response = await fetch('https://1nrp.vercel.app/api/Play/saveLink', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify([textValue]),
                });

                if (response.ok) {
                    const data = await response.json(); // Wait for the JSON response
                    const listCount = data.result;
                    // Show "Link Saved" alert when "OK" response (200) is received from the server.
                    showAlert({ BgColor: '#1bd13d', Text: `${listCount} ✔ Link Saved`});
                } else {
                    const errorData = await response.json();
                    console.error('Error from server:', errorData.error);
                }
            } catch (error) {
                console.error('Error sending link to Vercel KV:', error);
            }
        }
    }

// Delete the Link in KV Cloud storage.
  async function deleteLink() {
    const deletearea = document.getElementById('vid');
    const deleteValue = deletearea.value.trim();
    
    if (deleteValue) {
        try {
            const response = await fetch('https://1nrp.vercel.app/api/Play/deleteLink', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify([deleteValue]),
            });

            if (response.ok) {
                const data = await response.json(); // Wait for the JSON response
                if (data.result !== 0) {
                    console.log('Link deleted in Vercel KV.');
                    // Show "Link(s) Deleted" alert if response result is positive {result: (list_count)}. 'list_count' is the number of deleted values.
                    const listCount = data.result;
                    showAlert({ BgColor: '#f2074e', Text: `${listCount} ✖ Link Deleted`});
                } else {
                    console.log('This Link does not exist in Vercel KV.');
                    // Show "Link Doesn't Exist" alert if response result is zero {result: 0}.
                    showAlert({ BgColor: '#e8af05', Text: "⚠ Link Doesn't Exist"});
                }
            } else {
                const errorData = await response.json(); // Wait for the JSON error response
                console.error('Error from server:', errorData.error);
            }
        } catch (error) {
            console.error('Error deleting Link in Vercel KV:', error);
        }
    }
}

// Retrive the Links from KV Cloud storage.
  async function getLink() {
      const response = await fetch('https://1nrp.vercel.app/api/Play/getLink', {
          method: 'GET',
        })
        .then(response => response.json())
        .then(data => {
            let lines = [];
            data.result.forEach((jsonString) => {
                let parsedObject = JSON.parse(jsonString);
                for (const key in parsedObject) {
                    if (parsedObject.hasOwnProperty(key)) {
                        lines.push(`${parsedObject[key]}`);
                    }
                }
            });
            const result = lines.join('\n\n');
            const textbox = document.getElementById('textBox');
            textbox.value = result;
        })
        .catch(error => {
            console.error('Error fetching or parsing data:', error);
        });
}
// getLink();

// Night-Mode toggle function.
function nightModeFunction() {
    let element = document.body;
    element.classList.toggle("nightMode");
}

// Keyboard Shortcuts for different Button clicks & Functions
let arrowRightPressed = false;
document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowRight") {
        arrowRightPressed = true;
    }
    
    if (arrowRightPressed) {
        if (event.key === "ArrowUp") {
            saveLink();
        } else if (event.key === "ArrowDown") {
            document.getElementById('button-play').click();
        } else if (event.key === "ArrowLeft") {
            fetchPosts()
        } else if (event.key === "End") {
            document.getElementById("clearBtn").click();
        }
    }
});

document.addEventListener("keyup", function(event) {
    if (event.key === "ArrowRight") {
        arrowRightPressed = false;
    }
});

// Try to read clipboard on clicking 'PLAY' button if no URL is given.
async function checkClipboard() {
    var query = document.getElementById("vid").value.trim(); // Trim whitespaces
    if (query === "") {
        // Check if the clipboard API is supported
        if (!navigator.clipboard) {
            console.error('Clipboard API not supported');
            return;
        }
        // Try to read text from clipboard
        try {
            const text = await navigator.clipboard.readText();
            if (text.trim() === "") {
                alert("Please Enter URL First");
                return;
            }
            document.getElementById('vid').value = text.trim(); // Update the input field
            query = text.trim();
            return query;
        } catch (err) {
            console.error('Failed to read clipboard contents:', err);
            if (err.name === 'NotAllowedError') {
                console.error('Permission to read clipboard denied');
            }
            return;
        }
    } else {
      return query;
    }
}
// (Iframe Play Method - Used because HTML5 player can't play an URL without extension.) PLAY Video Function.
async function iFramePlay() {
    const query = await checkClipboard();
    // Check if the URL contains 'Terabox'.
    if (/(teraboxapp|teraboxlink|1024terabox|teraboxshare|freeterabox)/.test(query.toLowerCase())) {
        const shortURL = query.split('/').slice(-1)[0];
        const jsonData = await getTboxAPI(shortURL);
            const { shareid, uk } = jsonData;
            const { fs_id } = jsonData.list[0];
            const playUrl = `https://www.terabox1024.com/share/extstreaming.m3u8?uk=${uk}&shareid=${shareid}&type=M3U8_AUTO_360&fid=${fs_id}&sign=1&timestamp=1&clienttype=1&channel=1`;
            window.open(playUrl, 'videoFrame', 'noopener,noreferrer');
            document.getElementById('player').style.display = 'none';
            document.getElementById('embedVideo').style.height = '80dvh';
            document.getElementById('embedVideo').style.display = 'block';
            return playUrl;
    } else {
        // Not a terabox URL, play as usual
        document.getElementById("player").src = query;
        adjustStyles();
    }
}

// (Vercel Serverless Function Method) PLAY Video Function.
async function VercelPlay() {
    const query = await checkClipboard();
    // Check if the URL contains 'Terabox'
    if (/(teraboxapp|teraboxlink|1024terabox|teraboxshare|freeterabox)/.test(query.toLowerCase())) {
        // Extract the video ID from the URL
        var videoId = query.split('/').slice(-1)[0];
        try {
            // Make a request to the API endpoint.
            const response = await fetch(`https://1nrp.vercel.app/api/Play/getM3U8?shortURL=${videoId}`, {
                method: 'GET',
            });
            if (!response.ok) {
                throw new Error('Failed to fetch M3U8 URL');
            }
            const responseData = await response.json();
            const playUrl = "https://srbo3gia676hprqy.public.blob.vercel-storage.com/M3U8-HTML/" + videoId + ".m3u8";
            document.getElementById("player").src = playUrl;
            adjustStyles();
        } catch (error) {
            console.error('Error fetching or processing:', error);
            alert('Failed to fetch M3U8 File. Please try again later.');
        }
    } else {
        // Not a terabox URL, play as usual
        document.getElementById("player").src = query;
        adjustStyles();
    }
}

// Repetitive code for height and display adjustment in 'PLAY' functions.
  function adjustStyles() {
    document.getElementById('embedVideo').src='';
    document.getElementById('embedVideo').style.display='none';
    document.getElementById('player').style.display='block';
    document.getElementById('player').style.maxHeight='85dvh';
    document.getElementById('player').play();
  }

// Function for fetching Terabox API with 3 retries if initial requests fail.
async function getTboxAPI(shortURL) {
  const maxAttempts = 2;  // Max retries
        let attempts = 0;
        let params;
        while (attempts < maxAttempts) {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 2000); // Abort after 2 seconds if response not yet received and then retry.
          try {
               const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(`https://www.terabox.app/api/shorturlinfo?shorturl=${shortURL}&root=1`)}`, {
                   signal: controller.signal
               });
               clearTimeout(timeoutId); // Clear the timeout if response is received
               if (!response.ok) {
               throw new Error('Failed to fetch data from Terabox API.');
               }
               const apiData = await response.json();
               const jsonData = JSON.parse(apiData.contents);
               return jsonData;  // Exit the loop and return jsonData to the functions that passed the shortURL to this function, if fetch is successful.
           } catch (error) {
                clearTimeout(timeoutId); // Clear the timeout if there's an error
                attempts++;
                if (attempts >= maxAttempts) {
                alert('Failed to fetch data from Terabox API. Please try again later.');
                return; // Exit the function if retry attempts are exhausted
                }
           }
      }
}
  
// Telegram Post fetching function.
function fetchSinglePost() {
    const container = document.getElementById('boxContainer');
    const channelName = document.getElementById('channelName').value;
    const messageID = document.getElementById('messageID').value;
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://telegram.org/js/telegram-widget.js?22`;
    script.dataset.telegramPost = `${channelName}/${messageID}`;
    script.dataset.width = `100%`;
    script.dataset.userpic = `false`;
    script.dataset.color = `b4b4b4`;
    script.dataset.dark = `1`;
    // Create a container for the post and button
    const postContainer = document.createElement('div');
    postContainer.className = 'TG-post-container';
    // Create and add PLAY button
    const button = document.createElement('button');
    button.className = 'TG-Play'
    button.textContent = 'PLAY';
    button.onclick = function() {
        getIframeLink(postContainer.querySelector('script'));
    };
    postContainer.appendChild(button);
    container.innerHTML = ''; // Clear previous posts
    // Add script/Posts to the post container
    postContainer.appendChild(script);
    container.appendChild(postContainer);
    // Manually trigger rendering of Telegram widget
    window.TelegramWidget && window.TelegramWidget.initWidget && window.TelegramWidget.initWidget(postContainer.querySelector('script'));
    // Update current message ID
    currentMessageID = messageID.split('/')[1];
    // Update initial message ID for subsequent NEXT button clicks.
    initialMessageID = parseInt(currentMessageID) + 1;
}
function loadNextPosts() {
    const container = document.getElementById('boxContainer');
    const channelName = document.getElementById('channelName').value;
    const inputVal = document.getElementById('messageID').value;
    const [interval, startID] = inputVal.includes('/') ? inputVal.split('/').map(Number) : [1, parseInt(inputVal)];
   
    let lastMessageID = startID; // Track the last message ID
    for (let i = 0; i < 11; i++) { // 11 is the number of posts to be loaded when 'NEXT' button is clicked.
      const currentMessageID = lastMessageID + (i * interval); // Increment messageID with the interval
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://telegram.org/js/telegram-widget.js?22`;
      script.dataset.telegramPost = `${channelName}/${currentMessageID}`;
      script.dataset.width = `100%`;
      script.dataset.userpic = `false`;
      script.dataset.color = `b4b4b4`;
      script.dataset.dark = `1`;
      // Create a container for each post and button
      const postContainer = document.createElement('div');
      postContainer.className = 'TG-post-container';
      // Create and add PLAY button
      const button = document.createElement('button');
      button.className = 'TG-Play';
      button.textContent = 'PLAY';
      button.onclick = function() {
        getIframeLink(postContainer.querySelector('script'));
      };
      postContainer.appendChild(button);
      // Add script/Posts to the post container
      postContainer.appendChild(script);
      container.appendChild(postContainer);
      // Manually trigger rendering of Telegram widget
      window.TelegramWidget && window.TelegramWidget.initWidget && window.TelegramWidget.initWidget(postContainer.querySelector('script'));
    }
    // Update current channel name
    currentChannelName = channelName;
    // Update message ID input field with the last calculated message ID.
    document.getElementById('messageID').value = `${interval}/${lastMessageID + (10 * interval)}`;
}

// Event listener to get the Last Message's ID of the selected Telegram Channel.
// Approximately 100 posts are present before the last post in these Telegram Channels.
document.getElementById('channelName').addEventListener('change', async function() {
    async function getMessageID() {
        const channelName = document.getElementById('channelName').value;
        const TgChannel = 'https://t.me/s/' + channelName;  // Telegram Channel URL to fetch and parse.
        try {
            const response = await fetch('https://api.allorigins.win/get?url=' + encodeURIComponent(TgChannel));
            const data = await response.json();
            const htmlText = data.contents;
            // Parse the HTML content
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, 'text/html');
            // Extract all anchor/link tags
            const anchors = doc.querySelectorAll('a');
            const keywords = ['https://t.me/Step_sister_Mom_lesbia_brezzerr/', 'https://t.me/desi_bhabhi_shila_terabox/', 'https://t.me/desi_bhabhi_nisha_mdisk/', 'https://t.me/bhabhi_hot_desi_web/', 'https://t.me/Pure_terabox_Videos/'];
            let lastMessage = ''; // Variable to store the last matching link
            // Iterate over anchor tags to find the last matching link
            anchors.forEach(anchor => {
                const href = anchor.href;
                if (keywords.some(keyword => href.includes(keyword))) {
                    lastMessage = href; // Update lastMessage with the latest match
                }
            });
            // Extract the messageID which is after the last '/'
            if (lastMessage) {
                const numberAfterSlash = lastMessage.lastIndexOf('/');
                const messageNumber = lastMessage.substring(numberAfterSlash + 1) - 110;
                document.getElementById('messageID').value = messageNumber;
            } else {
                alert("No Link in the Message ID format was found.");
            }
        } catch (error) {
            alert("Error fetching Telegram Channel's source code.");
            console.error('Error fetching the source code of the selected Telegram Channel:', error);
        }
    }
    await getMessageID();
});

// Extract the TB Link from the Telegram post.
async function getIframeLink(script) {
    // Retrieve iframe source from script's data attribute.
    const iframeSrc = script.dataset.telegramPost;
    const iframe = document.querySelector(`iframe[src*="${iframeSrc}"]`);
    if (!iframe) {
        alert("Iframe not found.");
        return;
    }
    const src = iframe.src;
    try {
        const response = await fetch(src);
        const htmlText = await response.text();
        // Parse the HTML and extract anchor tags.
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');
        const anchors = doc.querySelectorAll('a');
        // Filter anchor tags containing TB Links.
        const keywords = ['teraboxapp', 'teraboxshare', 'teraboxlink', '1024terabox', 'freeterabox'];
        let found = false;
        let TBoxLink = '';
        anchors.forEach(anchor => {
            const href = anchor.href;
            if (keywords.some(keyword => href.includes(keyword))) {
                TBoxLink = href;
                found = true;
            }
        });
        if (found) {
            document.getElementById('vid').value = TBoxLink;
            document.getElementById('button-play').click();
        } else {
            alert("No TB Link was found.");
        }
    } catch (error) {
        alert("Error fetching the URL. Please make sure the URL is correct.");
        console.error('Error fetching HTML:', error);
    }
}

// Logic for toggling the mode between 'storing' and 'deleting' Link.
const textBox = document.getElementById('textBox');
const placeholder = document.getElementById('vid');
let clickCount = 0;
let clickTimer;
let deleteMode = false;
// Set initial mode to "Save"
document.getElementById('saveDeleteBtn').innerText = '🌐';
// Handle "saveDeleteBtn" button click
function handleButtonClick() {
    clickCount++;
    clearTimeout(clickTimer);
    clickTimer = setTimeout(() => {
        if (clickCount >= 3) {
            toggleMode();
        } else {
            if (deleteMode) {
                deleteLink(); 
            } else {
                saveLink();
            }
        }
        clickCount = 0;
    }, 800);  // 3 clicks in 0.8 second or 800 milliseconds.
}

// Function to toggle between paste and copy modes
function toggleMode() {
    deleteMode = !deleteMode;
    document.getElementById('saveDeleteBtn').innerText = deleteMode ? '🗑️' : '🌐';
}
document.getElementById('saveDeleteBtn').addEventListener('click', handleButtonClick);

// Function to show Thumbnail and Paste LineText in link input field.
function getLineText(event) {
    var textBox = document.getElementById('textBox');
    var text = textBox.value;
    var cursorPosition = textBox.selectionStart; // Get cursor position
    var startOfLine = text.lastIndexOf('\n\n', cursorPosition - 1); // Find the start of the line
    var endOfLine = text.indexOf('\n\n', cursorPosition); // Find the end of the line
    // If no line break is found before the cursor position.
    if (startOfLine === -1) {
        startOfLine = 0;
    } else {
        startOfLine += 2; // Move past the line break
    }
    // If no line break is found after the cursor position, end of the text
    if (endOfLine === -1) {
        endOfLine = text.length;
    }
    return text.substring(startOfLine, endOfLine);
}
// Show thumbnail function with 3 attempts to fetch the TB API if failed in the 1st or 2nd attempts.
async function showThumbnail(lineText) {
    const shortURL = lineText.substring(lineText.lastIndexOf('/') + 1);
    const jsonData = await getTboxAPI(shortURL);
    const imageUrl = jsonData.list[0].thumbs.url2;
    const thumbnailContainer = document.getElementById('thumbnailContainer');
    document.getElementById('thumbnailContainer').style.display='block';
    thumbnailContainer.innerHTML = `<img src="${imageUrl}" class="thumbnail" onclick="handleThumbnailClick('${lineText}')" alt="Thumbnail Image">`;
    // Hide the Thumbnail container when clicking outside of it.
    document.addEventListener('click', function handleClickOutside(event) {
        if (!thumbnailContainer.contains(event.target)) {
            document.getElementById('thumbnailContainer').style.display='none';
            document.removeEventListener('click', handleClickOutside);
        }
    });
}
let clickTimeout;
const clickDelay = 200;
document.getElementById('textBox').addEventListener('click', function (event) {
    if (clickTimeout) {
        clearTimeout(clickTimeout);
        clickTimeout = null;
        var lineText = getLineText(event);
        document.getElementById('vid').value = lineText;
        document.getElementById('button-play').click();
    } else {
        clickTimeout = setTimeout(function () {
            clickTimeout = null;
            var lineText = getLineText(event);
            showThumbnail(lineText);
        }, clickDelay);
    }
});
// Function to handle clicking on the Thumbnail.
function handleThumbnailClick(lineText) {
    document.getElementById('vid').value = lineText;
    document.getElementById('button-play').click();
    document.getElementById('thumbnailContainer').style.display='none';
}

// Function to load posts from the server.
function fetchPosts() {
    const postsContainer = document.getElementById('post-container');
    postsContainer.innerHTML = ''; // Clear previous posts
    fetch('https://mdiskapp-1-k4347368.deta.app/posts?random=true&limit=2')
    .then(response => response.json())
    .then(data => {
        data.items.forEach(item => {
            const key = item.key;
            //const poster = item.poster;
            const link = item.link;
            const durationInMinutes = Math.round(item.duration / 60);
            const sizeInMB = (item.size / 1024 / 1024 / 3).toFixed(0);   
            const postElement = document.createElement('div');
            postElement.classList.add('post');
            postElement.innerHTML = `
                <div>
                    <img src="https://ik.imagekit.io/media91/image/${key}.jpg" alt="Poster" class="poster-image" onclick="handlePosterClick('${link}')">
                    <div class="post-details">
                        <p class="duration">${durationInMinutes}<span style="color: #666;">&nbspMin</span></p>          
                        <p class="size">${sizeInMB}<span style="color: #666;">&nbspMB</span></p>
                    </div>
                </div>
            `;
            postsContainer.appendChild(postElement);
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
// Function to handle clicking on the Poster.
function handlePosterClick(link) {
    document.getElementById('vid').value = link;
    document.getElementById('button-play').click();
  }

// Show or Hide Hamburger menu box.
function menuBox() {
   const alertBox = document.getElementById('menuBox');
   if (alertBox.style.display === 'inline') {
       alertBox.style.display = 'none';
   } else {
       alertBox.style.display = 'inline';
   }
}
// Hide menuBox when clicked on it.
document.addEventListener('click', function(event) {
    const menuBox = document.getElementById('menuBox');
    if (menuBox && menuBox.contains(event.target)) {      
        setTimeout(() => {
        menuBox.style.display = 'none';
        }, 300);
    }
});

/*
// Progressive Web App Service Worker Registration.
window.addEventListener('load', () => {
  registerSW();
});
async function registerSW() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('PWA/serviceWorker.js');
      console.log('Service Worker registration successful with scope: ', registration.scope);
    } catch (e) {
      console.log('Service Worker registration failed:', e);
    }
  }
}
*/
