const IsPremium = (v) => v <= 3
const IsMod = (v) => v <= 2
const IsAdmin = (v) => v == 1

const GetRecipeDivClass = (v) => {
    switch (Number(v)) {
        case 1 : return "adm-div";
        case 2 : return "mod-div";
        case 3 : return "prem-div";
        case 4 : return "norm-div";
        default : return "norm-div";
    }
}

const GetProfileImageClass = (v) => {
    switch (Number(v)) {
        case 1 : return "adm-img";
        case 2 : return "mod-img";
        case 3 : return "prem-img";
        case 4 : return "norm-img";
        default : return "norm-img";
    }
}

const GetNickNameStyle = (v) => {
    switch (Number(v)) {
        case 1 : return "adm-nick";
        case 2 : return "mod-nick";
        case 3 : return "prem-nick";
        case 4 : return "norm-nick";
        default : return "norm-nick";
    }
}

const GetTypeName = (v) => {
    switch (Number(v)) {
        case 1 : return "aministrator";
        case 2 : return "moderator";
        case 3 : return "premium";
        case 4 : return "";
        default : return "";
    }
}

const GetStyledTypeName = (v) => {
    switch (Number(v)) {
        case 1 : return <div style={{color:"red"}} className="typeName">ADMIN 👹</div>;
        case 2 : return <div style={{color:"red"}} className="typeName">MOD 🛡️</div>;
        case 3 : return <div style={{color:"gold"}} className="typeName">Premium 👑</div>;
        case 4 : return <></>;
        default : return <></>;
    }
}

const UserType = {
    IsPremium : IsPremium,
    IsMod : IsMod, 
    IsAdmin : IsAdmin,
    GetRecipeDivClass : GetRecipeDivClass,
    GetProfileImageClass : GetProfileImageClass,
    GetNickNameStyle : GetNickNameStyle,
    GetTypeName : GetTypeName,
    GetStyledTypeName : GetStyledTypeName
}

export default UserType;