const result = document.querySelector(".result");
const urlInput = document.querySelector("#urlInput");

function getList() {
  const str = urlInput.value;
  fetch("/getList", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ str }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      const { playListName, list } = data[0];
      const urlStr = list.join("\n");
      result.innerHTML = ` <h3>${playListName ? playListName : "NULL"}</h3>
      <pre class="urls">${urlStr}</pre>`;
    })
    .catch(console.error);
}
