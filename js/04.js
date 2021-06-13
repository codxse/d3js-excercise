d3.json('js/04.json')
    .then((data) => {
        console.log({data})
    })

async function getCSV() {
    var csv = await d3.csv('js/04.csv')
    console.log({csv})
}

getCSV()