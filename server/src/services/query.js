const DEFAULT_PAGE_LIMIT = 0; //To return all
const DEFAULT_PAGE_NUMBER = 1; //To return all

function getPagination({limit, page}) {
  //We use Math.abs because it validates the negatives and also the strings
  page = Math.abs(page) || DEFAULT_PAGE_NUMBER; //It's like ?? in php
  limit = Math.abs(limit) || DEFAULT_PAGE_LIMIT;
  const skip = (page-1) * limit;

  return {
    skip,
    limit
  };
}

module.exports = {
  getPagination
}