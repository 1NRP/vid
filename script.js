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


// Post Viewer function

function fetchPosts() {
  const postsContainer = document.getElementById('posts-container');
  postsContainer.innerHTML = ''; // Clear previous posts

  fetch('https://mdiskapp-1-k4347368.deta.app/posts?random=true&limit=10')
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
              <p><button id="copy" onclick="copyToClipboard('${link}')">🌐</button></p>
              <!-- <p><a href="${link}" target="_blank">${link}</a></p> -->
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

function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
    .then(() => {
      // Removed console log
      // alert('Link copied to clipboard!');
    })
    .catch(err => {
      console.error('Failed to copy link to clipboard:', err);
      alert('Failed to copy link to clipboard!');
    });
}

//fetchPosts(); // Remove "//" at beginning to load photos at page loading.

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

// Handle button click
function handleButtonClick() {
    clickCount++;
    clearTimeout(clickTimer);
    clickTimer = setTimeout(() => {
        if (clickCount >= 3) {
            toggleMode();
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


