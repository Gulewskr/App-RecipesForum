import UF from '../data/UserTypes';

const ProfileComp = (props) => {
    const {user} = props;
    return(
        <div className="profile-cont">
            <div className="pc-img">
                <img src={user.imageURL ? user.imageURL : "http://localhost:3001/images/static/profile.png"} />
            </div>
            <div style={{display: 'flex', flexDirection: "column", paddingLeft:'15px'}}>
                <div className="cR-nick" onClick={(e) => {
                    e.stopPropagation(); 
                    window.location.replace(`/profile?id=${user.id_}`);
                }}>{user.name}</div>
                <div className="cR-type">{UF.GetStyledTypeName(user.type)}</div>
            </div>
        </div>
    );
}

export {ProfileComp}