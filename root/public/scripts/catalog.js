const searchForm = document.querySelector("#catSearch");
const catalogBox = document.querySelector(".catalogBox");
const bookSearchInput = document.querySelector("#bookSearch");

searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  let bookName = bookSearchInput.value;
  console.log(bookName);

  if (!bookName) {
    await axios
      .get("/user/catalog/")
      .then((response) => {
        // Handle the response data
        console.log(response.data);
      })
      .catch((error) => {
        // Handle the error
        console.error(error);
      });
  } else {
    //console.log("before");
    await axios
      .get("/user/catalog", {
        params: {
          bookName: bookName,
        },
      })
      .then((response) => {
        let books = response.data;

        for (let book of books) {
          let { book_id, title, image, branch_name, name } = book;
          const card = document.createElement("div");
          card.classList.add("card");
          card.addEventListener("click", async (e) => {
            if (e.target.classList.contains("check-out")) {
              try {
                await axios
                  .put("/user/catalog/", {
                    book_id: book_id,
                    is_available: false,
                  })
                  .then(async (response) => {
                    let user = response.data;
                    let aUser = user.user;
                    console.log(user);
                    await axios.post("/user/catalog/", {
                      book_id: book_id,
                      branch_name: branch_name,
                      email: aUser.email,
                    });
                  });
                alert("Book successfully Checked Out");
                window.location.href = "/user/catalog/";
              } catch (err) {
                console.log("front end error", err);
              }
            }
          });

          const img = document.createElement("img");
          img.setAttribute("id", "cover");
          img.src = image;
          card.appendChild(img);

          const cardDetails = document.createElement("div");
          cardDetails.classList.add("cardDetails");

          const authorDiv = document.createElement("div");
          authorDiv.classList.add("authorName");
          authorDiv.textContent = name;
          cardDetails.appendChild(authorDiv);

          const titleDiv = document.createElement("div");
          titleDiv.classList.add("title");
          titleDiv.textContent = title;
          cardDetails.appendChild(titleDiv);

          const branchName = document.createElement("div");
          branchName.classList.add("bookId");
          branchName.textContent = branch_name;
          cardDetails.appendChild(branchName);

          const bookId = document.createElement("div");
          bookId.classList.add("bookId");
          bookId.textContent = book_id;
          cardDetails.appendChild(bookId);

          const btn = document.createElement("button");
          btn.classList.add("check-out");
          btn.setAttribute("id", bookId);
          btn.innerHTML = "Check Out";
          cardDetails.appendChild(btn);

          card.appendChild(cardDetails);
          catalogBox.appendChild(card);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
});
