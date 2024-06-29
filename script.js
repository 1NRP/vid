// Show "Last Link Saved" alert when "OK" response (200) is received from the server.
function showAlert() {
    const alertBox = document.createElement('div');
    alertBox.className = 'saveAlert';
    alertBox.textContent = '✔ Link Saved';
    document.body.appendChild(alertBox);
    setTimeout(() => {
    alertBox.remove();
    }, 1000);
 }
 
 // Show "Link Deleted" alert if response result is positive {result: (list_count)}.
 function showDeleteAlert() {
    const alertBox = document.createElement('div');
    alertBox.className = 'deleteAlert';
    alertBox.textContent = '✖ Link Deleted';
    document.body.appendChild(alertBox);
    setTimeout(() => {
    alertBox.remove();
    }, 1000);
 }
 
 // Show "Link Doesn't Exist" alert if response result is zero {result: 0}.
 function notFoundAlert() {
    const alertBox = document.createElement('div');
    alertBox.className = 'notFoundAlert';
    alertBox.textContent = "⚠ Link Doesn't Exist";
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
                 const response = await fetch('https://1msg.vercel.app/api/Play/saveLink', {
                     method: 'POST',
                     headers: {
                         'Content-Type': 'application/json'
                     },
                     body: JSON.stringify([textValue]),
                 });
 
                 if (response.ok) {
                     console.log('Link sent to Vercel KV.');
                     showAlert();
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
             const response = await fetch('https://1msg.vercel.app/api/Play/deleteLink', {
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
                     showDeleteAlert();
                 } else {
                     console.log('This Link does not exist in Vercel KV.');
                     notFoundAlert();
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
       const response = await fetch('https://1msg.vercel.app/api/Play/getLink', {
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
             play();
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
 
 // Paste link and PLAY button function (Vercel Serverless Function Method)
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
     if (/(teraboxapp|1024terabox|freeterabox)/.test(qry.toLowerCase())) {
         // Extract the video ID from the URL
         var fullVideoId = qry.split('/').slice(-1)[0];
         // Remove the first character (assuming it's always '1')
         videoId = fullVideoId.substring(1);
         try {
             // Make a request to the preparation URL
             const response = await fetch('https://1msg.vercel.app/api/Play/get-M3U8', {
                 method: 'POST',
                 headers: {
                     'Content-Type': 'application/json'
                 },
                 body: JSON.stringify({ shortURL: videoId }),
             });
             if (!response.ok) {
                 throw new Error('Failed to fetch M3U8 URL');
             }
             const responseData = await response.json();
             const playUrl = "https://srbo3gia676hprqy.public.blob.vercel-storage.com/M3U8-HTML/" + fullVideoId + ".m3u8";
             document.getElementById("player").src = playUrl;
             document.getElementById("player").play(); // Autoplay the video
         } catch (error) {
             console.error('Error fetching or processing:', error);
             alert('Failed to prepare playback. Please try again later.');
         }
     } else {
         // Not a terabox URL, play as usual
         document.getElementById("player").src = qry;
         document.getElementById("player").play(); // Autoplay the video
     }
 }
 
 /*
 // Paste link and PLAY button function (Mdiskplay Method)
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
     if (/(teraboxapp|1024terabox)/.test(qry.toLowerCase())) {
         // Extract the video ID from the URL
         var videoId = qry.split('/').slice(-1)[0];
 
         // Remove the first character (assuming it's always '1')
         videoId = videoId.substring(1);
 
         // Construct the request URL for preparation
         var requestUrl = "https://core.mdiskplay.com/box/terabox/" + videoId;
         // Make a request to the preparation URL
         fetch(requestUrl)
         .then(response => {
             var playUrl = "https://core.mdiskplay.com/box/terabox/video/" + videoId + ".m3u8";
             document.getElementById("player").src = playUrl;
             document.getElementById("player").play(); // Autoplay the video
         })
         .catch(error => {
             console.error('Error fetching preparation URL:', error);
             alert('Failed to prepare playback. Please try again later.');
         });
 
     } else {
         // Not a terabox URL, play as usual
         document.getElementById("player").src = qry;
         document.getElementById("player").play(); // Autoplay the video
     }
 }
 */
 
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
       script.dataset.color = `bfaa30`;
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
     script.dataset.color = `bfaa30`;
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
         document.getElementById('messageID').value = '10180';
     } else if (selectedValue === 'desi_bhabhi_nisha_mdisk') {
         document.getElementById('messageID').value = '16180';
         // Set message ID box value for another option
     }
   });
 
 // Function for storing or deleting Link.
 const textBox = document.getElementById('textBox');
 const placeholder = document.getElementById('vid');
 let clickCount = 0;
 let clickTimer;
 let deleteMode = false;
 
 // Set initial mode to "paste"
 document.getElementById('saveDeleteBtn').innerText = '☁️';
 
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
     }, 800);  // 3 clicks in 0.8 seconds or 800 milliseconds.
 }
 
 // Function to toggle between paste and copy modes
 function toggleMode() {
     deleteMode = !deleteMode;
     document.getElementById('saveDeleteBtn').innerText = deleteMode ? '🗑️' : '☁️';
 }
 document.getElementById('saveDeleteBtn').addEventListener('click', handleButtonClick);
 
 // Function to paste specific Terabox link from textBox to video link input field.
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
 function handlePosterOrLinkButtonClick(link) {
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
             const key = item.key;
             //const poster = item.poster;
             const link = item.link;
             const durationInMinutes = Math.round(item.duration / 60);
             const sizeInMB = (item.size / 1024 / 1024 / 3).toFixed(0);   
             const postElement = document.createElement('div');
             postElement.classList.add('post');
             postElement.innerHTML = `
                 <div>
                     <img src="https://ik.imagekit.io/media91/image/${key}.jpg" alt="Poster" class="poster-image" onclick="handlePosterOrLinkButtonClick('${link}')">
                     <div class="post-details">
                         <p class="duration">${durationInMinutes}<span style="color: #666;">&nbspMin</span></p>          
                         <p class="size">${sizeInMB}<span style="color: #666;">&nbspMB</span></p>
                         <!-- <p><button id="copyLink" onclick="handlePosterOrLinkButtonClick('${link}')">🌐</button></p> -->
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
 