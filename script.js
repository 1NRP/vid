// Night-Mode toggle function.
function nightModeFunction() {
    let element = document.body;
    element.classList.toggle("nightMode");
}

// Keyboard Shortcuts for different Button clicks & Functions
document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowRight") {
        document.addEventListener("keyup", function(e) {
            if (e.key === "ArrowUp") {
                fetchPosts();
            } else if (e.key === "ArrowDown") {
                play();
            } else if (e.key === "ArrowLeft") {
                document.getElementById("clearBtn").click();
            } else if (e.key === "End") {
                document.getElementById("pasteCopyButton").click();
            }
        });
    }
});

// Show "Link Saved" alert when"PasteCopy" button is clicked
function showAlert() {
   const alertBox = document.createElement('div');
   alertBox.className = 'alert';
   alertBox.textContent = '☑️ Link Saved';
   document.body.appendChild(alertBox);
   setTimeout(() => {
   alertBox.remove();
   }, 1000);
}

// Paste link and PLAY button function
async function play() {
    var qry = document.getElementById("vid").value.trim(); // Trim whitespace
    if (qry === "") {
        // Check if the clipboard API is supported
        if (!navigator.clipboard) {
            console.error('Clipboard API not supported');
            return;
        }
        // Try to read text from clipboard
        try {
            const text = await navigator.clipboard.readText();
            if (text.trim() === "") {
                alert("Please Enter URL First!");
                return;
            }
            document.getElementById('vid').value = text.trim(); // Update the input field
            qry = text.trim(); // Update qry after pasting
        } catch (err) {
            console.error('Failed to read clipboard contents:', err);
            if (err.name === 'NotAllowedError') {
                console.error('Permission to read clipboard denied');
            }
            return;
        }
    }
    // Check if the URL is an m3u8 link. (For browsers not supporting native m3u8 playback.)
    if (qry.toLowerCase().endsWith('.m3u8')) {
        if (Hls.isSupported()) {
            var video = document.getElementById('player');
            var hls = new Hls();
            hls.loadSource(qry);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, function() {
                video.play();
            });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = qry;
            video.addEventListener('loadedmetadata', function() {
                video.play();
            });
        }
    } else {
    // Check if the URL contains 'Terabox'
    if (qry.toLowerCase().includes('teraboxapp')) {
        // Extract the video ID from the URL
        var videoId = qry.split('/').slice(-1)[0];

        // Remove the first character (assuming it's always '1')
        videoId = videoId.substring(1);

        // Construct the request URL for preparation
        var requestUrl = "https://core.mdiskplay.com/box/terabox/" + videoId;

        // Make a request to the preparation URL
        fetch(requestUrl)
        .then(response => {
            // Wait 0.1 second before playing the video
            setTimeout(() => {
                // Construct the new URL in the desired format
                var playUrl = "https://core.mdiskplay.com/box/terabox/video/" + videoId + ".m3u8";
                document.getElementById("player").src=playUrl;
            }, 100);
        })
        .catch(error => {
            console.error('Error fetching preparation URL:', error);
            alert('Failed to prepare playback. Please try again later.');
        });
    } else {
        // Not a terabox URL, play as usual
        document.getElementById("player").src = qry;
    }
}
    
// Telegram Post fetching function 
  function loadNextPosts() {
    const container = document.getElementById('boxContainer');
    const channelName = document.getElementById('channelName').value;
    const inputVal = document.getElementById('messageID').value;
    const [interval, startID] = inputVal.includes('/') ? inputVal.split('/').map(Number) : [1, parseInt(inputVal)];
    for (let i = 0; i < 21; i++) { // 21 is the no. of Posts to be loaded when 'NEXT' button is clicked.
      currentMessageID = startID + (i * interval); // Increment messageID with the interval
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://telegram.org/js/telegram-widget.js?22`;
      script.dataset.telegramPost = `${channelName}/${currentMessageID}`;
      script.dataset.width = `100%`;
      script.dataset.userpic = `false`;
      script.dataset.color = `999`;
      script.dataset.dark = `1`;
      container.appendChild(script);
      // Manually trigger rendering of Telegram widget
      window.TelegramWidget && window.TelegramWidget.initWidget && window.TelegramWidget.initWidget(container.lastChild);
    }
    // Update current channel name
    currentChannelName = channelName;
    // Update message ID input field
    document.getElementById('messageID').value = `${interval}/${currentMessageID}`; // Retain the original format
  }

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
    script.dataset.color = `999`;
    script.dataset.dark = `1`;
    container.appendChild(script);
    // Manually trigger rendering of Telegram widget
    window.TelegramWidget && window.TelegramWidget.initWidget && window.TelegramWidget.initWidget(container.lastChild);
    // Update current message ID
    currentMessageID = messageID.split('/')[1];
    // Update initial message ID for subsequent Next button clicks
    initialMessageID = parseInt(currentMessageID) + 1;
  }
  
  document.getElementById('channelName').addEventListener('change', function() {
    // Get the selected option value
    var selectedValue = this.value;

    // Latest message ID for different channels.
    if (selectedValue === 'tburls') {
        document.getElementById('messageID').value = '2';
    } else if (selectedValue === 'desi_bhabhi_shila_terabox') {
        document.getElementById('messageID').value = '8600';
    } else if (selectedValue === 'desi_bhabhi_nisha_mdisk') {
        document.getElementById('messageID').value = '14700';
        // Set message ID box value for another option
    }
  });

