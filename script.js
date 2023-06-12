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
// const hashtagRegex = /#\w+/gm;
const hashtagRegex = /#[a-zA-Z0-9]{1,}/gm;


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
    const lastHashSignIndex = prefix.lastIndexOf('#');
    const lastChar = tweetInput.textContent.slice(-1)[0]
    const lastHash = tweet.substring(lastHashSignIndex + 1, cursorPosition);
  
    const hasMatches = hashtagRegex.test(prefix);
    console.log('tweetInput.lastChild', tweetInput.textContent.slice(-1)[0], typeof tweetInput);

    console.log('anShowSuggestions(prefix)', hasMatches, canShowSuggestions(prefix));
  
    if (lastChar === '#' && canShowSuggestions(prefix)) {
      showSuggestions(existingHashtags);
      console.log('begin with #');
    } else if (hasMatches) {
      const lastHashtag = prefix.match(hashtagRegex).slice(-1)[0];
      console.log('matched',lastHashtag);
      const matchedHashtags = getMatchedHashtags(lastHashtag.substring(1));
      console.log('lastHashtag, matchedHashtags, lastHash', lastHashtag, matchedHashtags, lastHash);
      if (matchedHashtags.length > 0) {
        showSuggestions(matchedHashtags);
      } else {
        
        insertSuggestion(lastHashtag.substring(1))
        // hideSuggestions();
      }
    } else {
      hideSuggestions();
    }
  }
  
  function inserNewTag(tag){
    const existingTags = getMatchedHashtags(tag);
    console.log('existingTags', existingTags);
    const hashtagElement = document.createElement('span');
    hashtagElement.textContent = '#' + tag;

    if (existingTags.length > 0) {
      hashtagElement.classList.add('hashtag');
    } else {
      hashtagElement.classList.add('new-hashtag');
    }

    return hashtagElement
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

function showSuggestions(hashtags) {
  suggestionsContainer.style.display = 'block';
  suggestionsContainer.innerHTML   = '';

  hashtags.forEach((tag) => {
    const suggestion = document.createElement('div');
    suggestion.classList.add('suggestion');
    suggestion.textContent = `#${tag}`;
    suggestionsContainer.appendChild(suggestion);
    suggestion.addEventListener('click', () => insertSuggestion(tag));
  });
}

function hideSuggestions() {
  suggestionsContainer.style.display = 'none';
}



function insertSuggestion(tag) {
    const currentTweet = tweetInput.innerHTML;
    let content = currentTweet.substring(0, currentTweet.lastIndexOf('#'))
    const hashClass = existingHashtags.find(currentTag => currentTag === tag) ? 'hashtag': 'new-hashtag'
    // const hashtagElement = document.createElement('span');
    // hashtagElement.textContent = '#' + tag;
    // hashtagElement.classList.add(hashClass);
    content += `<span class="${hashClass}">#${tag}</span>`
    
    tweetInput.innerHTML = content;
    // tweetInput.appendChild(document.createTextNode(' '));
    moveCursorToEnd2(tweetInput)
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
    const lastHashSignIndex = str.lastIndexOf('#');
    // return lastHashSignIndex === 0 || str.substring(lastHashSignIndex - 1 , lastHashSignIndex) === ' '
    if (lastHashSignIndex === 0) {
      return true;
      
    } else if(str.substring(lastHashSignIndex - 1 , lastHashSignIndex) === ' ') {
      return true
    } else {
        return false
    }
  }

  function moveCursorToEnd2(element) {
    const range = document.createRange();
    const selection = window.getSelection();
  
    range.selectNodeContents(element);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
    element.focus();
  }
  tweetInput.addEventListener('input', togglePLaceholderClass);
  
 
  togglePLaceholderClass();
  
  
  tweetInput.addEventListener('keyup', handleKeyUp);