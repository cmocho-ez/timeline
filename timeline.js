import { data } from "./data.js";

function init() {
  // Creating events
  const finData = data
    .map((event) => {
      return { ...event, date: event.date.substring(0, 10) };
    })
    .sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    });

  // Showing on the table
  fillTable(finData);

  // Showing on the timeline
  const uniqueData = Object.groupBy(finData, ({ date }) => date);
  const transformedData = Object.entries(uniqueData).map((entry) => {
    return { date: entry[0], events: entry[1].map(({ title }) => title) };
  });

  fillTimeline(transformedData);

  // Prepare to drag
  prepareToDrag();
  prepareToScroll();
}

function fillTable(data) {
  const table = document.querySelector(".datatable table");
  const tbody = table.querySelector("tbody");

  tbody.innerHTML = "";

  data.forEach((event) => {
    const row = document.createElement("tr");

    const date = document.createElement("td");
    date.textContent = event.date;

    const title = document.createElement("td");
    title.textContent = event.title;

    row.appendChild(date);
    row.appendChild(title);

    tbody.appendChild(row);
  });
}

function fillTimeline(data) {
  const timeline = document.querySelector(".timeline");
  const events = timeline.querySelector(".events");

  data.forEach((event) => {
    const divDay = document.createElement("div");
    divDay.classList.add("day");

    const date = new Date(event.date);
    const content = event.events;

    content.forEach((text) => {
      const aside = document.createElement("aside");
      aside.classList.add("event");
      aside.textContent = text;

      divDay.appendChild(aside);
    });

    const span = document.createElement("span");
    span.textContent =
      new Intl.DateTimeFormat("en-GB", {
        month: "long",
      })
        .format(date)
        .substring(0, 3) +
      " " +
      date.getDate();

    divDay.appendChild(span);

    events.appendChild(divDay);
  });

  // Positioning the events on the timeline
  const eventList = events.querySelectorAll(".event");

  let previousElementLimit = 0;
  let i = 0;

  eventList.forEach((el) => {
    const currentElementPos = el.getBoundingClientRect().left;

    if (currentElementPos < previousElementLimit) {
      i++;
      el.style.top = `${i * 20 + 4}px`;
    } else {
      i = 0;
      el.style.top = `${i * 20 + 4}px`;
      previousElementLimit = el.getBoundingClientRect().right + 10;
    }
  });
}

function prepareToDrag() {
  const top = document.querySelector(".timeline .tl-top");

  let isDragging = false;
  let initialX = 0;

  top.addEventListener("mousedown", (e) => {
    isDragging = true;
    initialX = e.clientX;
  });

  document.addEventListener("mousemove", (e) => {
    if (isDragging) {
      const offset = e.clientX - initialX;
      top.scrollLeft -= offset;

      initialX = e.clientX;
    }
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });
}

function prepareToScroll() {
  const timeline = document.querySelector(".timeline");
  const top = document.querySelector(".timeline .tl-top");

  timeline.addEventListener("wheel", (e) => {
    top.scrollLeft += e.deltaY;
  });
}

init();
