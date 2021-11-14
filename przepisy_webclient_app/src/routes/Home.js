import { useContext, useEffect, useMemo, useState } from "react";
import axios from 'axios';
import { Buttons, RecipeComp } from "../components";
import {UserContext} from '../data/User';
import { API_ADDRESS } from "../data/API_VARIABLES";

const Home = () => {
  const { USER } = useContext(UserContext);
  const [imageURL, setImageURL] = useState("");

  const getData = () => 
  fetch(`${API_ADDRESS}/images/`, {
    method: 'get',
    headers: { 
        'Access-token': USER.token,
        'Content-Type': 'application/json'
    }
  })
  .then( res => {
    try{
      console.log(res);
      return res.json();
    }catch (err){
      console.log(err);
    };
  })
  .then((d) => {
    console.log(d.imageURL);
    setImageURL(d.imageURL);
  })
  .catch(err => {
    console.log(err);
  });

  useEffect(() => {
    getData();
  },[]);

  return (
    <div>
    <h2>Home</h2>
    {imageURL != "" ?
    <img src={imageURL} alt="Zdjęcie z serwera"/>
      :
    <p>Zdjęcie domyślne</p>}
    <h2>TEST</h2>
    <ImageInput />
    </div>
  );
}

/*
  TODO: 
    - dodać callback ( do większych formularzy - zwracać id i url dodanego zdjęcia)
    - formularz dla przepisu na dodawanie większej ilości zdjęć (ma id i url -> wyświetlanie zdjęć i dodawanie do bazy danych potem
*/

const ImageInput = () => {

	const [ selectedFile, setSelectedFile ] = useState(null);
	
	const onFileChange = event => {
    setSelectedFile( event.target.files[0] );
	};
	
	const onFileUpload = () => {   
    let form = new FormData();
    form.append(
      'uploaded_image',
      selectedFile
    );
    console.log(selectedFile);
    axios.post(`${API_ADDRESS}/images/`, form)
    .then(v => {
      console.log(`status: ${v.status}`);
      console.log(`id: ${v.data.id}`);
      console.log(`url: ${API_ADDRESS}${v.data.url}`);
    })
	};

	const FileData = () => {
    if (selectedFile) {    
      return (
        <div>
          <h2>File Details:</h2>
          <p>File Name: {selectedFile.name}</p>
          <p>File Type: {selectedFile.type}</p>
        </div>
      );
    } else {
      return (
        <div>
          <br />
          <h4>Choose before Pressing the Upload button</h4>
        </div>
      );
    }
	};
	
	return (
		<div>
			<h1>
			GeeksforGeeks
			</h1>
			<h3>
			File Upload using React!
			</h3>
			<div>
				<input type="file" onChange={v => onFileChange(v)} />
				<button onClick={() => onFileUpload()}>
				Upload!
				</button>
			</div>
		  <FileData />
		</div>
	);
}

export default Home;