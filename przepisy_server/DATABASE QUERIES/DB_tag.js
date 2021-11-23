const { db} = require('./DB');

module.exports.insertTag = async (tag) => {
	return new Promise(
		(resolve, reject) => {
        console.log(`${tag} -> ???`);
        if(tag)
		{
            db.query(
            'INSERT INTO tags (TEXT) VALUES ( ? ) ON DUPLICATE KEY UPDATE TEXT = ?;', [tag, tag],
			function(error, results, fields){
				if (error) {
					reject(error)
				} 
                resolve(results.insertId);
			});
		}else{
			reject("error");
		}}
	);
};

module.exports.selectTag = async (tag) => {
	return new Promise(
		(resolve, reject) => {
        console.log(`${tag} -> ???`);
        if(tag)
		{
            db.query(
                'SELECT * FROM tags WHERE TEXT = ?;', 
                [tag, tag],
                function(error, results, fields) {
                    if(error){
                        console.log(error);
                        return;
                    }
                    var tagID = JSON.parse(JSON.stringify(results[0])).id;
                    if(tagID){
                        resolve(tagID);
                    }else{
                        reject("error");
                    }
                }
            );
		}else{
			reject("error");
		}}
	);
};