const getUrl = (page) =>
  `https://app.bombbomb.com/app/jobs/handyscripts/transferListUploadFailureToS3.php?pageSize=400&page=${page}`;

const range = (startingNumber, endingNumber) => {
  const returnVal = [];
  for (let i = startingNumber; i <= endingNumber; i++) {
    returnVal.push(i);
  }
  return returnVal;
};

const getPage = (page) => {
  return fetch(getUrl(page))
    .then((response) => response.text())
    .then((text) => {
      if (!text.toLowerCase().includes("great success")) {
        throw new Error("Failure");
      }
      console.log(text);
      return text;
    });
};

const logPage = (text, page) =>
  fetch("http://localhost:3000/api/create-page-data", {
    method: "post",
    body: JSON.stringify({
      responseContent: text,
      migrationId: "cl6l3xwof0023w6r5h5miudln",
      title: `${page}`,
    }),
  });

const getPages = async (startingPage, endingPage, chunkSize = 1) => {
  let chunk = [];

  for (let page of range(startingPage, endingPage)) {
    if (chunk.length >= chunkSize || page === endingPage) {
      const texts = await Promise.all(chunk.map(getPage));
      texts.forEach((text, i) => {
        page = chunk[i];
        logPage(text, page);
      });
      console.log("got pages: ", chunk);
      chunk = [];
    }
    if (chunk.length < chunkSize) {
      chunk.push(page);
    }
  }
};
