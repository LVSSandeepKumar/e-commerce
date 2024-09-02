export default function extractHashtags(content) {
    const contentStr = JSON.stringify(content);
    // Use a regular expression to find words that start with a '#'
    const hashtagPattern = /#\w+/g;
    // Match the pattern against the content and return the matches
    const hashtags = contentStr.match(hashtagPattern);
    // Remove the '#' from the hashtags and return the array
    return hashtags ? hashtags.map(tag => tag.slice(1)) : [];
  }