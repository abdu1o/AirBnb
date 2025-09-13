export function pluralize(count, one, few, many) {
  if (count % 10 === 1 && count % 100 !== 11) {
    return one;
  } else if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) {
    return few;
  } else {
    return many;
  }
}