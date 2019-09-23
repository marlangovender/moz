'use strict'

const {Client} = require('@elastic/elasticsearch')
const client = new Client({node: 'http://localhost:9200'})
const getUploadedFile = require('./uploadedFile');
const csvFilePath = getUploadedFile
const csv = require('csvtojson')
const esIndex = 'mozdata'

var ingest = async function convert() {
   // const jsonArray = await csv({delimiter:"\t"}).fromFile(csvFilePath);
 //   console.log(jsonArray.length);

    const exists = await client.indices.exists({
        index: esIndex
    })


    //console.log(exists)
    //deletes index and recreates empty
    /*if (exists.body) {
        await client.indices.delete({
            index: esIndex
        })
        await client.indices.create({
            index: esIndex
        })
    }*/
    /*for (let i=0; i < jsonArray.length; i++) {
        await client.index({
            index : esIndex,
            body : jsonArray[i]
        })
    }*/

    /*const bulkIndex = function bulkindex(index, data) {
        let bulkBody = [];
        let i = 0;

        data.forEach(item => {
            i++;
            bulkBody.push({
                index: {
                    _index: index,
                }
            });
        bulkBody.push(item);
        if (i%500 == 0) {
            client.bulk({body: bulkBody});
            bulkBody = [];
        }
        })
        client.bulk({body:bulkBody});
    };
    await bulkIndex(esIndex, jsonArray);*/
    await client.indices.refresh({ index: esIndex })

    // Let's search!
    const { body } = await client.search({
        index: esIndex,
        // type: '_doc', // uncomment this line if you are using Elasticsearch ≤ 6
        body: {
            aggs : {
                type_count : {
                    "terms" : { "field" : 'Keyword.keyword' }
                }
            }
        },
        size : 0
    })
    console.log(body.aggregations.type_count.buckets);

}
ingest().catch(console.log);







