import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {API_ADDRESS} from '../data/API_VARIABLES';

const RecipeImagesForm = (props) =>
{
    //cb(value, true = add / false = remove)
    const {postAddress, token} = props;
    const idTable = useMemo(() => [], []);
    const [imagesTable, setImagesTable] = useState([]);
    //TODO !!!!!!!:
    /*
    -zrobić kurwa żęby działąło za dużo usuwa nie wiadomom ocb sadge wrr
    */
    
    function addID(v){
        if(idTable.indexOf(v) == -1)
        {
            idTable.push(v);
            return 1;
        }
        console.log("Próbowano dodać id, które już jest w tabeli");
        return 0;
    }

    /*function logIDs(v, table){
        console.log(`wciśnięto: ${v}`);
        let t = idTable.indexOf(v);
        console.log(`indeks: ${t}`);
        console.log(`długość ids ${idTable.length}`);
        console.log(`długość obrazów ${imagesTable.length}`);
        console.log(`długość obrazów lokalnych?? ${table}`);
    }*/

    function removeID(v){
        //console.log(`usuwam ${v}`);
        let id = idTable.indexOf(v);
        if( id != -1 )
        { 
            idTable.splice( id, 1);
            let tmp = [...imagesTable];
            tmp.splice(id, 1);
            setImagesTable(tmp);
        }
        else console.log("Próbowano usunąć id, którego już nie ma w tabeli");
    }

    const SingleImageFromArray = (props) => {
        const {id, url} = props;
        return (
            <div key={id}>
                <img  src={url} alt={id} />
                <button onClick={() => removeID(id)}>Cofnij</button>
            </div>
        )
    }

    function addImage(id, url){
        console.log(`Dodaję do tabel ${id}  ${url}`);
        console.log(imagesTable.length);
        if(addID(id)) 
        {
            let element = {id : id, url: url}
            setImagesTable([...imagesTable, element]);
        }   
    }

    return(
        <div>
            
            <p>Formularz:</p>
            <ImageInput postAddress={postAddress} token={token} cb={addImage} />

            <p>Indeksy: {idTable.join(",")}</p>
            <p>Dlugości: {imagesTable.length}</p>
            <p>Dodane:</p>
            { imagesTable.map(({id, url} ) => <SingleImageFromArray id={id} url={url} />) }
        </div>
    )
}

const ProfileImagesForm = (props) =>
{
    
}

const ImageInput = (props) => {

    const { postAddress, cb } = props;
    const { token } = props;
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
        axios.post(`${API_ADDRESS}${postAddress}/`, form, { headers: {'Access-token': token, 'Content-Type': 'application/json' }})
        .then( v  => {
            console.log(`status: ${v.status}`);
            console.log(`id: ${v.data.id}`);
            console.log(`url: ${API_ADDRESS}${v.data.url}`);
            cb(v.data.id, `${API_ADDRESS}${v.data.url}`);
        })
        .catch(e => console.log(e));
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

export { ImageInput, ProfileImagesForm, RecipeImagesForm }