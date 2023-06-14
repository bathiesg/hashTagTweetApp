const existingHashtags = [
  "liver",
  "pain",
  "right",
  "left",
  "pancreas",
  "kidney",
  "brain",
  "severe_pain",
  "tumour",
  "cancer",
  "MRI",
  "CT",
  "male",
  "female",
  "bone",
  "shoulder",
  "hip",
  "XRAY",
  "knee",
  "spine",
  "head",
  "abdomen",
  "contrast",
  "fragment",
  "detached",
  "injury",
  "torn",
  "rotator",
  "cuff",
  "abdominal",
  "dilatation"
];

const entredHashes = []
const tweetInput = document.getElementById('tweetInput');
const suggestionsContainer = document.getElementById('suggestions');
const tweetButton = document.getElementById('push-tweet');
const tweetDestination = document.getElementById('tweet-destination');
const hashtagRegex = /#[a-zA-Z0-9]{1,}/gm;


function togglePLaceholderClass() {
  if (tweetInput.textContent.trim() === '') {
    tweetInput.classList.add('placeholder');
    tweetButton.disabled = true
  } else {
    tweetInput.classList.remove('placeholder');
    tweetButton.disabled = false
  }
}

function togglePublishedTweetsClass() {
  console.log(tweetDestination.querySelector('.tweet-item'));
  if (tweetDestination.querySelector('.tweet-item')  === null) {
    tweetDestination.classList.add('no-published-tweet');
  } else {
    tweetDestination.classList.remove('no-published-tweet');
  }
}

function fillPublishedTweets() {
  const content = tweetInput.innerHTML;
  const tweetDiv = document.createElement('div');

  tweetDiv.classList.add('tweet-item');
  tweetDiv.innerHTML = content;
  tweetDestination.appendChild(tweetDiv)
  tweetInput.innerHTML = ''
  togglePLaceholderClass();
}

function handleKeyUp(event) {  
  const {key} = event  
  const tweet = tweetInput.innerHTML.replace(/<br>$/, '');
  const cursorPosition = tweetInput.selectionStart;
  const prefix = tweet.substring(0, cursorPosition);
  const lastChar = tweet.slice(-1)[0]  
  const hasMatches = hashtagRegex.test(prefix);

  if (key === ' ' || key == "Space" || key == 32  ) {
    hideSuggestions()      
  }else if (lastChar === '#' && canShowSuggestions(prefix)) {
    showSuggestions(existingHashtags);
  } else if (hasMatches) {
    const lastHashtag = prefix.match(hashtagRegex).slice(-1)[0];
    const hashText = lastHashtag.substring(1)
    const matchedHashtags = getMatchedHashtags(hashText);

    if (matchedHashtags.length > 0  && !matchedHashtags.every((tag) => entredHashes.includes(tag))) {
      showSuggestions(matchedHashtags);
    } else if(!entredHashes.includes(hashText)){
      showSuggestions(Array(hashText));        
    }
  } else {
    hideSuggestions();
  }
}

function getMatchedHashtags(hashtags) {
  return existingHashtags.filter((tag) => tag.startsWith(hashtags));
}

function showSuggestions(hashtags) {
  suggestionsContainer.style.display = 'block';
  suggestionsContainer.innerHTML   = '';

  hashtags.forEach((tag) => {
    const suggestion = document.createElement('div');
    suggestion.classList.add('suggestion');
    suggestion.textContent = `#${tag}`;
    suggestionsContainer.appendChild(suggestion);
    suggestion.addEventListener('click', () =>{ insertSuggestion(tag); entredHashes.push(tag)});
  });
}

function hideSuggestions() {
  suggestionsContainer.style.display = 'none';
}

function insertSuggestion(tag) {
  const currentTweet = tweetInput.innerHTML;
  let content = currentTweet.substring(0, currentTweet.lastIndexOf('#'))
  const hashClass = existingHashtags.find(currentTag => currentTag === tag) ? 'hashtag' : 'new-hashtag'
  content += `<span class="${hashClass}">#${tag}</span>&nbsp;`
  tweetInput.innerHTML = content;
  moveCursorToEnd(tweetInput)
  hideSuggestions();
}


function moveCursorToEnd(element) {
  element.focus()
  window.getSelection().selectAllChildren(element)
  window.getSelection().collapseToEnd()
}

function canShowSuggestions(str) {
  const lastHashIndex = str.lastIndexOf('#');
  if (lastHashIndex === 0) {
      return true;
  } else if (str.substring(lastHashIndex - 1, lastHashIndex) === ' ') {
      return true
  } else {
      return false
  }
}


//Main
tweetInput.addEventListener('input', togglePLaceholderClass); 
togglePLaceholderClass();  
togglePublishedTweetsClass()
tweetDestination.addEventListener('DOMSubtreeModified', togglePublishedTweetsClass, false);
tweetButton.addEventListener('click', fillPublishedTweets);
tweetInput.addEventListener('keyup', handleKeyUp);