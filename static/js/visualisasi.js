let modal = document.querySelector(".modal__box");
let modalParent = document.querySelector(".modal");

const container = document.getElementById("visualization");
const search = document.getElementById("search");

let options = {
  groupOrder: "content", // groupOrder can be a property name or a sorting function
};

const showModal = (modalParent, modal, item, gerubs) => {
  if (modal.childNodes.length > 0) {
    let child = modal.lastElementChild;
    while (child) {
      modal.removeChild(child);
      child = modal.lastElementChild;
    }
  }

  JSON.parse(item.content).forEach((e) => {
    // console.log(e)

    let divIsi = document.createElement("div");
    divIsi.className = "modal__isi";

    let p = document.createElement("p");
    let waqtu = new Date(e.timestamp);
    waqtu = `${waqtu.getDate()} - ${
      waqtu.getMonth() + 1
    } - ${waqtu.getFullYear()} ${waqtu.getHours()}:${waqtu.getMinutes()}`;
    let pText = document.createTextNode(waqtu);
    p.appendChild(pText);

    divIsi.appendChild(p);

    p = document.createElement("p");
    pText = document.createTextNode(
      e.fromMe
        ? "Saya"
        : e.remoteResourceDisplayName
        ? e.remoteResourceDisplayName
        : gerubs[item.id].content
    );
    p.appendChild(pText);

    divIsi.appendChild(p);

    p = document.createElement("p");
    pText = document.createTextNode(e.text);
    p.appendChild(pText);

    divIsi.appendChild(p);

    modal.appendChild(divIsi);
  });

  modalParent.classList.add("show");
};

const createVisual = (container, options, gerubs, aitems) => {
  let timeline = new vis.Timeline(container);
  timeline.setOptions(options);
  timeline.setGroups(gerubs);
  timeline.setItems(aitems);

  timeline.on("select", function (properties) {
    // console.log(properties)
    aitems.forEach((item) => {
      if (item.id == properties.items) {
        showModal(modalParent, modal, item, gerubs);
      }
    });
  });
};

createVisual(container, options, gerubs, aitems);

search.addEventListener("keyup", () => {
  let searchVal = search.value.toUpperCase();

  let items = [...aitems];

  let contentItems;
  items = items.filter((item) => {
    contentItems = JSON.parse(item.content);
    contentItems = contentItems.filter((ci) => {
      if (ci.text) {
        if (ci.text.toUpperCase().indexOf(searchVal) > -1) {
          return true;
        }
      }
    });
    contentItems = JSON.stringify(contentItems);
    // console.log(contentItems);
    return contentItems != "[]";
  });

  // console.log(items[0].id);
  if (container.childNodes.length > 0) {
    let child = container.lastElementChild;
    while (child) {
      container.removeChild(child);
      child = container.lastElementChild;
    }
  }

  createVisual(container, options, gerubs, aitems);
});

modalParent.addEventListener("click", () => {
  modalParent.classList.toggle("show");
});
