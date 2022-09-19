import JsonData from "./data.json" assert { type: "json" };

let data = JsonData;
let maintag = document.querySelector(".main");
let modalCancel = document.querySelector(".no");
let modalYes = document.querySelector(".yes");
let overLay = document.querySelector(".overlay");

// Fetch the data from Local Storage
if(localStorage.getItem("commentSection")) {
    data = JSON.parse(localStorage.getItem("commentSection"));
} else {
    localStorage.setItem("commentSection", JSON.stringify(JsonData));
}

let comments = data.comments;
console.log("comments : ", data.comments);

comments.forEach((item) => {
  displayData(maintag, item);
});

function displayData(targetTag = null, item, child = "") {
  let isReply = "";
  if (child.length > 0) {
    isReply = child;
  }
  let section = skeleton(item, isReply);

  // Finally add everything to main tag.
  if(child.length > 0) {
    targetTag.insertAdjacentElement("afterEnd", section);
  } else {
    targetTag.appendChild(section);
  }

  // After the current section rendered, display its replies
  let replies = item.replies;
  if (replies && replies.length > 0) {
    replies.forEach((ele) => {
      displayData(section, ele, "reply");
    });
  }
}

function skeleton(item, child = "") {
  let scoreSection = document.createElement("div");
  scoreSection.classList.add(`score-section`);

  let scoreWrapper = document.createElement("div");
  scoreWrapper.classList.add("score-wrapper");

  let addButton = document.createElement("button");
  addButton.classList.add("score-wrapper__add");
  addButton.textContent += "+";
  addButton.addEventListener("click", () => {
    item.score += 1;
    localStorage.setItem("commentSection", JSON.stringify(data));
    window.location.reload();
    console.log("item score : ", item.score);
  });

  let scoreNum = document.createElement("p");
  scoreNum.textContent += item.score;
  let subButton = document.createElement("button");
  subButton.classList.add("score-wrapper__sub");
  subButton.textContent += "-";
  subButton.addEventListener("click", () => {
    item.score -= 1;
    localStorage.setItem("commentSection", JSON.stringify(data));
    window.location.reload();
    console.log("item score : ", item.score);
  });

  // appending scoreing card
  scoreWrapper.appendChild(addButton);
  scoreWrapper.appendChild(scoreNum);
  scoreWrapper.appendChild(subButton);
  scoreSection.appendChild(scoreWrapper);

  // Details section

  let detailsSection = document.createElement("div");
  detailsSection.classList.add("details-section");

  // 2 seperate div's
  let firstDetails = document.createElement("div");
  firstDetails.classList.add("first-details");
  let secondDetails = document.createElement("div");
  secondDetails.classList.add("second-details");

  let imageDiv = document.createElement("img");
  imageDiv.src = item.user.image.png;

  let nameDiv = document.createElement("div");
  nameDiv.classList.add("name");
  nameDiv.textContent += item.user.username;

  let timeLine = document.createElement("div");
  timeLine.classList.add("timeline");
  timeLine.textContent += item.createdAt;

  // second section starts
  let reply = document.createElement("button");
  reply.classList.add("reply");

  if (child.length > 0) {
    let deleteButton = document.createElement("button");
    deleteButton.classList.add("delete_button");
    let deleteImage = document.createElement("img");
    deleteImage.src = "./images/icon-delete.svg";
    let spanDelete = document.createElement("span");
    spanDelete.textContent += "Delete";

    deleteButton.appendChild(deleteImage);
    deleteButton.appendChild(spanDelete);

    deleteButton.addEventListener("click", () => {
        overLay.classList.add("display-block");
        deleteCurrentSection(section, item);
    });

    secondDetails.appendChild(deleteButton);
  }

  let replyImage = document.createElement("img");
  replyImage.src = "./images/icon-reply.svg";
  let spanReply = document.createElement("span");
  spanReply.textContent += "Reply";

  reply.appendChild(replyImage);
  reply.appendChild(spanReply);

  // appending sections
  firstDetails.appendChild(imageDiv);
  firstDetails.appendChild(nameDiv);
  firstDetails.appendChild(timeLine);
  secondDetails.appendChild(reply);
  detailsSection.appendChild(firstDetails);
  detailsSection.appendChild(secondDetails);

  // Content message section
  let section = document.createElement("section");
  section.classList.add(`section`);
  if (child.length > 0) {
    section.classList.add("section__reply");
  }

  let contentSection = document.createElement("div");
  contentSection.classList.add(`content`);

  let message = document.createElement("div");
  message.classList.add("message");
  message.textContent += item.content;

  // appending the details in content section
  contentSection.appendChild(detailsSection);
  contentSection.appendChild(message);

  // appending section, main tag
  section.appendChild(scoreSection);
  section.appendChild(contentSection);

  // Reply Button
  reply.addEventListener("click", () => {
    let textAreaSection = buildReplySection(section, item);
    section.insertAdjacentElement("afterEnd", textAreaSection);
  });

  return section;
}

function buildReplySection(parentElement, item) {
  let section = document.createElement("section");
  section.classList.add("section");
  section.classList.add("reply_textarea");

  let imgTag = document.createElement("img");
  imgTag.src = "./images/favicon-32x32.png";

  let textArea = document.createElement("textarea");
  textArea.rows += 4;
  textArea.cols += 20;
  textArea.textContent += `Hi @${item.user.username}, `;

  let replyButton = document.createElement("button");
  replyButton.classList.add("reply-section__button");
  replyButton.textContent += "Reply";
  replyButton.addEventListener("click", () => {
    let textAreaContent = textArea.value;
    section.remove();

    let newObj = {};
    newObj["id"] = Math.floor(Math.random() * 100);
    newObj.createdAt = "just now";
    newObj.content = textAreaContent;
    newObj.replies = [];
    newObj.score = 0;
    newObj.user = {
      image: {
        png: "./images/favicon-32x32.png",
        webp: "./images/avatars/image-juliusomo.webp",
      },
      username: "Aadhavan",
    };

    // create a new comments section
    item.replies.push(newObj);

    // store new reply in local storage
    localStorage.setItem("commentSection", JSON.stringify(data));
  
    let newSkeleton = skeleton(newObj, "reply");
    parentElement.insertAdjacentElement("afterEnd", newSkeleton);
  });

  let cancelButton = document.createElement("button");
  cancelButton.classList.add("cancel-section__button");
  cancelButton.textContent += "Cancel";
  cancelButton.addEventListener('click', () => {
    section.remove();
  })

  let replyCancel = document.createElement('div');
  replyCancel.appendChild(replyButton);
  replyCancel.appendChild(cancelButton);

  section.appendChild(imgTag);
  section.appendChild(textArea);
  section.appendChild(replyCancel);

  return section;
}


function deleteCurrentSection(section, item) {
    modalCancel.addEventListener('click', () => {
        overLay.classList.remove("display-block");
    });
    modalYes.addEventListener('click', () => {
        section.remove();
        overLay.classList.remove("display-block");
    })
    
}