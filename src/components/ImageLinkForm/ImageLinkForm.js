import "./ImageLinkForm.css";

const ImageLinkForm = ({ onInputChange, onButtonSubmit }) => {
  return (
    <div className='f3'>
      <p>
        {"This Magic brain will detect faces in your pictures. Git it a try!"}
      </p>
      <div className=''>
        <div className='form center pa4 br3 shadow-5'>
          <input
            className='f4 pa2 w-70 center'
            placeholder='Enter a link to the image...'
            type='text'
            onChange={onInputChange}
          ></input>
          <button
            className='w-30 grow f4 link ph3 pv2 dib white bg-light-purple'
            onClick={onButtonSubmit}
          >
            {"Detect"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageLinkForm;
