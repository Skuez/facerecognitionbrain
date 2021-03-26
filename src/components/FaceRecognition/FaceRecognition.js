import "./FaceRecognition.css";

const FaceRecognition = ({ imageUrl, box }) => {
  return (
    <div className="mt2 center ma">
      <div className="absolute">
        <img
          id="inputimage"
          style={{ maxWidth: "700px", height: "auto" }}
          alt="Error: img source not correct."
          src={imageUrl}
        />
        <div
          className="bounding-box"
          style={{
            top: box.topRow,
            right: box.rightCol,
            bottom: box.bottomRow,
            left: box.leftCol,
          }}
        ></div>
      </div>
    </div>
  );
};

export default FaceRecognition;
