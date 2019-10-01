# moz
Moz Project

Project goal and specification:

To this end, we would like you to build a single page application that will allow the user to upload a CSV into the database and visualize the information contained therein.

The visualizations that we would like the user to see are:

Rankings for Google, Google Base Rank, Yahoo, and Bing over an arbitrary date range

Weighted rankings for all the above search engines over an arbitrary date range using the formula: (Rank for the search engine x (Global Monthly Searches / Max Global Monthly Searches))

We would like the user to be able to export CSV data that was used to generate the 2 visualizations above for the selected date range. Use a programming language of your choice to accomplish as much as you can.

1. Install elasticsearch https://www.elastic.co/downloads/elasticsearch
2. Run the cluster on localhost using the default port 9200
3. Install NodeJS https://nodejs.org/en/download/
4. Clone the moz repo
5. From the locally cloned folder run : npm install
6. Start the application with : npm run watch
7. The application is accessed on http://localhost:3000