// Textbox for all link pastes.
const textBox = document.getElementById('textBox');
const placeholder = document.getElementById('vid');
let clickCount = 0;
let clickTimer;
let isCopying = false;
let editingEnabled = false;

// Set initial mode to "paste"
document.getElementById('pasteCopyButton').innerText = '🗒';

// Function to paste text from placeholder to textbox
function pasteText() {
    textBox.value += (textBox.value.length > 0 ? '\n\n' : '') + placeholder.value;
}

// Function to copy text from textbox to clipboard
function copyTextBoxToClipboard() {
    textBox.select();
    document.execCommand('copy');
}

// Function to enable editing
function enableEditing() {
    if (!editingEnabled) {
        textBox.removeAttribute('readonly');
        editingEnabled = true;
    }
}

// Handle button click
function handleButtonClick() {
    clickCount++;
    clearTimeout(clickTimer);
    clickTimer = setTimeout(() => {
        if (clickCount >= 3) {
            toggleMode();
            enableEditing(); // Call enableEditing function if clicked 3 times
        } else {
            if (isCopying) {
                copyTextBoxToClipboard(); 
            } else {
                pasteText();
            }
        }
        clickCount = 0;
    }, 800);  // 3 clicks in 0.8 seconds or 800 milliseconds.
}

// Function to toggle between paste and copy modes
function toggleMode() {
    isCopying = !isCopying;
    document.getElementById('pasteCopyButton').innerText = isCopying ? '✂️' : '🗒';
}

// Function to store and retrieve Terabox links using browser Cache method.
function updateCachedContent() {
    const textBoxContent = document.getElementById('textBox').value;
    const cachedItem = {
        content: textBoxContent
    };

    localStorage.setItem('cachedTextBoxContent', JSON.stringify(cachedItem));
}

function loadFromCache() {
    const cachedItem = JSON.parse(localStorage.getItem('cachedTextBoxContent'));
    if (cachedItem) {
        document.getElementById('textBox').value = cachedItem.content;
    }
}

// Load cached content on page load
loadFromCache();

// Cache is updated everytime the Copy/Paste button is clicked, with a delay of 1 second
// Cache can be manually cleared using Tamper-monkey or through the browser ("Lock" icon in chrome)
document.getElementById('pasteCopyButton').addEventListener('click', () => {
    setTimeout(updateCachedContent, 1000);  // 1 second delay because link is pasted after 0.8 seconds of clicking the button.
});

// Function to copy specific Terabox link from textBox to clipboard
function pasteLineText(event) {
    var textBox = document.getElementById('textBox');
    var text = textBox.value;
    var cursorPosition = textBox.selectionStart; // Get cursor position
    var startOfLine = text.lastIndexOf('\n\n', cursorPosition - 1); // Find the start of the line
    var endOfLine = text.indexOf('\n\n', cursorPosition); // Find the end of the line

    // If no line break is found before the cursor position, start of the text
    if (startOfLine === -1) {
        startOfLine = 0;
    } else {
        startOfLine += 2; // Move past the line break
    }

    // If no line break is found after the cursor position, end of the text
    if (endOfLine === -1) {
        endOfLine = text.length;
    }

    var lineText = text.substring(startOfLine, endOfLine);

    // Paste the selected line text to the input field
       document.getElementById('vid').value = lineText;
    play(); // Trigger the play function after pasting the link
}
document.getElementById('textBox').onclick = pasteLineText;

// Function to handle clicking on the link button
function handleLinkButtonClick(link) {
    document.getElementById('vid').value = link;
    play(); // Trigger the play function after pasting the link
}

// Function to load posts from the server
function fetchPosts() {
    const postsContainer = document.getElementById('posts-container');
    postsContainer.innerHTML = ''; // Clear previous posts

    fetch('https://mdiskapp-1-k4347368.deta.app/posts?random=true&limit=3')
    .then(response => response.json())
    .then(data => {
        data.items.forEach(item => {
            const poster = item.poster;
            const link = item.link;
            const durationInMinutes = Math.round(item.duration / 60);
            const sizeInMB = (item.size / 1024 / 1024).toFixed(0);   
            const postElement = document.createElement('div');
            postElement.classList.add('post');
            postElement.innerHTML = `
                <div>
                    <img src="${poster}" alt="Poster" class="poster-image">
                    <div class="post-details">
                        <p class="duration">${durationInMinutes}<span style="color: #666;">&nbspMin</span></p>          
                        <p class="size">${sizeInMB}<span style="color: #666;">&nbspMB</span></p>
                        <p><button id="copyLink" onclick="handleLinkButtonClick('${link}')">🌐</button></p>
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
// fetchPosts();    // Remove "//" at beginning to load photos at page loading.

