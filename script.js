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
const hashtagRegex = /#[a-zA-Z0-9]{1,}/gm;


function togglePLaceholderClass() {
  if (tweetInput.textContent.trim() === '') {
    tweetInput.classList.add('placeholder');
  } else {
    tweetInput.classList.remove('placeholder');
  }
}

  function handleKeyUp(event) {    
    const tweet = tweetInput.textContent;
    const cursorPosition = tweetInput.selectionStart;
    const prefix = tweet.substring(0, cursorPosition);
    const lastChar = tweetInput.textContent.slice(-1)[0]
  
    const hasMatches = hashtagRegex.test(prefix);
  

    if (lastChar === '#' && canShowSuggestions(prefix)) {
      showSuggestions(existingHashtags);
    } else if (hasMatches) {
      const lastHashtag = prefix.match(hashtagRegex).slice(-1)[0];
      const matchedHashtags = getMatchedHashtags(lastHashtag.substring(1));
      console.log('lastHashtag, matchedHashtags', lastHashtag, matchedHashtags);
      if (matchedHashtags.length > 0) {
        showSuggestions(matchedHashtags);
      } else {
        showSuggestions(Array(lastHashtag.substring(1)));        
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
  // const matchedHashtags = getMatchedHashtags(hashtag);

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
    content += `<span class="${hashClass}">#${tag}</span>`    
    tweetInput.innerHTML = content;
    moveCursorToEnd2(tweetInput)
    tweetInput.focus();
    hideSuggestions();
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
    const lastHashIndex = str.lastIndexOf('#');
    if (lastHashIndex === 0) {
      return true;
      
    } else if(str.substring(lastHashIndex - 1 , lastHashIndex) === ' ') {
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


  //Main
  tweetInput.addEventListener('input', togglePLaceholderClass); 
  togglePLaceholderClass();  
  tweetInput.addEventListener('keyup', handleKeyUp);