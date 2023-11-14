import React from "react";

const NotificationCards = ({note}) => {
  const date = new Date(note.date);
const formattedDate = date.toLocaleString();
  return (
    <div class="mt-2 mb-5 px-6 py-4 bg-white rounded-lg shadow w-3/3 m-auto">
      <div class=" inline-flex items-center justify-between w-full">
        <div class="inline-flex items-center">
          <h2 class="font-bold text-2xl  text-gray-800">{note.pm_firstname} {note.pm_lastname}</h2>
        </div>

        <p class="text-xs text-gray-500">{formattedDate}</p>
      </div>
      <h5 class="font-bold text-base text-gray-800">{note.subject}</h5>
      <p class="mt-1 text-sm">{note.content}</p>
    </div>
  );
};

export default NotificationCards;
