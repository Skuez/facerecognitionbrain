import React, { useState, useEffect } from "react";
import "./App.css";
import Particles from "react-particles-js";
import Container from "./components/Container/Container";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Navigation from "./components/Navigation/Navigation";
import Signin from "./components/Signin/Signin";
import Register from "./components/Register/Register";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";

const particlesOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 200,
      },
    },
  },
};

const initialState = {
  input: "",
  imageUrl: "",
  box: {},
  route: "signin",
  isSignedIn: false,
  user: {
    id: "",
    name: "",
    email: "",
    entries: 0,
    joined: "",
  },
};

export default function App() {
  const [input, changeInput] = useState(initialState.input);
  const [imageUrl, changeImageUrl] = useState(initialState.imageUrl);
  const [box, changeBox] = useState(initialState.box);
  const [route, changeRoute] = useState(initialState.route);
  const [isSignedIn, changeIsSignedIn] = useState(initialState.isSignedIn);
  const [user, changeUser] = useState(initialState.user);

  const loadUser = (user) => {
    changeUser({
      id: user.id,
      name: user.name,
      email: user.email,
      entries: user.entries,
      joined: user.joined,
    });
  };

  const onInputChange = (event) => {
    changeInput(event.target.value);
    /* console.log(user); */
  };

  const calculateFaceLocation = (data) => {
    const clarifaiFace =
      data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("inputimage");
    const width = Number(image.width);
    const height = Number(image.height);

    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height,
    };
  };

  const displayFaceBox = (box) => {
    changeBox(box);
  };

  useEffect(() => {
    changeImageUrl(input);
    changeBox({});
  }, [input]);

  const onButtonSubmit = () => {
    fetch("http://localhost:3000/imageurl", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: imageUrl,
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response) {
          fetch("http://localhost:3000/image", {
            method: "put",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: user.id,
            }),
          })
            .then((response) => response.json())
            .then((count) => {
              /* console.log(count); */
              changeUser({ ...user, entries: count });
            })
            .catch(console.log);
        }
        displayFaceBox(calculateFaceLocation(response));
      })
      .catch((err) => console.log(err));
  };

  const onRouteChange = (route) => {
    if (route === "signout") {
      changeInput(initialState.input);
      changeImageUrl(initialState.imageUrl);
      changeBox(initialState.box);
      changeRoute(initialState.route);
      changeIsSignedIn(initialState.isSignedIn);
      changeUser(initialState.user);
    } else if (route === "home") {
      changeIsSignedIn(true);
    }
    changeRoute(route);
  };

  return (
    <Container>
      <Particles className="particles" params={particlesOptions} />
      <Navigation isSignedIn={isSignedIn} onRouteChange={onRouteChange} />
      <Logo />
      {route === "home" ? (
        <div>
          <Rank name={user.name} entries={user.entries} />
          <ImageLinkForm
            onInputChange={onInputChange}
            onButtonSubmit={onButtonSubmit}
          />
          <FaceRecognition box={box} imageUrl={imageUrl} />
        </div>
      ) : route === "signin" ? (
        <Signin onRouteChange={onRouteChange} loadUser={loadUser} />
      ) : (
        <Register onRouteChange={onRouteChange} loadUser={loadUser} />
      )}
    </Container>
  );
}
