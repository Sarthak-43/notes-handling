import React, { useEffect, useState, useContext } from "react";
import Nav from "../components/Nav";
import axios from "axios";
import { authDatacontext } from "../context/AuthContext";

function View() {
  const [allNotes, setAllNotes] = useState([]);
  const { serverURL } = useContext(authDatacontext);

  useEffect(() => {
    const fetchAllNotes = async () => {
      try {
        const res = await axios.get(`${serverURL}/api/notes/all`, {
          withCredentials: true,
        });
        setAllNotes(res.data);
      } catch (error) {
        console.error("Failed to load notes:", error.message);
      }
    };

    fetchAllNotes();
  }, []);

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <Nav />
      <div className="px-4 py-6">
        <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">
          All User's Notes
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allNotes.map((note, idx) => (
            <div
              key={idx}
              className="bg-white shadow-md rounded-xl p-4 border border-gray-200 flex flex-col justify-between hover:shadow-lg transition-all"
            >
              <div className="mb-2">
                <h3 className="text-lg font-semibold text-blue-800">
                  {note.title}
                </h3>
                <p className="text-sm text-gray-600">
                  by{" "}
                  <span className="font-medium">
                    {note.author?.UserName || "Unknown"}
                  </span>
                </p>
              </div>

              <p className="text-gray-700 text-sm mb-3 whitespace-pre-wrap">
                {note?.content}
              </p>

              {note.fileUrl && (
                <div className="flex justify-between gap-3 text-sm">
                  <a
                    href={note.fileUrl.replace("/upload/", "/upload/fl_attachment/")}
                    download
                    className="text-green-600 underline hover:text-green-800"
                  >
                    Download
                  </a>
                  <a
                    href={note.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    Preview
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default View;
