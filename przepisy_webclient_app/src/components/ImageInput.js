import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {API_ADDRESS} from '../data/API_VARIABLES';

const RecipeImagesForm = (props) =>
{
    //cb(value, true = add / false = remove)
    const {images, postAddress, token, callback} = props;
    
    const idTable = useMemo(() => images ? images.map(({id_}) => id_) : [], []);
    const [imagesTable, setImagesTable] = useState(images ? images : []);
    
    useEffect(() => callback ? callback(idTable) : console.log("nie ustawiono funkcji zwrotnej"), [idTable]);
    function addID(v){
        if(idTable.indexOf(v) == -1)
        {
            idTable.push(v);
            return 1;
        }
        console.log("Próbowano dodać id, które już jest w tabeli");
        return 0;
    }

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

    function setMainImage(v){
        let id = idTable.indexOf(v);
        if( id != -1 )
        { 
            let firstID = idTable.splice( id, 1)[0];
            idTable.unshift(firstID);
            let tmp = [...imagesTable];
            let first = tmp.splice(id, 1)[0];
            tmp.unshift(first);
            setImagesTable(tmp);
        }
        else console.log("Próbowano usunąć id, którego już nie ma w tabeli");
    }

    const SingleImageFromArray = (props) => {
        const {id, url, mainID} = props;
        return (
            <div className="singleImage" key={id}>
                <img  src={url} alt={id} onClick={() => setMainImage(id)}/>
                {id == mainID && <div>Main Image</div>}
                <button onClick={() => removeID(id)}>Cofnij</button>
            </div>
        )
    }

    function addImage(id, url){
        console.log(`Dodaję do tabel ${id}  ${url}`);
        if(addID(id)) 
        {
            let element = {id_ : id, imageURL: url}
            setImagesTable([...imagesTable, element]);
        }   
    }

    return(
        <div>
            <ImageInput postAddress={postAddress} token={token} cb={addImage} />
            <div className="imageDrawer">
                { imagesTable.map(({id_, imageURL} ) => <SingleImageFromArray id={id_} url={imageURL} mainID={imagesTable[0].id_} />) }
            </div>
        </div>
    )
}

const ProfileImagesForm = (props) =>
{
    const {image, postAddress, token, cb} = props;
    
    const [currentImage, setCurrentImage] = useState(image ? image : {id: "", imageURL: ""});
    const newImage = (id, url) => {
        setCurrentImage(
            {
                id: id,
                imageURL: url
            }
        )
    }

    return(
        <div>
            <div id="imgEditCont">
            {currentImage.imageURL != "" ?
                <img  src={currentImage.imageURL} alt={currentImage.id} />
                    :
                <div>Brak zdjęcia profilowego</div>
            }
            </div>
            <ImageInput postAddress={postAddress} token={token} cb={newImage} />
            <div id="SaveImage" onClick={() => cb(currentImage.id)}>Zapisz zmianę</div>
        </div>
    )
}

const ImageInput = (props) => {

    const { postAddress, cb } = props;
    const { token } = props;
    const [ selectedFile, setSelectedFile ] = useState(null);
	
	const onFileChange = event => {
        setSelectedFile( event.target.files[0] );
	};
	
	const onFileUpload = () => {   
        let formData = new FormData();
        formData.append(
            'uploaded_image',
            selectedFile
        );
        axios.post(`${API_ADDRESS}${postAddress}/`, formData, { headers: {'Access-token': token, 'Content-Type': 'application/json' }})
        .then( v  => {
            //console.log(`status: ${v.status}`);
            //console.log(`id: ${v.data.id}`);
            //console.log(`url: ${API_ADDRESS}${v.data.url}`);
            cb(v.data.id, `${API_ADDRESS}${v.data.url}`);
        })
        .catch(e => console.log(e));
	};
	
	return (
        <div className="imageInsertBar">
            <input type="file" onChange={v => onFileChange(v)} />
            <button onClick={() => onFileUpload()}>Dodaj!</button>
        </div>
	);
}

export { ImageInput, ProfileImagesForm, RecipeImagesForm }