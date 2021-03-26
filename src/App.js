import React, { useState, useEffect } from "react";
import "./App.css";
import Particles from "react-particles-js";
import Clarifai from "clarifai";
import Container from "./components/Container/Container";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Navigation from "./components/Navigation/Navigation";
import Signin from "./components/Signin/Signin";
import Register from "./components/Register/Register";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";

const app = new Clarifai.App({
  apiKey: "094cb729655f4314b15eff02916dd7ab",
});

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

export default function App() {
  const [input, changeInput] = useState("");
  const [imageUrl, changeImageUrl] = useState("");
  const [box, changeBox] = useState({});
  const [route, changeRoute] = useState("signin");
  const [isSignedIn, changeIsSignedIn] = useState(false);

  const onInputChange = (event) => {
    changeInput(event.target.value);
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
    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, imageUrl)
      .then((response) => displayFaceBox(calculateFaceLocation(response)))
      .catch((err) => console.log(err));
  };

  const onRouteChange = (route) => {
    if (route === "signout") {
      changeIsSignedIn(false);
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
          <Rank />
          <ImageLinkForm
            onInputChange={onInputChange}
            onButtonSubmit={onButtonSubmit}
          />
          <FaceRecognition box={box} imageUrl={imageUrl} />
        </div>
      ) : route === "signin" ? (
        <Signin onRouteChange={onRouteChange} />
      ) : (
        <Register onRouteChange={onRouteChange} />
      )}
    </Container>
  );
}
