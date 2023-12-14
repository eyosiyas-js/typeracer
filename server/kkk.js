var generate = function (numRows) {
  if (numRows === 0) return [];

  const triangle = [[1]];

  for (let i = 1; i < numRows; i++) {
    const prevRow = triangle[i - 1];

    console.log(prevRow)
    // const currentRow = [1];

    // for (let j = 1; j < i; j++) {
    //   currentRow.push(prevRow[j - 1] + prevRow[j]);
    // }

    // currentRow.push(1);
    // triangle.push(currentRow);
  }
//   console.log(triangle);
  return triangle;
};

generate(3);
