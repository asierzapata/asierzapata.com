import { toString } from 'mdast-util-to-string';

export function remarkReadingTime() {
  return function (tree, { data }) {
    const textOnPage = toString(tree);
    const words = textOnPage.split(/\s+/).length;
    const readingTime = Math.ceil(words / 200);
    
    data.astro.frontmatter.minutesRead = readingTime;
  };
}
