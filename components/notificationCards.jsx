import React from "react";

const NotificationCards = () => {
  return (
    <div class="mt-2 mb-5 px-6 py-4 bg-white rounded-lg shadow w-3/3 m-auto">
      <div class=" inline-flex items-center justify-between w-full">
        <div class="inline-flex items-center">
          <h2 class="font-bold text-2xl  text-gray-800">Sender</h2>
        </div>

        <p class="text-xs text-gray-500">Time</p>
      </div>
      <h5 class="font-bold text-base text-gray-800">Subject</h5>
      <p class="mt-1 text-sm">Dear Student</p>
    </div>
  );
};

export default NotificationCards;
