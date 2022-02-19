import React, { useState, useEffect, useCallback, useRef } from "react";
import { Modal, Note } from "./components";
import io, { Socket } from "socket.io-client";
import "./App.css";
import { UserType, NoteOnUpdate } from "./App.types";
import { nanoid } from "nanoid";
import { useLocalStorage, writeStorage } from "@rehooks/local-storage";

const LOCAL_STORAGE_KEY = "react-notes";

const App = () => {
  const notInitialRender = useRef(false);
  const [localUserData] = useLocalStorage<UserType>(LOCAL_STORAGE_KEY);
  const [socket, setSocket] = useState<Socket>();
  const [user, setUser] = useState<UserType>();
  const [allUsers, setAllUsers] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isModalOpen = !Boolean(user);

  // Handlers
  const createNewNote = ({ pageX, pageY }: any) => {
    const muiPalette = [
      "primary.main",
      "secondary.main",
      "error.main",
      "warning.main",
      "info.main",
      "success.main",
    ];

    const bgcolor = muiPalette[(muiPalette.length * Math.random()) | 0];

    if (!user) return;
    const noteId = nanoid();
    const note = {
      id: noteId,
      posX: pageX,
      posY: pageY,
      value: "",
      color: bgcolor,
    };
    setUser({ ...user, notes: [...user.notes, note] });
  };

  const handleNoteUpdate: NoteOnUpdate = useCallback((id, value) => {
    setUser((prevState) => {
      if (!prevState) return;
      const isValueUpdate = typeof value === "string";
      const updatedNotes = prevState.notes.map((note) => {
        if (note.id === id) {
          return isValueUpdate
            ? { ...note, value }
            : { ...note, posX: value.x, posY: value.y };
        }
        return note;
      });
      return { ...prevState, notes: updatedNotes };
    });
  }, []);

  const handleNewUser = (userName: string) => {
    socket?.emit("new user", {
      userName,
    });
  };

  // Socket initialization and listeners
  useEffect(() => {
    const newSocket = io("http://localhost:8080", {
      withCredentials: true,
    });
    setSocket(newSocket);

    // Check local storage and make connection with websocket
    // On successful connection it will return user data from server
    if (localUserData) {
      newSocket.emit("new user", localUserData);
    } else {
      setIsLoading(false);
    }

    // Listeners
    newSocket.on(
      "authentication",
      ({ allUsers, authenticated, userName, ...data }) => {
        if (authenticated) {
          console.log("Authentication successful");
          setAllUsers(allUsers);
          setUser({ userName, ...data });
          setIsLoading(false);
        } else {
          // Show message warning or display input field error
          console.log("Authentication error");
        }
      }
    );

    newSocket.on("all users", (data) => {
      setAllUsers(data);
    });

    // Cleanup
    return () => {
      newSocket.close();
    };
  }, [setSocket, setUser, setAllUsers, setIsLoading]);

  // Update data in local storage and server (Skip first render)
  useEffect(() => {
    if (!user) return;
    if (notInitialRender.current) {
      writeStorage(LOCAL_STORAGE_KEY, user);
      socket?.emit("update user", user);
    } else {
      notInitialRender.current = true;
    }
  }, [user]);

  return (
    <div className='App'>
      <div className='whiteboard' onClick={createNewNote} />
      <Modal open={isModalOpen} loading={isLoading} onSubmit={handleNewUser} />
      {allUsers
        ?.filter(({ userName }) => userName !== user?.userName)
        .map(({ userName, notes }) =>
          notes.map((note) => (
            <Note userName={userName} key={note.id} {...note} />
          ))
        )}
      {user?.notes.map((note) => (
        <Note
          isOwner
          userName={user.userName}
          onUpdate={handleNoteUpdate}
          key={note.id}
          {...note}
        />
      ))}
    </div>
  );
};

export default App;
