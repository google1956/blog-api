export function addLookup(databaseName: string, currentName_id: string, newFieldName: string, array: boolean) {
    let result = []
    if (array) {
        result.push({
            $addFields: {
                [newFieldName]: {
                    $map: {
                        input: `$${currentName_id}`,
                        as: newFieldName,
                        in: {
                            $convert: {
                                input: `$$${newFieldName}`,
                                to: "objectId",
                                // onError: { error: true },
                                // onNull: { isnull: true }
                            }
                        }
                    }
                }
            }
        })
    }
    else {
        result.push({
            $addFields: {
                [newFieldName]: {
                    $toObjectId: `$${currentName_id}`
                }
            }
        })
    }
    result.push({
        $lookup: {
            from: databaseName,
            localField: newFieldName,
            foreignField: "_id",
            as: newFieldName
        }

    })
    if (!array) {
        let unwindData = {
            $unwind: {
                path: `$${newFieldName}`,
                preserveNullAndEmptyArrays: true
            }
        }
        result.push(unwindData)
    }
    return result
}