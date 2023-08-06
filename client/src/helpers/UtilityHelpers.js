export function valueText(value) {
  if (value == 0) {
    return "low";
  } else if (value == 50) {
    return "medium";
  } else if (value == 100) {
    return "high";
  }
}

export function getSynonyms(word, number) {
  const result = synonyms(word);
  console.log("result", result);
  const resultSet = new Set([word]);
  for (const x in result) {
    result[x].forEach((y) => resultSet.add(y));
  }
  // filter out one word synonyms
  return new Set(
    Array.from(resultSet).filter((x, i) => i < number && x.length >= 2)
  );
}
