/**
 * module to create indices and ingest csv file
 *
 * Created by Marlan on 9/20/2019.
 */

'use strict'

const fs = require ('fs');
const path = require ('path');

module.exports = {
    queryEs: function(queryString, size, fields, sort){
        const {Client} = require('@elastic/elasticsearch')
        const client = new Client({node: 'http://localhost:9200'})
        const csv = require('csvtojson')
        const esIndex = 'mozdata'
        const jsonQuery = JSON.parse(queryString);
        var sourceFields = fields ? JSON.parse(fields) : [];
        var sortOrder = sort ? JSON.parse(sort) : {};

        async function doQuery(Query, size, fields, sort) {
            await client.indices.refresh({ index: esIndex });
            const { body } = await client.search({
                index: esIndex,
                _source: fields,
                // type: '_doc', // uncomment this line if you are using Elasticsearch ≤ 6
                body: Query,
                sort : sort,
                size : size
            })
            return (body);
        }
        var response = doQuery(jsonQuery,size, sourceFields, sourceFields).catch(console.log);
        return response;
    },
    // Ingest file to elasticsearch index
    ingest: async function(csvFilePath) {
        const {Client} = require('@elastic/elasticsearch')
        const client = new Client({node: 'http://localhost:9200'})
        const csv = require('csvtojson')
        const esIndex = 'mozdata'

        /**
         * Function to create index mapping
         */
        async function putMapping () {
            console.log("Creating Mapping index");
            client.indices.putMapping({
                index: esIndex,
                body: {
                    properties: {
                        Date : { type: 'date' },
                        Google: { type: 'integer' },
                        'Google Base Rank' : { type : 'integer'},
                        Yahoo : { type : 'integer'},
                        Bing : { type : 'integer'},
                        'Global Monthly Searches' : { type : 'integer'},
                    }
                }
            }, (err,resp, status) => {
                if (err) {
                    console.error(err, status);
                }
                else {
                    console.log('Successfully Created Index');
        }
        });
        }

        /**
         * Asynchronous function to ingest file using promises
         */
        var doIngest = async function convert() {

            const jsonArray = await csv({delimiter:"\t"}).fromFile(csvFilePath);

            //Check if elastic cluster is running first
            client.ping((error) => {
                if (error) {
                    console.trace('elasticsearch cluster is down!');
                } console.log('All is well');
            });

            //Check if index exists.  Since we're working with single file inputs,
            //safe to delete and recreate index for each upload
            const exists = await client.indices.exists({
                index: esIndex
            })

            if (exists.body) {
                await client.indices.delete({
                    index: esIndex
                })
                await client.indices.create({
                    index: esIndex
                })
                putMapping();
            }

            /**
             * Function to batch index csv file in bulk.  Batch is hardcoded to
             * 500 records
             * @param index
             * @param data
             */
            const bulkIndex = function bulkindex(index, data) {
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
            let bulk = await bulkIndex(esIndex, jsonArray);
            let refresh = await client.indices.refresh({ index: esIndex });
            await new Promise((resolve, reject) => setTimeout(resolve, 3000));
        }
        //Execute ingestion
        return doIngest().catch(console.log);
    }
}