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
 
 
 // (Vercel Serverless Function Method) Paste link and PLAY button function.
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
     if (/(teraboxapp|teraboxlink|1024terabox|teraboxshare|freeterabox)/.test(qry.toLowerCase())) {
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
                 body: JSON.stringify({ shortURL: fullVideoId }),
             });
             if (!response.ok) {
                 throw new Error('Failed to fetch M3U8 URL');
             }
             const responseData = await response.json();
             const playUrl = "https://srbo3gia676hprqy.public.blob.vercel-storage.com/M3U8-HTML/" + fullVideoId + ".m3u8";
             document.getElementById("player").src = playUrl;
             document.getElementById('player').style.maxHeight='85dvh';
             document.getElementById("player").play();
         } catch (error) {
             console.error('Error fetching or processing:', error);
             alert('Failed to prepare playback. Please try again later.');
         }
     } else {
         // Not a terabox URL, play as usual
         document.getElementById("player").src = qry;
         document.getElementById('player').style.maxHeight='85dvh';
         document.getElementById("player").play();
     }
 }
 
 /*
 // (Mdiskplay Method) Paste link and PLAY button function.
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
             qry = text.trim();
         } catch (err) {
             console.error('Failed to read clipboard contents:', err);
             if (err.name === 'NotAllowedError') {
                 console.error('Permission to read clipboard denied');
             }
             return;
         }
     }
     // Check if the URL contains 'Terabox'   
     if (/(teraboxapp|teraboxlink|1024terabox|teraboxshare|freeterabox)/.test(qry.toLowerCase())) {
         // Extract the video ID from the URL
         var videoId = qry.split('/').slice(-1)[0];
         // Remove the first character (assuming it's always '1')
         videoId = videoId.substring(1);
         // Construct the request URL for preparation
         var requestUrl = "https://core.mdiskplay.com/box/terabox/" + videoId;
         // Make a request to the preparation URL, so that it invokes the Mdiskplay server to fetch & store the m3u8 links of the video.
         fetch(requestUrl)
         .then(response => {    // Comment it (& uncomment "DIRECT" code below) if response is not required.
             var playUrl = "https://video.mdiskplay.com/" + videoId + ".m3u8";
             document.getElementById("player").src = playUrl;
             document.getElementById('player').style.maxHeight='85dvh';
             document.getElementById("player").play(); // Autoplay the video.
         })  
         .catch(error => {
             console.error('Error fetching preparation URL:', error);
             alert('Failed to prepare playback. Error:', error);
         });
         // "DIRECT"-Construct the playUrl immediately without waiting for fetch response.
         //var playUrl = "https://core.mdiskplay.com/box/terabox/video/" + videoId + ".m3u8";
         //document.getElementById("player").src = playUrl;
         //document.getElementById("player").play(); // Autoplay the video.
 
     } else {
         // Not a terabox URL, play as usual
         document.getElementById("player").src = qry;
         document.getElementById('player').style.maxHeight='85dvh';
         document.getElementById("player").play(); // Autoplay the video
     }
 }
 */
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
     document.getElementById('messageID').value = `${interval}/${lastMessageID + (20 * interval)}`;
 }
 
 // Event listener to get the Last Message's ID of the selected Telegram Channel.
 // Takes some time for the Message ID to reflect in the box given the large amount of code in a Telegram Channel's website.
 // Approximately 100 posts are present before the last post in these Telegram Channels.
 document.getElementById('channelName').addEventListener('change', async function() {
     async function getMessageID() {
         const channelName = document.getElementById('channelName').value;
         const TgChannel = 'https://t.me/s/' + encodeURIComponent(channelName); // Telegram Channel URL to fetch and parse.
         try {
             const proxyUrl = 'https://api.allorigins.win/get?url=';
             const response = await fetch(proxyUrl + encodeURIComponent(TgChannel));
             const data = await response.json();
             const htmlText = data.contents;
             // Parse the HTML content
             const parser = new DOMParser();
             const doc = parser.parseFromString(htmlText, 'text/html');
             // Extract all anchor/link tags
             const anchors = doc.querySelectorAll('a');
             const keywords = ['https://t.me/desi_bhabhi_shila_terabox/', 'https://t.me/desi_bhabhi_nisha_mdisk'];
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
         const proxyUrl = 'https://api.allorigins.win/get?url=';
         const response = await fetch(proxyUrl + encodeURIComponent(src));
         const data = await response.json();
         const htmlText = data.contents;
         // Parse the HTML and extract anchor tags.
         const parser = new DOMParser();
         const doc = parser.parseFromString(htmlText, 'text/html');
         const anchors = doc.querySelectorAll('a');
         // Filter anchor tags containing TB Links.
         const keywords = ['teraboxapp', 'teraboxlink', '1024terabox', 'freeterabox'];
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
             play();
         } else {
             alert("No TB Link was found.");
         }
     } catch (error) {
         alert("Error fetching the URL. Please make sure the URL is correct.");
         console.error('Error fetching HTML:', error);
     }
 }
 
 /*
 // Old Telegram Post fetching method. Only fetches the Posts.
 // This method does not add a button (PLAY) to paste the TB Link into the video input field.
 // It can't paste the link because Javascript can not be executed on embedded elements which are not from 'same-origin'.
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
     if (selectedValue === 'desi_bhabhi_shila_terabox') {
         document.getElementById('messageID').value = '14000';
     } else if (selectedValue === 'desi_bhabhi_nisha_mdisk') {
         document.getElementById('messageID').value = '20000';
     } else if (selectedValue === 'Example-Channel') {
         document.getElementById('messageID').value = '100';
         // Set message ID box value for another option.
     }
   });
 */
 
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
 async function showThumbnail(lineText) {
     var shortURL = lineText.substring(lineText.lastIndexOf('/') + 1);
     var response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(`https://www.terabox.com/api/shorturlinfo?app_id=250528&web=1&channel=dubox&clienttype=0&jsToken=1&dp-logid=1&shorturl=${shortURL}&root=1`)}`);
     var data = await response.json();
     var jsonParams = JSON.parse(data.contents);
     var imageUrl = jsonParams.list[0].thumbs.url2;
     //Below parameters are examples of how to extract different values from the fetched JSON file.
     //var size = content.list[0].size;
     //var icon = content.list[0].thumbs.icon;
     //var shareid = content.shareid;
    
     // Create and show the Thumbnail container.
     const thumbnailContainer = document.createElement('div');
     thumbnailContainer.className = 'thumbnailContainer';
     thumbnailContainer.innerHTML = `<img src="${imageUrl}" class="thumbnail" onclick="handleThumbnailClick('${lineText}', this.parentNode)" alt="Thumbnail Image">`;
     document.body.appendChild(thumbnailContainer);
     // Hide the Thumbnail container when clicking outside of it.
     document.addEventListener('click', function handleClickOutside(event) {
         if (!thumbnailContainer.contains(event.target)) {
             document.body.removeChild(thumbnailContainer);
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
         play();
     } else {
         clickTimeout = setTimeout(function () {
             clickTimeout = null;
             var lineText = getLineText(event);
             showThumbnail(lineText);
         }, clickDelay);
     }
 });
 
 // Function to handle clicking on the Thumbnail.
 function handleThumbnailClick(lineText, thumbnailContainer) {
     document.getElementById('vid').value = lineText;
     play();
     document.body.removeChild(thumbnailContainer);
 }
 // Function to load posts from the server
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
                         <!-- <p><button id="copyLink" onclick="handlePosterClick('${link}')">🔗</button></p> -->
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
 // fetchPosts();    // Uncomment "fetchPosts();" to load photos at page loading.
 // Function to handle clicking on the Poster.
 function handlePosterClick(link) {
     document.getElementById('vid').value = link;
     play();
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
   
 // Progressive Web App Service Worker Script.
 window.addEventListener('load', () => {
   registerSW();
 });
 async function registerSW() {
   if ('serviceWorker' in navigator) {
     try {
       await navigator
             .serviceWorker
             .register('serviceWorker.js');
     }
     catch (e) {
       console.log('Service Worker registration failed.');
     }
   }
 }
  