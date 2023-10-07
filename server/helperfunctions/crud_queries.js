const insert = (tableName, values) => {
    console.log(values)
    let fieldsArray = Object.keys(values);
    const valuesArray = Object.keys(values).map(key => {
        return values[key];
    })

    const fieldsMapped = fieldsArray.map((field, index) => {
        return ((fieldsArray.length !== index) ? `${field}` : `${field}`)
    })
    const queryFieldsPart = `(` + fieldsMapped + `)`
    const valuesMapped = valuesArray.map((value, index) => {
        const value = ((valuesArray.length !== index) ? `${typeof (value) === 'object' ? `'${JSON.stringify(value)}'` : `'${value}'`}` : `'${value}'`);
        return value
    })
    const queryValuesPart = `(` + valuesMapped + `)`;

    console.log(queryFieldsPart, queryValuesPart);
    const query = `INSERT INTO ${tableName} ${fieldsArray.length ? queryFieldsPart : null} VALUES ${queryValuesPart}
    `
    console.log(query)
    return query
}
const updateById = (id, tableName, fields) => {
    const { disableDates, disableWeekDays, disableHourSlots, enableHourSlots, disableHoursRange, enabledDays } = fields;
    const qury = `UPDATE ${tableName}
        SET disableDates = '${JSON.stringify(disableDates)}', disableWeekDays = '${JSON.stringify(disableWeekDays)}',
        disableHourSlots =  '${JSON.stringify(disableHourSlots)}', enableHourSlots =' ${JSON.stringify(enableHourSlots)}',
        disableHoursRange='${JSON.stringify(disableHoursRange)}', enabledDays='${JSON.stringify(enabledDays)}'
        WHERE SID = ${id};`
    console.log(qury)
    return qury;
}
const getAll = (tableName) => {
    return `SELECT * FROM ${tableName}`;
}

module.exports = {
    insert,
    getAll,
    updateById
}
