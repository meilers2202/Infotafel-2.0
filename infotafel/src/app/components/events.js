import axios from "axios";
import { useEffect, useState } from "react";

export default function Events({ isActive }) {
  const [event, setEvent] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:1337/api/events?populate=*`);
        setEvent(response.data.data);
      } catch (e) {
        console.log("The API request failed");
      }
    };
    fetchData();
  }, []);

  const tabIndexValue = isActive ? 0 : -1;
  const ariaHiddenValue = !isActive;

  return (
    <>
      {event.map((eventItem, index) => (
        <div
          key={index} // Always include a unique key when rendering lists in React
          className="w-full flex flex-col md:flex-row h-auto md:h-1000 items-center px-4 md:px-0"
          tabIndex={tabIndexValue}
          aria-hidden={ariaHiddenValue}
        >
          <div className="w-full md:w-7/12 flex flex-col mb-8 md:mb-0">
            <h2
              className="text-white text-3xl md:text-4xl font-bold mb-8 md:mb-20 mx-0 md:mx-20"
              tabIndex={tabIndexValue}
            >
              {eventItem.title}
            </h2>
            <p
              className="text-white text-base md:text-xl whitespace-pre-line ml-0 md:ml-20"
              tabIndex={tabIndexValue}
            >
              {eventItem.content}
            </p>
          </div>

          <div
            className="w-full md:w-5/12 mt-2 flex justify-center p-4 md:p-6"
            tabIndex={tabIndexValue}
            aria-hidden={ariaHiddenValue}
          >
            <img
              src={`placeholder.jpg`}
              className="object-cover w-64 h-64 md:w-[506px] md:h-[506px] rounded-[30px] border-6 border-solid border-white"
            />
          </div>
        </div>
      ))}
    </>
  );
}
