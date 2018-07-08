const Rating = require('../models/index')['rating'];
const Movie = require('../models/index').movie;
const Comment = require('../models/index').comment;
const request = require('request-promise');

module.exports = {
    median(array) {
        array.sort(function(a, b) {
            return a - b;
        });
        let mid = array.length / 2;
        return mid % 1 ? array[mid - 0.5] : (array[mid - 1] + array[mid]) / 2;
    },
    getHoursDifference(date1, date2){
        let timeDiff = Math.abs(date1.getTime() - date2.getTime());
        let diffDays = Math.floor(timeDiff / (1000 * 3600));
        return diffDays;
    },
    getOrCreateRating(condition, values){
        return Rating
        .findOne({ where: condition })
        .then(function(obj) {
            if(obj) { // get
                return obj;
            }
            else { // create
                return Rating.create(values);
            }
        })
    },
    async requestJson(url, method='GET') {
        let options = {
            method: method,
            url: url,
            timeout: 10000
        };
        let data;
        try{
            data = await request(options);
        } catch(err) {
            res.status(502);
            throw new Error("Bad gateway");
        }
        if(!data){
            res.status(504);
            throw new Error("Timeout reached");
        }
        return JSON.parse(data);
    },
    checkForArguments(arguments, res) {
        for(const [key, value] of Object.entries(arguments)){
            if(value == '' || value == undefined) {
                res.status(400);
                throw new Error(`${key} not provided in request body`);
            }
        }
    },
    movieFindOne(conditions){
        return Movie.findOne({
            where: conditions,
            include: [{all: true}]
        });
    },
    movieFindAll(conditions){
        return Movie.findAll({
            where: conditions,
            include: [{all: true}]
        });
    }
};