const container = document.querySelector(".container");

container.addEventListener("click", async (e) => {
  if (e.target.classList.contains("return-book")) {
    const loanId = e.target.value;
    const loan_id = parseInt(loanId);

    try {
      await axios.delete("/user/returns/", {
        data: {
          loan_id: loan_id,
        },
      });

      alert("Book successfully returned");
      window.location.href = "/user/returns/";
    } catch (err) {
      console.log("Frontend error:", err);
    }
  }
});
