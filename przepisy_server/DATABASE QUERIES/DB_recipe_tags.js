const { db} = require('./DB');
const { insertTag, selectTag } = require('./DB_tag');

module.exports.updateRecipeTags = async (idRecipe, tagsTable) => {
    return new Promise(
		(resolve, reject) => {
		if(idRecipe && Array.isArray(tagsTable))
        {
            deleteRecipeDataTags(idRecipe)
			.then(() => {
				if(tagsTable.length > 0)
				{
					addTagsToRecipe(idRecipe, tagsTable)
					.then(() => {
						console.log(`\u001B[32mINFO: recipe tags updated ${idRecipe} \u001B[37m`)
					})
					.catch((err) => {
						console.log("\u001b[1;31m WARN: error accused - recipe tags update");
					})
				}
				resolve();
			})
            .catch((err) => {
                console.log(err);
            })
        }else{
			reject("error");
        };
    }
	);
}

const deleteRecipeDataTags = async (id) => {
	return new Promise(
		(resolve, reject) => {
		if(id)
		{db.query(
            'DELETE FROM tags_connection WHERE id_recipe = ?;', [id],
			function(error, results, fields){
				if (error) {
					reject(error)
				} else {
					resolve(results);
				}
			});
		}else{
			reject("error");
		}}
	);
};

module.exports.deleteRecipeDataTags = deleteRecipeDataTags;

addTagsToRecipe = async (idRecipe, tagsTable) => {
    return new Promise(
		(resolve, reject) => {
		if(idRecipe && Array.isArray(tagsTable))
		{
            for(let i=0; i<tagsTable.length; i++)
            {
                let tag = tagsTable[i];
                insertTag(tag)
                .then((v) => {
                    if(v != 0){
                        addTagToRecipe(idRecipe, v)
                        .catch((err) => console.log("\u001b[1;31m WARN: error accused - recipe tags update"));
                    }else{
                        selectTag(tag)
                        .then((v) => addTagToRecipe(idRecipe, v) )
                        .catch((err) => console.log("\u001b[1;31m WARN: error accused - recipe tags update"));
                    }
                })
            }
			resolve();
		}else{
			reject("error");
		}}
	);
};

addTagToRecipe = async (idRecipe, idTag) => {
    return new Promise(
		(resolve, reject) => {
        console.log(`\u001B[33m  Adding tag_connection rec:\u001B[31m${idRecipe}\u001B[33m, tag:\u001B[31m${idTag}\u001B[0m`);
		if(idRecipe && idTag)
		{
            db.query(
            'INSERT INTO tags_connection (id_recipe, id_tag) VALUES (?, ?);', [idRecipe, idTag],
			function(error, results, fields){
				if (error) {
					reject(error)
				} else {
					resolve(results);
				}
			});
		}else{
			reject("error");
		}}
	);
};