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


const tweetInput = document.getElementById('tweetInput');
const suggestionsContainer = document.getElementById('suggestions');

function togglePLaceholderClass() {
    if (tweetInput.textContent.trim() === '') {
      tweetInput.classList.add('placeholder');
    } else {
      tweetInput.classList.remove('placeholder');
    }
  }

  function handleKeyUp(event) {
    const { key } = event;
    const tweet = tweetInput.textContent;
    const cursorPosition = tweetInput.selectionStart;
    const prefix = tweet.substring(0, cursorPosition);
    const suffix = tweet.substring(cursorPosition);
    const lastAmpersandIndex = prefix.lastIndexOf('#');
    const lastHash = tweet.substring(lastAmpersandIndex + 1, cursorPosition);
  
    console.log('prefix', prefix);
    const hashtagRegex = /#\w+/gm;
    const hasMatches = hashtagRegex.test(prefix); // Check if there are any matches
  
    console.log('anShowSuggestions(prefix)', hasMatches, canShowSuggestions(prefix));
  
    if (key === '#' && canShowSuggestions(prefix)) {
      showSuggestions(existingHashtags);
      console.log('begin with #');
    } else if (hasMatches) { // Use the hasMatches variable
      console.log('matched', prefix.match(hashtagRegex).slice(-1)[0]);
      const lastHashtag = prefix.match(hashtagRegex).slice(-1)[0];
      const matchedHashtags = getMatchedHashtags(lastHashtag.substring(1));
      console.log('lastHashtag, matchedHashtags, lastHash', lastHashtag, matchedHashtags, lastHash);
      if (matchedHashtags.length > 0) {
        showSuggestions(matchedHashtags);
      } else {
        hideSuggestions();
      }
    } else {
      hideSuggestions();
    }
  }
  
  


// function getHashtags(tweet) {
//   const regex = /(?:^|\s)(?:#)([a-zA-Z\d]+)/gm;
//   const matches = [];
//   let match;

//   while ((match = regex.exec(tweet)) !== null) {
//     matches.push(match[1]);
//   }

//   return matches;
// }

function getMatchedHashtags(hashtags) {
  return existingHashtags.filter((tag) => tag.startsWith(hashtags));
}

function showSuggestions(existingHashtags) {
  suggestionsContainer.style.display = 'block';
  suggestionsContainer.innerHTML = '';

  existingHashtags.forEach((tag) => {
    const suggestion = document.createElement('div');
    suggestion.classList.add('suggestion');
    suggestion.textContent = `#${tag}`;
    suggestion.addEventListener('click', () => insertSuggestion(tag));
    suggestionsContainer.appendChild(suggestion);
  });
}

function hideSuggestions() {
  suggestionsContainer.style.display = 'none';
}


function insertSuggestion(tag) {
    const currentTweet = tweetInput.textContent;
    const lastSpaceIndex = currentTweet.lastIndexOf(' ');
    const prefix = lastSpaceIndex >= 0 ? currentTweet.substring(0, lastSpaceIndex + 1) : '';
    const existingTags = getMatchedHashtags(tag);
    const hashtagElement = document.createElement('span');
    hashtagElement.textContent = '#' + tag;

    if (existingTags.length > 0) {
      hashtagElement.classList.add('hashtag');
    } else {
      hashtagElement.classList.add('new-hashtag');
    }
  
    tweetInput.innerHTML = '';
    tweetInput.appendChild(document.createTextNode(prefix));
    tweetInput.appendChild(hashtagElement);
    tweetInput.appendChild(document.createTextNode(' '));
    moveCursorToEnd(tweetInput.length)
    hideSuggestions();
    tweetInput.focus();
  }

  
  function moveCursorToEnd(position) {
      const selection = window.getSelection();
      const range = document.createRange();
      const lastChild = tweetInput.lastChild;
      
      range.setStart(lastChild, position);
      range.setEnd(lastChild, position);
      
    selection.removeAllRanges();
    selection.addRange(range);
    tweetInput.focus();
  }
  
  function canShowSuggestions(str) {
    const lastAmpersandIndex = str.lastIndexOf('#');
    // return lastAmpersandIndex === 0 || str.substring(lastAmpersandIndex - 1 , lastAmpersandIndex) === ' '
    if (lastAmpersandIndex === 0) {
      return true;
      
    } else if(str.substring(lastAmpersandIndex - 1 , lastAmpersandIndex) === ' ') {
      return true
    } else {
        return false
    }
  }


  tweetInput.addEventListener('input', togglePLaceholderClass);
  
 
  togglePLaceholderClass();
  
  
  tweetInput.addEventListener('keyup', handleKeyUp);